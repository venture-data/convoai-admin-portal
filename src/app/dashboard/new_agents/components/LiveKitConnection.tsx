import React from "react";
import { 
  AgentState, 
  LiveKitRoom, 
  RoomAudioRenderer 
} from "@livekit/components-react";
import { MediaDeviceFailure } from "livekit-client";
import { NoAgentNotification } from "@/components/NoAgentNotification";
import MiniVoiceVisualizer from "./MiniVoiceVisualizer";
import MiniControlBar from "./MiniControlBar";
import "@livekit/components-styles";

interface LiveKitConnectionProps {
  connectionDetails: { 
    accessToken: string; 
    roomName: string; 
    agentId: number; 
  } | null;
  onDeviceFailure: (error?: MediaDeviceFailure) => void;
  endCall: () => void;
  agentState: AgentState;
  setAgentState: (state: AgentState) => void;
  setHasStartedSpeaking: (value: boolean) => void;
  isLiveKitConnected: boolean;
  setIsLiveKitConnected: (connected: boolean) => void;
}

function LiveKitConnection({ 
  connectionDetails, 
  onDeviceFailure, 
  endCall, 
  agentState, 
  setAgentState, 
  setHasStartedSpeaking, 
  isLiveKitConnected, 
  setIsLiveKitConnected 
}: LiveKitConnectionProps) {
  const handleAgentStateChange = React.useCallback((state: AgentState) => {
    setAgentState(state);
    if (state === "speaking" || state === "thinking" || state === "listening") {
      setHasStartedSpeaking(true);
    }
  }, [setAgentState, setHasStartedSpeaking]);
  
  if (!connectionDetails) return null;

  return (
    <div 
      data-lk-theme="default" 
      className="h-full"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <LiveKitRoom
        token={connectionDetails.accessToken}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL || "wss://your-livekit-server.com"}
        connect={true}
        audio={true}
        video={false}
        onMediaDeviceFailure={onDeviceFailure}
        onDisconnected={endCall}
        onConnected={() => setIsLiveKitConnected(true)}
        className="grid grid-rows-[1fr_auto] h-full top-0 rounded-sm !bg-transparent"
        data-lk-theme="default"
      >
        <MiniVoiceVisualizer agentState={agentState} />
        <MiniControlBar 
          onStateChange={handleAgentStateChange} 
          isConnected={isLiveKitConnected}
        />
        <RoomAudioRenderer />
        <NoAgentNotification state={agentState} />
      </LiveKitRoom>
    </div>
  );
}

export default LiveKitConnection; 