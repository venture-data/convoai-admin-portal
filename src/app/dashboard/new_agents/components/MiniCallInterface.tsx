import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLiveKit } from "@/app/hooks/use-livekit";
import { AgentState } from "@livekit/components-react";
import { BotIcon, GripVertical } from "lucide-react";
import { PhoneOff, X } from "lucide-react";
import { MediaDeviceFailure } from "livekit-client";
import type { AgentProfileResponse } from "@/app/types/agent-profile";
import LiveKitConnection from "./LiveKitConnection";
import "@livekit/components-styles";

interface MiniCallInterfaceProps {
  agent: AgentProfileResponse;
  onClose: () => void;
  callContainerRef: React.RefObject<HTMLDivElement>;
}

function MiniCallInterface({ agent, onClose, callContainerRef }: MiniCallInterfaceProps) {
  const { createAccessToken } = useLiveKit();
  const [isCallActive, setIsCallActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState<{
    accessToken: string;
    roomName: string;
    agentId: number;
  } | null>(null);
  const [agentState, setAgentState] = useState<AgentState>("disconnected");
  const [hasStartedSpeaking, setHasStartedSpeaking] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 374, y: window.innerHeight - 450 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const startCall = useCallback(async () => {
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
  }, [agent, createAccessToken, onClose]);

  useEffect(() => {
    startCall();
  }, []); 
  
  useEffect(() => {
    if ((agentState === "speaking" || agentState === "thinking" || agentState === "listening") && !hasStartedSpeaking) {
      setHasStartedSpeaking(true);
    }
  }, [agentState, hasStartedSpeaking]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        let newX = e.clientX - dragOffset.x;
        let newY = e.clientY - dragOffset.y;
        const maxX = window.innerWidth - 350;
        const maxY = window.innerHeight - 50;
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
        
        setPosition({ x: newX, y: newY });
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  useEffect(() => {
    if (isCallActive && !hasStartedSpeaking) {
      const timer = setTimeout(() => {
        setHasStartedSpeaking(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isCallActive, hasStartedSpeaking]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      return; 
    }
    if (target.closest('.draggable-area')) {
      setIsDragging(true);
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      e.preventDefault(); 
    }
  };

  const endCall = () => {
    setIsLiveKitConnected(false);
    setConnectionDetails(null);
    setIsCallActive(false);
    setAgentState("disconnected");
    setHasStartedSpeaking(false);
    onClose();
  };

  const onDeviceFailure = useCallback((error?: MediaDeviceFailure) => {
    console.error(error);
    alert(
      "Error acquiring microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab"
    );
    onClose();
  }, [onClose]);

  const [isLiveKitConnected, setIsLiveKitConnected] = useState(false);

  useEffect(() => {
    return () => {
      if (isCallActive) {
        setIsCallActive(false);
      }
    };
  }, [isCallActive]);

  const handleConnectionStatus = useCallback((connected: boolean) => {
    setIsLiveKitConnected(connected);
  }, []);

  const content = (
    <div 
      ref={callContainerRef} 
      className="fixed shadow-2xl rounded-lg overflow-hidden shadow-orange-900/20 bg-gradient-to-b from-black/90 to-black/95 backdrop-blur-xl border border-orange-500/30 transition-all duration-300 max-w-[350px] w-full"
      style={{ 
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 2000,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
      onMouseDown={handleMouseDown}
    >
      <div 
        className="p-3 flex items-center justify-between border-b border-white/10 draggable-area cursor-grab"
      >
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <BotIcon className="size-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">{agent.name}</h3>
            <p className="text-xs text-white/50">
              {agentState === "thinking" ? "Thinking..." : 
               agentState === "speaking" ? "Speaking..." : 
               agentState === "listening" ? "Listening..." : 
               agentState === "connecting" ? "Connecting..." : "Ready"}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="mr-2 text-white/50">
            <GripVertical className="size-4" />
          </div>
          <button 
            onClick={endCall} 
            className="rounded-full p-1.5 hover:bg-white/10 transition-colors"
          >
            <X className="size-4 text-white/70" />
          </button>
        </div>
      </div>
      
      <div className="p-3 min-h-[200px] max-h-[300px]">
        {(isLoading || !hasStartedSpeaking) ? (
          <div className="flex flex-col items-center justify-center h-full space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]"></div>
            <p className="text-white/70 text-sm">
              {isLoading ? "Connecting to agent..." : 
               agentState === "connecting" ? "Connecting..." : 
               agentState === "thinking" ? "Agent is thinking..." :
               "Waiting for response..."}
            </p>
          </div>
        ) : (
          <LiveKitConnection 
            connectionDetails={connectionDetails}
            onDeviceFailure={onDeviceFailure}
            endCall={endCall}
            agentState={agentState}
            setAgentState={setAgentState}
            setHasStartedSpeaking={setHasStartedSpeaking}
            isLiveKitConnected={isLiveKitConnected}
            setIsLiveKitConnected={handleConnectionStatus}
          />
        )}
      </div>
      
      <div className="p-2 flex justify-between items-center bg-gradient-to-r from-black/40 to-black/50 border-t border-white/5">
        <div className="text-xs text-white/50 ml-2">
          <span className="opacity-60">Drag header to move • Talk naturally</span>
        </div>
        <button 
          onClick={endCall}
          className="flex items-center gap-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-2 py-1 rounded text-xs font-medium transition-colors"
        >
          <PhoneOff className="size-3" />
          End
        </button>
      </div>
    </div>
  );

  return typeof window !== 'undefined' ? createPortal(content, document.body) : null;
}

export default MiniCallInterface; 