"use client"
import React, { useState, useEffect } from "react"
import { useToast } from "@/app/hooks/use-toast"
import { TemplateSelectorModal } from "@/components/templates/template-selector-modal"
import { useAgent } from "@/app/hooks/use-agent"
import { useMobileMenu } from "@/store/use-mobile-menu"

import Navbar  from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import AgentConfigs from "./components/AgentConfigs"

import { AgentConfig, ModelConfig as ModelConfigType, KnowledgeConfig as KnowledgeConfigType, VoiceConfig as VoiceConfigType, Agent } from "./types"

export default function NewAgentPage() {
  const { toast } = useToast()
  const { toggle: toggleMobileMenu } = useMobileMenu()
  const [activeTab, setActiveTab] = useState("model")
  const [searchQuery, setSearchQuery] = useState("")
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
  const { createAgent, updateAgent, agents: backendAgents, isLoading, deleteAgent } = useAgent()
  const [isSaving, setIsSaving] = useState(false)
  const [deletingAgentId, setDeletingAgentId] = useState<string | null>(null);

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

  const selectedAgent = filteredAgents.find((agent: Agent) => agent.id === selectedAgentId);

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
      providerId: "alloy",
      name: "alloy",
      provider: "openai",
      details: {
        name: "alloy",
        high_quality_base_model_ids: ["tts-1"],
        preview_url: "",
        labels: [],
      },
      tts_options: {
        voice: "alloy",
        speed: 1.0
      }
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

  const handleSelectAgent = (agent: Agent) => {
    if (selectedAgentId === agent.id) return;
    
    setSelectedAgentId(agent.id);
    setAgentConfig({
      model: {
        ...agentConfig.model,
        agentName: agent.name,
        firstMessage: agent.greeting,
        systemPrompt: agent.system_prompt,
        model: agent.llm_options?.model || "gpt-4",
        description: agent.description,
        provider: agent.llm_provider,
        temperature: agent.llm_options?.temperature || 0.7,
        stt_model: agent.stt_options?.model || "nova-3-general",
        stt_model_telephony: agent.stt_options?.model_telephony || "nova-2-phonecall",
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
        id: agent.tts_options?.voice || "",
        providerId: agent.tts_options?.voice || "",
        name: agent.tts_options?.voice || "",
        provider: agent.tts_provider,
        details: {
          name: agent.tts_options?.voice || "",
          high_quality_base_model_ids: ["tts-1"],
          preview_url: "",
          labels: [],
        },
        tts_options: {
          voice: agent.tts_options?.voice || "",
          voice_name: agent.tts_options?.voice_name || "",
          speed: agent.tts_options?.speed || 1.0
        }
      },
      knowledge: {
        ...agentConfig.knowledge,
      }
    });
  };
  

  const handleCreateAgent = async () => {
    try {
      setIsSaving(true)
      if (selectedAgentId) {
        const data = {
          agent_id: selectedAgentId,
          name: agentConfig.model.agentName,
          description: agentConfig.model.description || "",
          system_prompt: agentConfig.model.systemPrompt || "",
          greeting: agentConfig.model.firstMessage || "",
          llm_provider: agentConfig.model.provider || "openai",
          tts_provider: agentConfig.voice?.provider || "openai",
          stt_provider: agentConfig.model.stt_provider || "deepgram",
          llm_options: {
            model: agentConfig.model.model || "gpt-4o-mini",
            temperature: Number(agentConfig.model.temperature || 0.7)
          },
          tts_options: {
            voice: agentConfig.voice?.tts_options?.voice || "alloy",
            voice_name: agentConfig.voice?.tts_options?.voice_name || "alloy",
            speed: Number(agentConfig.voice?.tts_options?.speed || 1.0)
          },
          stt_options: {
            model: agentConfig.model.stt_options?.model || "nova-3-general",
            model_telephony: agentConfig.model.stt_options?.model_telephony || "nova-2-phonecall"
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

  const handleDeleteAgent = async (agent: Agent) => {
    try {
      setDeletingAgentId(agent.id);
      await deleteAgent.mutateAsync(agent.id);
      toast({
        title: "Success",
        description: "Agent deleted successfully",
      });
      if (selectedAgentId === agent.id) {
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

  return (
    <div className="min-h-screen bg-[#080A0F] grid grid-rows-[auto_1fr] relative">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-[#F97316]/40 to-[#EF4444]/30 blur-[100px] rounded-full"></div>
      </div>
      <Navbar toggleMobileMenu={toggleMobileMenu} />

      <main className="grid grid-cols-[16rem_1fr] w-full h-full">
        <Sidebar 
          isLoading={isLoading} 
          displayedAgents={displayedAgents} 
          selectedAgentId={selectedAgentId} 
          handleSelectAgent={handleSelectAgent} 
          handleDeleteAgent={handleDeleteAgent} 
          deletingAgentId={deletingAgentId} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          setIsTemplateModalOpen={setIsTemplateModalOpen} 
        />

        <AgentConfigs 
          selectedAgent={selectedAgent} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          agentConfig={agentConfig}
          handleAgentConfigChange={handleAgentConfigChange}
          isLoading={isLoading}
          backendAgents={backendAgents}
          handleCreateAgent={handleCreateAgent}
          isSaving={isSaving}
          isFormValid={isFormValid}
          setIsTemplateModalOpen={setIsTemplateModalOpen}
        />
      </main>

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
                providerId: template.voice?.name || "alloy",
                details: {
                  name: "",
                  high_quality_base_model_ids: [],
                  preview_url: "",
                  labels: [],
                },
                tts_options: {
                  voice: template.voice?.name || "alloy",
                  speed: 1.0
                }
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
    </div>
  )
} 

