"use client"

import { useState, useEffect } from "react"
import { VoiceConfig } from "@/components/agent-config/voice-config"
import { ModelConfig } from "@/components/agent-config/model-config"
import { KnowledgeConfig } from "@/components/agent-config/knowledge-config"
import { ReviewConfig } from "@/components/agent-config/review-config"
import { useToast } from "@/app/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { TemplateSelectorModal } from "@/components/templates/template-selector-modal"
import { formatDistanceToNow } from "date-fns"
import { Loader2 } from "lucide-react"
import { BotIcon } from "lucide-react"
import { useAgent } from "@/app/hooks/use-agent"
import { motion, AnimatePresence } from "framer-motion"
import { CallModal } from "@/components/modals/call-modal"
import type { AgentProfileResponse } from "@/app/types/agent-profile"

import { AgentConfig, ModelConfig as ModelConfigType, KnowledgeConfig as KnowledgeConfigType, VoiceConfig as VoiceConfigType } from "./types"
import { InteractionSettings } from "@/components/agent-config/interaction-settings"

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
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
  const { createAgent, updateAgent, agents: backendAgents, isLoading, deleteAgent } = useAgent()
  const [isSaving, setIsSaving] = useState(false)
  const [deletingAgentId, setDeletingAgentId] = useState<string | null>(null);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  useEffect(() => {
    if (!selectedAgentId && backendAgents && backendAgents.items?.length > 0) {
      const firstAgent = backendAgents.items[0];
      handleSelectAgent(firstAgent);
    }
  }, [backendAgents, selectedAgentId]);

  const filteredAgents = backendAgents?.items ?? [];
  const displayedAgents = filteredAgents.filter((agent: Agent) => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedAgent = filteredAgents.find((agent: Agent) => agent.id.toString() === selectedAgentId);

  const initialConfig: AgentConfig = {
    model: {
      agentName: "",
      description: "",
      firstMessage: "Hey, how can I help you today?",
      systemPrompt: "You are a voice assistant created by LiveKit. Your interface with users will be voice. You should use short and concise responses, and avoiding usage of unpronouncable punctuation.",
      provider: "openai",
      model: "gpt-4",
      language: "en",
      temperature: 0.7,
      type: "inbound",
      stt_model: "nova-3-general",
      stt_model_telephony: "nova-2-phonecall",
      allow_interruptions: true,
      interrupt_speech_duration: 0.5,
      interrupt_min_words: 0,
      min_endpointing_delay: 0.5,
      max_endpointing_delay: 6.0,
      active: true,
      is_default: false,
      max_nested_function_calls: 1,
    },
    voice: {
      id: "",
      name: "alloy",
      provider: "openai",
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
  };

  const [agentConfig, setAgentConfig] = useState<AgentConfig>(initialConfig);

  const handleAgentConfigChange = (key: string, config:ModelConfigType | KnowledgeConfigType | VoiceConfigType) => {
    setAgentConfig({ ...agentConfig,[key]: config });
  }

  const validateModelConfig = (config: ModelConfigType) => {
    return !!config.agentName;
  };

  const isModelValid = validateModelConfig(agentConfig.model);
  const isFormValid = isModelValid;

  const handleCreateAgent = async () => {
    try {
      setIsSaving(true)
      if (selectedAgentId) {
        // Update existing agent
        const data = {
          agent_id: selectedAgentId,
          name: agentConfig.model.agentName,
          description: agentConfig.model.description || "",
          system_prompt: agentConfig.model.systemPrompt || "",
          greeting: agentConfig.model.firstMessage || "",
          llm_provider: agentConfig.model.provider || "openai",
          tts_provider: agentConfig.voice?.provider || "openai",
          llm_options: {
            model: agentConfig.model.model || "gpt-4",
            temperature: Number(agentConfig.model.temperature || 0.7)
          },
          tts_options: {
            voice: agentConfig.voice?.name || "alloy",
            speed: 1.0
          },
          allow_interruptions: Boolean(agentConfig.model.allow_interruptions),
          interrupt_speech_duration: Number(agentConfig.model.interrupt_speech_duration || 0.5),
          interrupt_min_words: Number(agentConfig.model.interrupt_min_words || 0),
          min_endpointing_delay: Number(agentConfig.model.min_endpointing_delay || 0.5),
          max_endpointing_delay: Number(agentConfig.model.max_endpointing_delay || 6.0),
          active: Boolean(agentConfig.model.active),
          is_default: Boolean(agentConfig.model.is_default),
          max_nested_function_calls: Number(agentConfig.model.max_nested_function_calls || 1)
        };

        await updateAgent.mutateAsync(data);
      } else {
        // Create new agent
        const createdAgent = await createAgent.mutateAsync(agentConfig);
        if (createdAgent) {
          setSelectedAgentId(createdAgent.id);
        }
      }
      toast({
        title: "Success",
        description: selectedAgentId ? "Agent updated successfully" : "Agent created successfully",
      });
    } catch (error) {
      console.error('Operation error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save agent",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false)
    }
  };

  const handleSelectAgent = (agent: Agent) => {
    if (selectedAgentId === agent.id.toString()) return;
    
    setSelectedAgentId(agent.id.toString());
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

  const handleDeleteAgent = async (agent: Agent) => {
    try {
      setDeletingAgentId(agent.id.toString());
      await deleteAgent.mutateAsync(agent.id.toString());
      toast({
        title: "Success",
        description: "Agent deleted successfully",
      });
      if (selectedAgentId === agent.id.toString()) {
        setSelectedAgentId(null);
        setAgentConfig(initialConfig);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete agent",
        variant: "destructive",
      });
    } finally {
      setDeletingAgentId(null);
    }
  };

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
      id: "interaction",
      title: "Interaction",
      description: "Configure conversation behavior and timing"
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

  return (
    <div className="min-h-screen bg-[#080A0F] flex flex-col relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-[#F97316]/40 to-[#EF4444]/30 blur-[100px] rounded-full"></div>
      </div>

      <div className="relative z-10 w-full border-b border-white/10 backdrop-blur-xl bg-[#1A1D25]/70">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-white">Assistants</h1>
          </div>
          <button className="py-2 px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
            onClick={() => selectedAgentId ? setIsCallModalOpen(true) : toast({
              title: "No agent selected",
              description: "Please select an agent first to start a call",
              variant: "destructive"
            })}>
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
              <Input
                type="text"
                placeholder="Search assistants..."
                className="w-full bg-[#1A1D25]/70 border-white/10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              className="w-full mb-4 bg-gradient-to-r from-orange-500 to-red-500"
              onClick={() => setIsTemplateModalOpen(true)}
            >
              + Create Assistant
            </Button>

            <div className="space-y-2">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="p-2">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-6 w-6 rounded" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <AnimatePresence mode="popLayout">
                  {displayedAgents?.map((agent: Agent) => (
                    <motion.div
                      key={agent.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.2 }}
                      className={`p-2 rounded-md hover:bg-white/5 cursor-pointer transition-colors ${
                        selectedAgentId === agent.id.toString() ? 'bg-white/10' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3" onClick={() => handleSelectAgent(agent)}>
                          <BotIcon className="w-6 h-6 text-orange-500" />
                          <div>
                            <p className="text-sm text-white">{agent.name}</p>
                            <p className="text-xs text-gray-400">
                              {agent.updated_at ? `Last updated ${formatDistanceToNow(new Date(agent.updated_at))} ago` : 'Recently updated'}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10 relative"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAgent(agent);
                          }}
                          disabled={deletingAgentId === agent.id.toString()}
                        >
                          {deletingAgentId === agent.id.toString() ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <motion.svg 
                              width="16" 
                              height="16" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              xmlns="http://www.w3.org/2000/svg"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </motion.svg>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto backdrop-blur-xl bg-[#1A1D25]/70">
          <div className="py-4">
            <div className="max-w-4xl px-6">
              <div className="mb-6 flex items-center gap-2">
                <BotIcon className="w-8 h-8 text-orange-500" />
                <div className="flex flex-col">
                  <h1 className="text-base font-semibold text-white">
                    {selectedAgent ? selectedAgent.name : 'New Assistant'}
                  </h1>
                <p className="text-[13px] text-white/60">Configure your AI assistant&apos;s behavior and capabilities</p>
                </div>
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
                  {!isLoading && (!backendAgents?.items || backendAgents.items.length === 0) ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
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
                    <>
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
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-8">
                {(!isLoading && backendAgents?.items && backendAgents.items.length > 0) && (
                  <Button 
                    onClick={handleCreateAgent} 
                    disabled={!isFormValid || isSaving}
                    className="bg-orange-500 text-white hover:bg-orange-600"
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <TemplateSelectorModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={async (template) => {
          try {
            const newAgent: AgentConfig = {
              model: {
                id:crypto.randomUUID(),
                agentName: template.model.agentName || "",
                description: template.model.description || "",
                firstMessage: template.model.firstMessage || "Hey, how can I help you today?",
                systemPrompt: template.model.systemPrompt || "You are a voice assistant created by LiveKit. Your interface with users will be voice. You should use short and concise responses, and avoiding usage of unpronouncable punctuation.",
                provider: template.model.provider === "google" ? "google" : "openai",
                model: template.model.model || "gpt-4",
                temperature: template.model.temperature || 0.7,
                language: "en",
                type: "inbound" as const,
                stt_model: template.model.stt_model || "nova-3-general",
                stt_model_telephony: template.model.stt_model_telephony || "nova-2-phonecall",
                allow_interruptions: template.model.allow_interruptions !== false,
                interrupt_speech_duration: template.model.interrupt_speech_duration || 0.5,
                interrupt_min_words: template.model.interrupt_min_words || 0,
                min_endpointing_delay: template.model.min_endpointing_delay || 0.5,
                max_endpointing_delay: template.model.max_endpointing_delay || 6.0,
                active: template.model.active !== false,
                is_default: template.model.is_default === true,
                max_nested_function_calls: template.model.max_nested_function_calls || 1,
              },
              voice: {
                name: template.voice?.name || "alloy",
                provider: template.voice?.provider === "google" ? "google" : "openai",
                id: "",
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
            };

            const createdAgent = await createAgent.mutateAsync(newAgent);
            setAgentConfig(newAgent);
            setSelectedAgentId(createdAgent.id);
            setIsTemplateModalOpen(false);

            toast({
              title: "Success",
              style:{
                backgroundColor: "#1A1D25",
                color: "#fff",
              },
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
        }}
      />

      <CallModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        agent={selectedAgent as AgentProfileResponse}
      />
    </div>
  )
} 