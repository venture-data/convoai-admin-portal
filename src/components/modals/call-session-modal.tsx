"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLiveKit } from "@/app/hooks/use-livekit";
import {
  AgentState,
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
import { X } from "lucide-react";

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
      <DialogContent className="max-w-3xl bg-black/80 backdrop-blur-xl border-orange-500/50 border shadow-[0_0_25px_rgba(249,115,22,0.2)]">
        <div className="absolute right-4 top-4 z-10">
          <button 
            onClick={() => {
              endCall();
              onClose();
            }}
            className="rounded-full p-1.5 bg-black/50 hover:bg-orange-500/20 border border-orange-500/30 transition-colors duration-200"
          >
            <X className="h-4 w-4 text-white/80 hover:text-white" />
          </button>
        </div>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white/90">Call with {agent?.name}</DialogTitle>
        </DialogHeader>
        <div className="bg-black/60 backdrop-blur-lg rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4 bg-gradient-to-b from-black/10 to-black/40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]"></div>
              <p className="text-white/80">Connecting to call...</p>
            </div>
          ) : isCallActive && connectionDetails ? (
            <div className="rounded-lg border-none overflow-hidden" data-lk-theme="default">
              <div className="p-4 bg-gradient-to-b from-black/80 to-black/90 backdrop-blur-lg">
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
    const [isPulsing, setIsPulsing] = useState(false);
  
    useEffect(() => {
      // Propagate state changes to parent component
      props.onStateChange(state);
      
      // Update pulsing effect based on state
      setIsPulsing(state === 'speaking' || state === 'listening');
    }, [props, state, audioTrack]);
    
    return (
      <div className="h-[200px] mx-auto flex flex-col items-center justify-center rounded-lg">
        {!audioTrack && (
          <div className="text-red-400 mb-4 p-2 rounded-md bg-red-500/10 border border-red-500/20">
            Audio track not available
          </div>
        )}
        
        <div className="w-[400px] h-[200px] flex items-center justify-center bg-gradient-to-r from-black/30 via-black/20 to-black/30 backdrop-blur-sm">
          <div className="relative flex items-center justify-center w-full h-full">
            {/* Glowing background effect */}
            <div className="absolute w-40 h-40 rounded-full bg-gradient-to-r from-orange-500/5 via-purple-500/5 to-orange-500/5 blur-xl"></div>
            
            {/* Base pulse circle */}
            <div className="absolute w-32 h-32 bg-orange-500/10 rounded-full backdrop-blur-sm"></div>
            
            {/* Animated pulse circles - using CSS animations instead of audio data */}
            <div 
              className={`absolute w-40 h-40 bg-orange-500/5 rounded-full transition-all duration-200 ease-out ${
                isPulsing ? 'animate-[pulse_1.5s_ease-in-out_infinite]' : ''
              }`}
            ></div>
            
            <div 
              className={`absolute w-48 h-48 bg-orange-500/5 rounded-full transition-all duration-300 ease-out ${
                isPulsing ? 'animate-[pulse_2s_ease-in-out_infinite]' : ''
              }`}
            ></div>
            
            {/* Inner glow based on state */}
            <div 
              className={`absolute w-28 h-28 rounded-full transition-opacity duration-500 ${
                state === 'speaking' 
                  ? 'bg-gradient-to-r from-orange-500/30 to-red-500/30 opacity-100 blur-[1px]' 
                  : state === 'listening' 
                    ? 'bg-gradient-to-r from-blue-500/30 to-indigo-500/30 opacity-100 blur-[1px]' 
                    : 'opacity-0'
              }`}
            ></div>
            
            {/* Core circle with state-based border */}
            <div 
              className={`
                relative w-24 h-24 rounded-full flex items-center justify-center border-2
                transition-all duration-300 ease-out backdrop-blur-sm
                ${state === 'speaking' 
                  ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/30 border-orange-500/60' 
                  : state === 'listening' 
                    ? 'bg-gradient-to-br from-blue-500/20 to-indigo-500/30 border-blue-500/60'
                    : 'bg-gradient-to-br from-slate-500/10 to-slate-600/20 border-white/20'
                }
                ${isPulsing ? 'shadow-[0_0_15px_5px_rgba(249,115,22,0.2)]' : ''}
              `}
            >
              <div className="text-white/90 text-xs font-medium">
                {state === "speaking" ? "Speaking" : 
                 state === "listening" ? "Listening" : 
                 state === "connecting" ? "Connecting" :
                 state === "thinking" ? "Thinking" : "Waiting"}
              </div>
            </div>
          </div>
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
                <X className="text-white hover:text-white/80" />
              </div>
            </DisconnectButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
