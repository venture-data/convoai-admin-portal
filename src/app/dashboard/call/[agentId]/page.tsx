"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { AnimatePresence, motion } from "framer-motion";
import { MediaDeviceFailure } from "livekit-client";
import { NoAgentNotification } from "@/components/NoAgentNotification";
import { CloseIcon } from "@/components/CloseIcon";

import "./calls.css"

export default function CallPage() {
  const params = useParams();
  const agentId = params.agentId;
  const router = useRouter();
  const { createAccessToken } = useLiveKit();

  const [isCallActive, setIsCallActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState<{
    accessToken: string;
    roomName: string;
    agentId: number;
  } | null>(null);
  const [agentState, setAgentState] = useState<AgentState>("disconnected");

  const handleGoBack = () => {
    router.push("/dashboard/agents");
  };

  const handleToggleCall = async () => {
    if (!isCallActive) {
      try {
        setIsLoading(true);
        const data = await createAccessToken.mutateAsync(String(agentId));
        console.log("Connection data:", data);
        setConnectionDetails(data);
        setIsCallActive(true);
      } catch (error) {
        console.error("Failed to create access token:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setConnectionDetails(null);
      setIsCallActive(false);
    }
  };

  const onDeviceFailure = useCallback((error?: MediaDeviceFailure) => {
    console.error(error);
    alert(
      "Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab"
    );
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <Button 
        variant="outline" 
        onClick={handleGoBack} 
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Agents
      </Button>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Call with Agent</h1>
        <div className="text-lg mb-6">
          <span className="font-semibold">Agent ID:</span> {agentId}
        </div>

        <Button 
          onClick={handleToggleCall}
          variant={isCallActive ? "destructive" : "default"}
          className="w-full md:w-auto"
          disabled={isLoading}
        >
          {isLoading ? "Connecting..." : isCallActive ? "End Call" : "Start Call"}
        </Button>

        {isCallActive && connectionDetails && (
          <div className="mt-6 p-4 bg-gray-100 rounded-md h-[500px] overflow-hidden" data-lk-theme="default">
            <LiveKitRoom
              token={connectionDetails.accessToken}
              serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL || "wss://your-livekit-server.com"}
              connect={true}
              audio={true}
              video={false}
              onMediaDeviceFailure={onDeviceFailure}
              onDisconnected={() => {
                setConnectionDetails(null);
                setIsCallActive(false);
              }}
              className="grid grid-rows-[2fr_1fr] items-center h-full"
            >
              <SimpleVoiceAssistant onStateChange={setAgentState} />
              <ControlBar 
                onConnectButtonClicked={() => {}} 
                agentState={agentState} 
              />
              <RoomAudioRenderer />
              <NoAgentNotification state={agentState} />
            </LiveKitRoom>
          </div>
        )}
      </div>
    </div>
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
    <div className="h-[300px] max-w-[90vw] mx-auto flex flex-col items-center justify-center rounded-md">
      {!audioTrack && <div className="text-red-500 mb-4">Audio track not available</div>}
      
      <div className="w-full h-[200px] flex items-center justify-center rounded-md ">
        <BarVisualizer
          state={state}
          barCount={20}
          trackRef={audioTrack}
          className="w-full h-full rounded-md"
          options={{ 
            minHeight: 5, 
            maxHeight: 90
          }}
        />
    
      </div>
      
      <div className="mt-4 text-sm">
        State: <span className="font-bold">{state}</span>
      </div>
    </div>
  );
}

function ControlBar(props: { onConnectButtonClicked: () => void; agentState: AgentState }) {
  return (
    <div className="relative h-[100px]">
      <AnimatePresence>
        {props.agentState === "disconnected" && (
          <motion.button
            initial={{ opacity: 0, top: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, top: "-10px" }}
            transition={{ duration: 1, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="uppercase absolute left-1/2 -translate-x-1/2 px-4 py-2 bg-white text-black rounded-md"
            onClick={() => props.onConnectButtonClicked()}
          >
            Start a conversation
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {props.agentState !== "disconnected" && props.agentState !== "connecting" && (
          <motion.div
            initial={{ opacity: 0, top: "10px" }}
            animate={{ opacity: 1, top: 0 }}
            exit={{ opacity: 0, top: "-10px" }}
            transition={{ duration: 0.4, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="flex h-8 absolute left-1/2 -translate-x-1/2  justify-center"
          >
            <VoiceAssistantControlBar controls={{ leave: false }} />
            <DisconnectButton>
              <CloseIcon />
            </DisconnectButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 