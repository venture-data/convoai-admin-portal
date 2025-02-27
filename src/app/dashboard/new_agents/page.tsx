"use client"
import { useState } from "react"
import { MultiStepForm } from "@/components/ui/multi-step-form"
import { ModelConfig } from "@/components/agent-config/model-config"
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

  const initialConfig: AgentConfig = {
    model: {
      agentName: "",
      firstMessage: "",
      type: "inbound",
      systemPrompt: "",
      provider: "elevenlabs",
      model: "gemini-1.5-flash",
      language: "en",
      temperature: 0.7,
    },
    voice: {
      id: "",
      name: "",
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

  const validateVoiceConfig = (config: VoiceConfigType) => {
    return !!(config.id && config.name && config.provider);
  };

  const validateKnowledgeConfig = (config: KnowledgeConfigType) => {
    return config.files?.length>0;
  };

  const isModelValid = validateModelConfig(agentConfig.model);
  const isVoiceValid = validateVoiceConfig(agentConfig.voice);
  const isKnowledgeValid = validateKnowledgeConfig(agentConfig.knowledge);

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
          isCurrentStepValid={isModelValid && isVoiceValid && isKnowledgeValid}
          onSubmit={handleCreateAgent}
          isLoading={createAgent.isPending}
        >
          <ModelConfig agentConfig={agentConfig.model} setAgentConfig={(config) => handleAgentConfigChange("model", config)} />
          <VoiceConfig agentConfig={agentConfig.voice} setAgentConfig={(config) => handleAgentConfigChange("voice", config)} />
          <KnowledgeConfig agentConfig={agentConfig.knowledge} setAgentConfig={(config) => handleAgentConfigChange("knowledge", config)} />
          <ReviewConfig agentConfig={agentConfig} />
        </MultiStepForm>
      </div>
    </div>
  )
} 