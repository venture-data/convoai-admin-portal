"use client"

import { useState } from "react"
import { VoiceConfig } from "@/components/agent-config/voice-config"
import { ModelConfig } from "@/components/agent-config/model-config"
import { KnowledgeConfig } from "@/components/agent-config/knowledge-config"
import { ReviewConfig } from "@/components/agent-config/review-config"
import { useToast } from "@/app/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { TemplateSelectorModal } from "@/components/templates/template-selector-modal"
import { formatDistanceToNow } from "date-fns"

import { AgentConfig, ModelConfig as ModelConfigType, KnowledgeConfig as KnowledgeConfigType, VoiceConfig as VoiceConfigType } from "./types"
import { BotIcon } from "lucide-react"

interface Agent {
  id: number
  name: string
  description: string
  system_prompt: string
  greeting: string
  voice: string
  llm_model: string
  stt_model: string
  stt_model_telephony: string
  allow_interruptions: boolean
  interrupt_speech_duration: number
  interrupt_min_words: number
  min_endpointing_delay: number
  max_endpointing_delay: number
  active: boolean
  is_default: boolean
  max_nested_function_calls: number
  owner_id: number
  created_at: string
  updated_at: string
}

export default function NewAgentPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("model")
  const [searchQuery, setSearchQuery] = useState("")
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null)

  const tabs = [
    {
      id: "model",
      title: "Model",
      description: "Configure AI model settings and behavior"
    },
    {
      id: "voice",
      title: "Voice",
      description: "Configure voice settings and parameters"
    },
    {
      id: "knowledge",
      title: "Knowledge",
      description: "Upload and manage training materials"
    },
    {
      id: "review",
      title: "Review",
      description: "Review and test configuration"
    }
  ];

  const initialConfig: AgentConfig = {
    model: {
      agentName: "",
      firstMessage: "Hey, how can I help you today?",
      type: "inbound",
      systemPrompt: "You are a voice assistant created by LiveKit. Your interface with users will be voice. You should use short and concise responses, and avoiding usage of unpronouncable punctuation.",
      provider: "elevenlabs",
      model: "gpt-4o",
      language: "en",
      temperature: 0.7,
      description: "",
      stt_model: "nova-3-general",
      stt_model_telephony: "nova-2-phonecall",
      allow_interruptions: true,
      interrupt_speech_duration: 0.5,
      interrupt_min_words: 0,
      min_endpointing_delay: 0.5,
      max_endpointing_delay: 6,
      active: true,
      is_default: false,
      max_nested_function_calls: 1,
    },
    voice: {
      id: "",
      name: "alloy",
      provider: "elevenlabs",
      details: {
        name: "",
        high_quality_base_model_ids: [],
        preview_url: "",
        labels: [],
      },
    },
    knowledge: {
      files: []
    }
  }

  const [agentConfig, setAgentConfig] = useState<AgentConfig>(initialConfig)
  const [agents, setAgents] = useState<Agent[]>([])

  const handleAgentConfigChange = (key: string, config:ModelConfigType | KnowledgeConfigType | VoiceConfigType) => {
    setAgentConfig({ ...agentConfig,[key]: config });
    
    if (selectedAgentId) {
      const now = new Date().toISOString();
      setAgents(agents.map(agent => {
        if (agent.id === selectedAgentId) {
          return {
            ...agent,
            name: key === 'model' ? (config as ModelConfigType).agentName || agent.name : agent.name,
            description: key === 'model' ? (config as ModelConfigType).description || agent.description : agent.description,
            system_prompt: key === 'model' ? (config as ModelConfigType).systemPrompt || agent.system_prompt : agent.system_prompt,
            greeting: key === 'model' ? (config as ModelConfigType).firstMessage || agent.greeting : agent.greeting,
            voice: key === 'voice' ? (config as VoiceConfigType).name || agent.voice : agent.voice,
            llm_model: key === 'model' ? (config as ModelConfigType).model || agent.llm_model : agent.llm_model,
            stt_model: key === 'model' ? (config as ModelConfigType).stt_model || agent.stt_model : agent.stt_model,
            stt_model_telephony: key === 'model' ? (config as ModelConfigType).stt_model_telephony || agent.stt_model_telephony : agent.stt_model_telephony,
            allow_interruptions: key === 'model' ? (config as ModelConfigType).allow_interruptions || agent.allow_interruptions : agent.allow_interruptions,
            interrupt_speech_duration: key === 'model' ? (config as ModelConfigType).interrupt_speech_duration || agent.interrupt_speech_duration : agent.interrupt_speech_duration,
            interrupt_min_words: key === 'model' ? (config as ModelConfigType).interrupt_min_words || agent.interrupt_min_words : agent.interrupt_min_words,
            min_endpointing_delay: key === 'model' ? (config as ModelConfigType).min_endpointing_delay || agent.min_endpointing_delay : agent.min_endpointing_delay,
            max_endpointing_delay: key === 'model' ? (config as ModelConfigType).max_endpointing_delay || agent.max_endpointing_delay : agent.max_endpointing_delay,
            active: key === 'model' ? (config as ModelConfigType).active || agent.active : agent.active,
            is_default: key === 'model' ? (config as ModelConfigType).is_default || agent.is_default : agent.is_default,
            max_nested_function_calls: key === 'model' ? (config as ModelConfigType).max_nested_function_calls || agent.max_nested_function_calls : agent.max_nested_function_calls,
            updated_at: now,
          }
        }
        return agent;
      }));
    }
  }

  const validateModelConfig = (config: ModelConfigType) => {
    return !!(
      config.agentName &&
      config.firstMessage &&
      config.systemPrompt &&
      config.provider &&
      config.model &&
      config.language
    );
  };

  const validateVoiceConfig = (config: VoiceConfigType | undefined) => {
    if (!config) return false;
    return !!(config.name && config.provider);
  };

  const isModelValid = validateModelConfig(agentConfig.model);
  const isVoiceValid = validateVoiceConfig(agentConfig.voice);

  const isFormValid = isModelValid && isVoiceValid;

  const handleCreateAgent = async () => {
    try {
      const now = new Date().toISOString();
      const newAgent: Agent = {
        id: Date.now(),
        name: agentConfig.model.agentName || "",
        description: agentConfig.model.description || "",
        system_prompt: agentConfig.model.systemPrompt || "",
        greeting: agentConfig.model.firstMessage || "",
        voice: agentConfig.voice.name || "",
        llm_model: agentConfig.model.model || "",
        stt_model: agentConfig.model.stt_model || "",
        stt_model_telephony: agentConfig.model.stt_model_telephony || "",
        allow_interruptions: agentConfig.model.allow_interruptions || false,
        interrupt_speech_duration: agentConfig.model.interrupt_speech_duration || 0,
        interrupt_min_words: agentConfig.model.interrupt_min_words || 0,
        min_endpointing_delay: agentConfig.model.min_endpointing_delay || 0,
        max_endpointing_delay: agentConfig.model.max_endpointing_delay || 0,
        active: agentConfig.model.active || false,
        is_default: agentConfig.model.is_default || false,
        max_nested_function_calls: agentConfig.model.max_nested_function_calls || 0,
        owner_id: 1,
        created_at: now,
        updated_at: now,
      };
      
      setAgents([...agents, newAgent]);
      setSelectedAgentId(newAgent.id);
      
      toast({
        title: "Success",
        description: "Agent created successfully",
      });
    } catch (error) {
      console.error('Creation error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create agent",
        variant: "destructive",
      });
    }
  };

  const handleSelectAgent = (agent: Agent) => {
    if (selectedAgentId === agent.id) return;
    
    setSelectedAgentId(agent.id);
    setAgentConfig({
      model: {
        ...agentConfig.model,
        agentName: agent.name,
        firstMessage: agent.greeting,
        systemPrompt: agent.system_prompt,
        model: agent.llm_model,
        description: agent.description,
        stt_model: agent.stt_model,
        stt_model_telephony: agent.stt_model_telephony,
        allow_interruptions: agent.allow_interruptions,
        interrupt_speech_duration: agent.interrupt_speech_duration,
        interrupt_min_words: agent.interrupt_min_words,
        min_endpointing_delay: agent.min_endpointing_delay,
        max_endpointing_delay: agent.max_endpointing_delay,
        active: agent.active,
        is_default: agent.is_default,
        max_nested_function_calls: agent.max_nested_function_calls,
      },
      voice: {
        ...agentConfig.voice,
        name: agent.voice,
      },
      knowledge: {
        ...agentConfig.knowledge,
      }
    });
  };

  const filteredAgents = agents.filter((agent: Agent) => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedAgent = agents.find(agent => agent.id === selectedAgentId);

  return (
    <div className="min-h-screen bg-[#080A0F] flex flex-col relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-[#F97316]/40 to-[#EF4444]/30 blur-[100px] rounded-full"></div>
      </div>

      <div className="relative z-10 w-full border-b border-white/10 backdrop-blur-xl bg-[#1A1D25]/70">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">

              <h1 className="text-xl font-semibold text-white">Assistants</h1>
          </div>
          <button className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 12H16M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Talk with Assistant
          </button>
        </div>
      </div>

      <div className="flex flex-1 w-full relative z-10">
        <div className="w-64 backdrop-blur-xl bg-[#1A1D25]/70 border-r border-white/10">
          <div className="p-4">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search assistants..."
                className="w-full px-3 py-2 bg-[#1A1D25]/70 border border-white/10 rounded-md text-white placeholder:text-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              className="w-full px-4 py-2 mb-4 text-white bg-orange-500 rounded-md hover:bg-orange-600 transition-colors"
              onClick={() => setIsTemplateModalOpen(true)}
            >
              + Create Assistant
            </button>

            <div className="space-y-2">
              {filteredAgents.map((agent: Agent) => (
                <div 
                  key={agent.id} 
                  className={`p-2 rounded-md hover:bg-white/5 cursor-pointer transition-colors ${
                    selectedAgentId === agent.id ? 'bg-white/10' : ''
                  }`}
                  onClick={() => handleSelectAgent(agent)}
                >
                  <div className="flex items-center gap-3">
                    <BotIcon className="w-6 h-6 text-orange-500" />
                    <div>
                      <p className="font-small text-white">{agent.name}</p>
                      <p className="text-xs text-gray-400">
                        Last updated {formatDistanceToNow(new Date(agent.updated_at))} ago
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto backdrop-blur-xl bg-[#1A1D25]/70">
          <div className="py-4">
            <div className="max-w-4xl px-6">
              <div className="mb-6">
                <h1 className="text-lg font-semibold text-white mb-2">
                  {selectedAgent ? selectedAgent.name : 'New Assistant'}
                </h1>
                <p className="text-[13px] text-white/60">Configure your AI assistant&apos;s behavior and capabilities</p>
              </div>

              <div className="w-full">
                <div className="border-b border-white/10 mb-6">
                  <div className="flex items-center">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 text-sm font-medium transition-all ${
                          activeTab === tab.id
                            ? "text-white border-b-2 border-orange-500"
                            : "text-white/60 hover:text-white"
                        }`}
                      >
                        {tab.title}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  {activeTab === "model" && (
                    <ModelConfig 
                      agentConfig={agentConfig.model} 
                      setAgentConfig={(config) => handleAgentConfigChange("model", config)} 
                    />
                  )}

                  {activeTab === "voice" && (
                    <VoiceConfig 
                      provider={agentConfig.model.provider} 
                      agentConfig={agentConfig.voice} 
                      setAgentConfig={(config) => handleAgentConfigChange("voice", config)} 
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
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <Button 
                  onClick={handleCreateAgent} 
                  disabled={!isFormValid || selectedAgentId !== null}
                  className="bg-orange-500 text-white hover:bg-orange-600"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TemplateSelectorModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={(template) => {
          setAgentConfig(template);
          const now = new Date().toISOString();
          const newAgent: Agent = {
            id: Date.now(),
            name: template.model.agentName || "",
            description: template.model.description || "",
            system_prompt: template.model.systemPrompt || "",
            greeting: template.model.firstMessage || "",
            voice: template.voice.name || "",
            llm_model: template.model.model || "",
            stt_model: template.model.stt_model || "",
            stt_model_telephony: template.model.stt_model_telephony || "",
            allow_interruptions: template.model.allow_interruptions || false,
            interrupt_speech_duration: template.model.interrupt_speech_duration || 0,
            interrupt_min_words: template.model.interrupt_min_words || 0,
            min_endpointing_delay: template.model.min_endpointing_delay || 0,
            max_endpointing_delay: template.model.max_endpointing_delay || 0,
            active: template.model.active || false,
            is_default: template.model.is_default || false,
            max_nested_function_calls: template.model.max_nested_function_calls || 0,
            owner_id: 1,
            created_at: now,
            updated_at: now,
          };
          setAgents([...agents, newAgent]);
          setSelectedAgentId(newAgent.id);
        }}
      />
    </div>
  )
} 