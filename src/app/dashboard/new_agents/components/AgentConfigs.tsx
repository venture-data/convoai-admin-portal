import { Loader2, Phone, PhoneOff, X, Mic, GripHorizontal } from "lucide-react";
import { BotIcon, Settings2, Brain, Volume2, FileText, Eye } from "lucide-react";
import { Agent, AgentConfig, ModelConfig as ModelConfigType, KnowledgeConfig as KnowledgeConfigType, VoiceConfig as VoiceConfigType } from "../types";
import { Button } from "@/components/ui/button";
import { VoiceConfig } from "@/components/agent-config/voice-config";
import { ModelConfig } from "@/components/agent-config/model-config";
import { KnowledgeConfig } from "@/components/agent-config/knowledge-config";
import { TranscriberConfig } from "@/components/agent-config/transcriber-config";
import { InteractionSettings } from "@/components/agent-config/interaction-settings";
import { ReviewConfig } from "@/components/agent-config/review-config";
import TransitionEffect from "@/components/ui/transitioneffect";
import { useState, useCallback, useEffect, useRef } from "react";
import { useLiveKit } from "@/app/hooks/use-livekit";
import type { AgentProfileResponse } from "@/app/types/agent-profile";
import {
  AgentState,
  LiveKitRoom,
  RoomAudioRenderer,
  VoiceAssistantControlBar,
  useVoiceAssistant,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { MediaDeviceFailure } from "livekit-client";
import { NoAgentNotification } from "@/components/NoAgentNotification";

const tabs = [
  {
    id: "model",
    title: "Model",
    description: "Configure AI model settings and behavior",
    icon: Brain   
  },
  {
    id: "voice",
    title: "Voice",
    description: "Configure voice settings and parameters",
    icon: Volume2
  },
  {
    id: "transcriber",
    title: "Transcriber",
    description: "Configure transcriber settings and parameters",
    icon: Mic
  },
  {
    id: "interaction",
    title: "Interaction",
    description: "Configure conversation behavior and timing",
    icon: Settings2
  },
  {
    id: "knowledge",
    title: "Knowledge",
    description: "Upload and manage training materials",
    icon: FileText
  },
  {
    id: "review",
    title: "Review",
    description: "Review and test configuration",
    icon: Eye
  }
];

interface AgentConfigsProps {
  selectedAgent: Agent | undefined;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  agentConfig: AgentConfig;
  handleAgentConfigChange: (key: string, config: ModelConfigType | KnowledgeConfigType | VoiceConfigType) => void;
  isLoading: boolean;
  backendAgents: { items?: Agent[] } | undefined;
  handleCreateAgent: () => Promise<void>;
  isSaving: boolean;
  isFormValid: boolean;
  setIsTemplateModalOpen: (isOpen: boolean) => void;
}

function AgentConfigs({
  selectedAgent,
  activeTab,
  setActiveTab,
  agentConfig,
  handleAgentConfigChange,
  isLoading,
  backendAgents,
  handleCreateAgent,
  isSaving,
  isFormValid,
  setIsTemplateModalOpen
}: AgentConfigsProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const callContainerRef = useRef<HTMLDivElement>(null);
  const contentScrollRef = useRef<HTMLDivElement>(null);
  
  const handleTalkNow = useCallback(() => {
    setIsCallActive(true);
  }, []);
  
  return (
    <section className="backdrop-blur-xl bg-[#1A1D25]/70 grid grid-rows-[auto_auto_1fr] w-full h-full relative">
      <div className="p-4 pb-0 w-full">
        <div className="grid grid-cols-[auto_1fr_auto] gap-2 items-center max-w-4xl">
          <BotIcon className="w-8 h-8 text-orange-500" />
          <div>
            <h1 className="text-base font-semibold text-white">
              {selectedAgent ? selectedAgent.name : 'New Assistant'}
            </h1>
            <p className="text-[13px] text-white/60">Configure your AI assistant&apos;s behavior and capabilities</p>
          </div>
          {selectedAgent && (
            <Button 
              onClick={handleTalkNow}
              size="sm"
              className="!bg-gradient-to-r !from-orange-500/10 !to-orange-600/10 !border !border-orange-500/30 hover:!bg-orange-500/20 text-white"  
            >
              <Phone className="w-4 h-4 mr-2 text-orange-400" />
              Talk to Assistant
            </Button>
          )}
        </div>
      </div>

      <div className="px-4 w-full">
        <div className="border-b border-white/10 mb-6 w-full">
          <div className="grid grid-flow-col auto-cols-max gap-2 w-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "model" | "voice" | "transcriber" | "interaction" | "knowledge" | "review")}
                className={`px-4 py-2 text-sm font-medium transition-all grid grid-flow-col gap-2 items-center ${
                  activeTab === tab.id
                    ? "text-[#F97316] border-b-2 border-[#F97316]"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <div className={activeTab === tab.id ? "text-[#F97316]" : "text-white/60"}>
                  <tab.icon className="w-4 h-4" />
                </div>
                {tab.title}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div ref={contentScrollRef} className="overflow-y-auto px-4 pb-4 content-scroll w-full h-full">
        <style jsx global>{`
            .content-scroll::-webkit-scrollbar {
              width: 6px;
            }
            
            .content-scroll::-webkit-scrollbar-track {
              background: transparent;
            }
            
            .content-scroll::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 20px;
            }

            .content-scroll::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.2);
            }

            /* For Firefox */
            .content-scroll {
              scrollbar-width: thin;
              scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
            }
          `}</style>
        <div className="w-full">
          {!isLoading && (!backendAgents?.items || backendAgents.items.length === 0) ? (
            <div className="grid place-items-center text-center p-8 w-full">
              <BotIcon className="w-12 h-12 text-orange-500/50 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Assistants Available</h3>
              <p className="text-sm text-white/60 mb-4">
                You haven&apos;t created any assistants yet. Create your first assistant to get started.
              </p>
              <Button 
                className="bg-gradient-to-r from-orange-500 to-red-500"
                onClick={() => setIsTemplateModalOpen(true)}
              >
                Create Your First Assistant
              </Button>
            </div>
          ) : (
            <div className="w-full">
              {activeTab === "model" && (
                <TransitionEffect>    
                  <ModelConfig 
                    agentConfig={agentConfig.model} 
                    setAgentConfig={(config) => handleAgentConfigChange("model", config)} 
                  />
                </TransitionEffect>
              )}

              {activeTab === "voice" && (
              <TransitionEffect>
                <VoiceConfig 
                  provider={agentConfig?.voice?.provider || ""} 
                  agentConfig={agentConfig.voice} 
                  setAgentConfig={(config) => handleAgentConfigChange("voice", config)} 
                />
              </TransitionEffect>
              )}

              {activeTab === "transcriber" && (
                <TransitionEffect>
                  <TranscriberConfig 
                    provider={agentConfig.model.provider} 
                    agentConfig={agentConfig.model} 
                    setAgentConfig={(config) => handleAgentConfigChange("model", config)} 
                  />
                </TransitionEffect>
              )}

              {activeTab === "interaction" && (
                <TransitionEffect>
                  <InteractionSettings 
                    agentConfig={agentConfig.model} 
                    setAgentConfig={(config) => handleAgentConfigChange("model", config)} 
                  />
                </TransitionEffect>
              )}

              {activeTab === "knowledge" && (
                <TransitionEffect>
                  <KnowledgeConfig 
                    agentConfig={agentConfig.knowledge} 
                    setAgentConfig={(config) => handleAgentConfigChange("knowledge", config)} 
                  />
                </TransitionEffect>
              )}

              {activeTab === "review" && (
                <TransitionEffect>
                  <ReviewConfig agentConfig={agentConfig} />
                </TransitionEffect>
              )}

              {(!isLoading && backendAgents?.items && backendAgents.items.length > 0) && (
                <div className="grid justify-items-end mt-8 w-full">
                  <Button 
                    onClick={handleCreateAgent} 
                    disabled={!isFormValid || isSaving}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white hover:bg-orange-600"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {isCallActive && <div className="h-[350px] call-spacer" />}
        </div>
      </div>
      <div className="absolute bottom-8 right-6 z-[1000] max-w-[350px] w-full">
        <TransitionEffect>
          {isCallActive && selectedAgent && (
            <MiniCallInterface 
              agent={selectedAgent as unknown as AgentProfileResponse} 
              onClose={() => setIsCallActive(false)} 
              callContainerRef={callContainerRef as React.RefObject<HTMLDivElement>}
            />
          )}
        </TransitionEffect>
      </div>
    </section>
  )
}

function MiniCallInterface({ agent, onClose, callContainerRef }: { agent: AgentProfileResponse, onClose: () => void, callContainerRef: React.RefObject<HTMLDivElement>  }) {
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
  
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if ((agentState === "speaking" || agentState === "thinking" || agentState === "listening") && !hasStartedSpeaking) {
      setHasStartedSpeaking(true);
    }
  }, [agentState, hasStartedSpeaking]);
  
  useEffect(() => {
    startCall();
  }, []);

  useEffect(() => {
    if (isCallActive && !hasStartedSpeaking) {
      const timer = setTimeout(() => {
        setHasStartedSpeaking(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isCallActive, hasStartedSpeaking]);


  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const fixedX = position.x;
      
      const newY = e.clientY - dragStartPos.current.y;
      
      const miniAssistant = callContainerRef.current;
      if (!miniAssistant) return;
      
      const rect = miniAssistant.getBoundingClientRect();
      const height = rect.height;
      
      const maxY = window.innerHeight - height;
      
      setPosition({
        x: fixedX,
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  }, [isDragging, callContainerRef, position.x]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);


  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

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

  return (
    <div 
      ref={callContainerRef} 
      className="fixed top-80 right-5 max-w-[350px] w-full shadow-2xl rounded-lg overflow-hidden shadow-orange-900/20 bg-gradient-to-b from-black/90 to-black/95 backdrop-blur-xl border border-orange-500/30 transition-all duration-300"
      style={{ 
        transform: `translate(${position.x}px, ${position.y}px) scale(${isDragging ? 0.98 : 1})`,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: 1000,
        transition: isDragging ? 'transform 0.05s ease' : 'transform 0.2s ease'
      }}
    >
      <div 
        className="p-3 flex items-center justify-between border-b border-white/10"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <GripHorizontal className="size-4 text-white/30 mr-1 cursor-grab" />
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
        <button 
          onClick={endCall} 
          className="rounded-full p-1.5 hover:bg-white/10 transition-colors"
        >
          <X className="size-4 text-white/70" />
        </button>
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
        ) : isCallActive && connectionDetails ? (
          <div data-lk-theme="default" className="h-full">
            <LiveKitRoom
              token={connectionDetails.accessToken}
              serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL || "wss://your-livekit-server.com"}
              connect={true}
              audio={true}
              video={false}
              onMediaDeviceFailure={onDeviceFailure}
              onDisconnected={endCall}
              className="grid grid-rows-[1fr_auto] h-full"
              options={{
                publishDefaults: {
                  dtx: true,
                  red: true,
                },
                adaptiveStream: true,
                dynacast: true
              }}
            >
              <MiniVoiceVisualizer agentState={agentState} />
              <MiniControlBar onStateChange={(state) => {
                setAgentState(state);
                if (state === "speaking" || state === "thinking" || state === "listening") {
                  setHasStartedSpeaking(true);
                }
              }} />
              <RoomAudioRenderer />
              <NoAgentNotification state={agentState} />
            </LiveKitRoom>
          </div>
        ) : null}
      </div>
      
      <div className="p-2 flex justify-between items-center bg-gradient-to-r from-black/40 to-black/50 border-t border-white/5">
        <div className="text-xs text-white/50 ml-2">Talk naturally with your AI assistant</div>
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
}

function MiniVoiceVisualizer({ agentState }: { agentState: AgentState }) {
  const [isPulsing, setIsPulsing] = useState(false);
  
  useEffect(() => {
    setIsPulsing(agentState === 'speaking' || agentState === 'listening');
  }, [agentState]);
  
  return (
    <div className="flex justify-center items-center h-full">
      <div className="relative flex items-center justify-center w-full h-full">
        <div className="absolute w-20 h-20 bg-orange-500/5 rounded-full"></div>
        
        <div 
          className={`absolute w-28 h-28 bg-orange-500/5 rounded-full transition-all duration-200 ease-out ${
            isPulsing ? 'animate-[pulse_1.5s_ease-in-out_infinite]' : ''
          }`}
        ></div>
        
        <div 
          className={`absolute w-36 h-36 bg-orange-500/5 rounded-full transition-all duration-300 ease-out ${
            isPulsing ? 'animate-[pulse_2s_ease-in-out_infinite]' : ''
          }`}
        ></div>

        <div 
          className={`
            relative w-14 h-14 rounded-full flex items-center justify-center border-2
            transition-all duration-300 ease-out backdrop-blur-sm
            ${agentState === 'speaking' 
              ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/30 border-orange-500/60' 
              : agentState === 'listening' 
                ? 'bg-gradient-to-br from-blue-500/20 to-indigo-500/30 border-blue-500/60'
                : 'bg-gradient-to-br from-slate-500/10 to-slate-600/20 border-white/20'
            }
            ${isPulsing ? 'shadow-[0_0_10px_rgba(249,115,22,0.2)]' : ''}
          `}
        >
          <div className="text-white/90 text-[10px] font-medium">
            {agentState === "speaking" ? "Speaking" : 
             agentState === "listening" ? "Listening" : 
             agentState === "connecting" ? "Connecting" :
             agentState === "thinking" ? "Thinking" : "Ready"}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniControlBar({ onStateChange }: { onStateChange: (state: AgentState) => void, onEndCall?: () => void }) {
  const { state } = useVoiceAssistant();
  
  useEffect(() => {
    onStateChange(state);
  }, [state, onStateChange]);
  
  return (
    <div className="flex justify-center items-center py-2">
      {state !== "disconnected" && state !== "connecting" && (
        <div className="flex items-center gap-1.5">
          <VoiceAssistantControlBar controls={{ leave: false }} />
        </div>
      )}
    </div>
  );
}
export default AgentConfigs;
