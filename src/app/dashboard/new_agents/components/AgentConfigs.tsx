import { Loader2 } from "lucide-react";
import { BotIcon, Settings2, Mic, Brain, Volume2, FileText, Eye } from "lucide-react";
import { Agent, AgentConfig, ModelConfig as ModelConfigType, KnowledgeConfig as KnowledgeConfigType, VoiceConfig as VoiceConfigType } from "../types";
import { Button } from "@/components/ui/button";
import { VoiceConfig } from "@/components/agent-config/voice-config";
import { ModelConfig } from "@/components/agent-config/model-config";
import { KnowledgeConfig } from "@/components/agent-config/knowledge-config";
import { TranscriberConfig } from "@/components/agent-config/transcriber-config";
import { InteractionSettings } from "@/components/agent-config/interaction-settings";
import { ReviewConfig } from "@/components/agent-config/review-config";

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
  return (
    <section className="backdrop-blur-xl bg-[#1A1D25]/70 grid grid-rows-[auto_auto_1fr] w-full h-full">
    <div className="p-4 pb-0 w-full">
      <div className="grid grid-cols-[auto_1fr] gap-2 items-center max-w-4xl">
        <BotIcon className="w-8 h-8 text-orange-500" />
        <div>
          <h1 className="text-base font-semibold text-white">
            {selectedAgent ? selectedAgent.name : 'New Assistant'}
          </h1>
          <p className="text-[13px] text-white/60">Configure your AI assistant&apos;s behavior and capabilities</p>
        </div>
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
    <div className="overflow-y-auto px-4 pb-4 content-scroll w-full h-full">
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
              <ModelConfig 
                agentConfig={agentConfig.model} 
                setAgentConfig={(config) => handleAgentConfigChange("model", config)} 
              />
            )}

            {activeTab === "voice" && (
              <VoiceConfig 
                provider={agentConfig?.voice?.provider || ""} 
                agentConfig={agentConfig.voice} 
                setAgentConfig={(config) => handleAgentConfigChange("voice", config)} 
              />
            )}

            {activeTab === "transcriber" && (
              <TranscriberConfig 
                provider={agentConfig.model.provider} 
                agentConfig={agentConfig.model} 
                setAgentConfig={(config) => handleAgentConfigChange("model", config)} 
              />
            )}

            {activeTab === "interaction" && (
              <InteractionSettings 
                agentConfig={agentConfig.model} 
                setAgentConfig={(config) => handleAgentConfigChange("model", config)} 
              />
            )}

            {activeTab === "knowledge" && (
              <KnowledgeConfig 
                agentConfig={agentConfig.knowledge} 
                setAgentConfig={(config) => handleAgentConfigChange("knowledge", config)} 
              />
            )}

            {activeTab === "review" && (
              <ReviewConfig agentConfig={agentConfig} />
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
      </div>
    </div>
  </section>
  )
}

export default AgentConfigs;