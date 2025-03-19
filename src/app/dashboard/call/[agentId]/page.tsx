"use client";

import React, { useState, useCallback} from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLiveKit } from "@/app/hooks/use-livekit";
import {
  AgentState,
  LiveKitRoom,
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";

import { MediaDeviceFailure } from "livekit-client";
import { NoAgentNotification } from "@/components/NoAgentNotification";

import "./calls.css"
import ControlBar from "@/components/livekit/ControlBar";
import SimpleVoiceAssistant from "@/components/livekit/SimpleVoiceAssistant";

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
              serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
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

