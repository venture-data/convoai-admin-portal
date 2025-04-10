"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLiveKit } from "@/app/hooks/use-livekit";
import {
  AgentState,
  BarVisualizer,
  DisconnectButton,
  LiveKitRoom,
  RoomAudioRenderer,
  VoiceAssistantControlBar,
  useVoiceAssistant,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { MediaDeviceFailure } from "livekit-client";
import { NoAgentNotification } from "@/components/NoAgentNotification";
import type { AgentProfileResponse } from "@/app/types/agent-profile";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

interface CallSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: AgentProfileResponse;
}

export function CallSessionModal({ isOpen, onClose, agent }: CallSessionModalProps) {
  const { createAccessToken } = useLiveKit();
  const [isCallActive, setIsCallActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState<{
    accessToken: string;
    roomName: string;
    agentId: number;
  } | null>(null);
  const [agentState, setAgentState] = useState<AgentState>("disconnected");
  
  useEffect(() => {
    if (isOpen && !isCallActive) {
      console.log("change")
      startCall();
    }
  }, [isOpen,agent]);

  const startCall = async () => {
    try {
      setIsLoading(true);
      if (!agent || !agent.id) {
        throw new Error("Agent not found");
      }
      const queryParams = new URLSearchParams({
        agent_id: agent.id.toString(),
        identity: `user-${Date.now()}`,
        name: agent.name
      }).toString();

      const data = await createAccessToken.mutateAsync(queryParams);
      setConnectionDetails(data);
      setIsCallActive(true);
    } catch (error) {
      console.error("Failed to create access token:", error);
      alert("Failed to start call. Please try again.");
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const endCall = () => {
    setConnectionDetails(null);
    setIsCallActive(false);
    setAgentState("disconnected");
    onClose();
  };

  const onDeviceFailure = useCallback((error?: MediaDeviceFailure) => {
    console.error(error);
    alert(
      "Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab"
    );
    onClose();
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={()=>{
      endCall()
      onClose()
    }}>
      <DialogContent className="max-w-3xl bg-[#1A1D25] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-200">Call with {agent?.name}</DialogTitle>
        </DialogHeader>
        <div className="backdrop-blur-xl bg-[#1A1D25]/70 rounded-lg">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
              <p className="text-gray-300">Connecting to call...</p>
            </div>
          ) : isCallActive && connectionDetails ? (
            <div className="rounded-lg border border-gray-800 overflow-hidden" data-lk-theme="default">
              <div className="p-4 backdrop-blur-xl bg-[#1A1D25]/90">
                <LiveKitRoom
                  token={connectionDetails.accessToken}
                  serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL || "wss://your-livekit-server.com"}
                  connect={true}
                  audio={true}
                  video={false}
                  onMediaDeviceFailure={onDeviceFailure}
                  onDisconnected={endCall}
                  className="grid grid-rows-[2fr_1fr] items-center min-h-[500px]"
                >
                  <SimpleVoiceAssistant onStateChange={setAgentState} />
                  <ControlBar 
                    onEndCall={endCall}
                    agentState={agentState} 
                  />
                  <RoomAudioRenderer />
                  <NoAgentNotification state={agentState} />
                </LiveKitRoom>
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SimpleVoiceAssistant(props: { onStateChange: (state: AgentState) => void }) {
    const { state, audioTrack } = useVoiceAssistant();
  
    useEffect(() => {
      if (audioTrack?.publication) {
        const track = audioTrack.publication;
        console.log("Track publication details:", {
          trackSid: track.trackSid,
          trackName: track.trackName,
          source: track.source,
          isMuted: track.isMuted,
          isSubscribed: track.isSubscribed,
          isEnabled: track.isEnabled,
        });
      }
    }, [audioTrack]);
  
    useEffect(() => {
      props.onStateChange(state);
      console.log("Voice assistant state:", state);
      console.log("Audio track available:", !!audioTrack);
      
      if (audioTrack) {
        console.log("Audio track details:", {
          trackSid: audioTrack.publication?.trackSid,
          trackName: audioTrack.publication?.trackName,
          source: audioTrack.source,
          isMuted: audioTrack.publication?.isMuted
        });
      }
    }, [props, state, audioTrack]);
    
    return (
      <div className="h-[200px]  mx-auto flex flex-col items-center justify-center rounded-lg">
        {!audioTrack && (
          <div className="text-red-400 mb-4 p-2 rounded-md bg-red-500/10 border border-red-500/20">
            Audio track not available
          </div>
        )}
        
        <div className="w-[400px] h-[200px] flex items-center justify-center rounded-lg backdrop-blur-sm bg-[#1A1D25]/90 border border-gray-800">
          <div className="w-full h-full p-4">
            <BarVisualizer
              state={state}
              barCount={15}
              trackRef={audioTrack}
              className="w-full h-full flex items-center justify-center gap-[3px]"
              options={{ 
                minHeight: 10,
                maxHeight: 100
              }}
            />
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-400">
          Status: <span className="font-medium text-gray-200">{state}</span>
        </div>
      </div>
    );
  }
  

function ControlBar(props: { onEndCall: () => void; agentState: AgentState }) {
  return (
    <div className="relative h-[100px]">
      <AnimatePresence>
        {props.agentState !== "disconnected" && props.agentState !== "connecting" && (
          <motion.div
            initial={{ opacity: 0, top: "10px" }}
            animate={{ opacity: 1, top: 0 }}
            exit={{ opacity: 0, top: "-10px" }}
            transition={{ duration: 0.4, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="flex h-10 absolute left-1/2 -translate-x-1/2 justify-center items-center gap-2"
          >
            <VoiceAssistantControlBar controls={{ leave: false }} />
            <DisconnectButton onClick={props.onEndCall}>
              <div className="cursor-pointer">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white hover:text-white/80">
                  <path d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                </svg>
              </div>
            </DisconnectButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 