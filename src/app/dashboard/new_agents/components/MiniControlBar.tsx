import { useEffect } from "react";
import { 
  AgentState, 
  VoiceAssistantControlBar, 
  useVoiceAssistant 
} from "@livekit/components-react";

interface MiniControlBarProps {
  onStateChange: (state: AgentState) => void;
  onEndCall?: () => void;
  isConnected: boolean;
}

function MiniControlBar({ onStateChange, isConnected }: MiniControlBarProps) {
  const { state } = useVoiceAssistant();
  
  useEffect(() => {
    onStateChange(state);
  }, [state, onStateChange]);
  
  return (
    <div className="flex justify-center items-center py-2">
      {isConnected && state !== "disconnected" && state !== "connecting" && (
        <div className="flex items-center gap-1.5">
          <VoiceAssistantControlBar 
            controls={{ 
              leave: false,
              microphone: true 
            }}
            className="!bg-transparent"
          />
        </div>
      )}
    </div>
  );
}

export default MiniControlBar; 