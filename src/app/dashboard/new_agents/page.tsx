"use client"
import { useState } from "react"
import { MultiStepForm } from "@/components/ui/multi-step-form"
import { ModelConfig } from "@/components/agent-config/model-config"
import { ModelSettings } from "@/components/agent-config/model-settings"
import { InteractionSettings } from "@/components/agent-config/interaction-settings"
import { KnowledgeConfig } from "@/components/agent-config/knowledge-config"
import { ReviewConfig } from "@/components/agent-config/review-config"

import { AgentConfig, ModelConfig as ModelConfigType, KnowledgeConfig as KnowledgeConfigType, VoiceConfig as VoiceConfigType } from "./types"
import { VoiceConfig } from "@/components/agent-config/voice-config"
import { useAgent } from "@/app/hooks/use-agent"
import { useToast } from "@/app/hooks/use-toast"
import { useStepStore } from "@/store/use-step-store"



export default function NewAgentPage() {
  const { createAgent } = useAgent()
  const { toast } = useToast()
  const { reset: resetSteps } = useStepStore()
  // const router=useRouter()

  const initialConfig: AgentConfig = {
    model: {
      agentName: "", // maps to 'name' in API
      firstMessage: "Hey, how can I help you today?", // maps to 'greeting' in API
      type: "inbound", // not used in API
      systemPrompt: "You are a voice assistant created by LiveKit. Your interface with users will be voice. You should use short and concise responses, and avoiding usage of unpronouncable punctuation.",
      provider: "elevenlabs", // not used in API
      model: "gpt-4o", // maps to 'llm_model' in API
      language: "en", // not used in API
      temperature: 0.7, // not used in API
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
      id: "", // not used in API
      name: "alloy", // maps to 'voice' in API
      provider: "elevenlabs", // not used in API
      details: { // not used in API
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

  const resetForm = () => {
    setAgentConfig(initialConfig)
    resetSteps()
  }

  const handleAgentConfigChange = (key: string, config:ModelConfigType | KnowledgeConfigType | VoiceConfigType) => {
    setAgentConfig({ ...agentConfig,[key]: config });
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
      await createAgent.mutateAsync(agentConfig);
      toast({
        title: "Success",
        description: "Agent created successfully",
      });
      resetForm();
    } catch (error) {
      console.error('Creation error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create agent",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 min-h-screen flex gap-8">
      <div className="flex-1 w-full ">
        <MultiStepForm 
          isCurrentStepValid={isFormValid}
          onSubmit={handleCreateAgent}
          isLoading={createAgent.isPending}
        >
          <ModelConfig agentConfig={agentConfig.model} setAgentConfig={(config) => handleAgentConfigChange("model", config)} />
          <ModelSettings agentConfig={agentConfig.model} setAgentConfig={(config) => handleAgentConfigChange("model", config)} />
          <InteractionSettings agentConfig={agentConfig.model} setAgentConfig={(config) => handleAgentConfigChange("model", config)} />
          <VoiceConfig 
            provider={agentConfig.model.provider} 
            agentConfig={agentConfig.voice} 
            setAgentConfig={(config) => handleAgentConfigChange("voice", config)} 
          />
          <KnowledgeConfig 
            agentConfig={agentConfig.knowledge} 
            setAgentConfig={(config) => handleAgentConfigChange("knowledge", config)} 
          />
          <ReviewConfig agentConfig={agentConfig} />
        </MultiStepForm>
      </div>
    </div>
  )
} 