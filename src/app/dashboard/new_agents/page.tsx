"use client"

import { useState } from "react"
import { MultiStepForm } from "@/components/ui/multi-step-form"
import { ModelConfig } from "@/components/agent-config/model-config"
import { VoiceConfig } from "@/components/agent-config/voice-config"
import { KnowledgeConfig } from "@/components/agent-config/knowledge-config"
import { ReviewConfig } from "@/components/agent-config/review-config"

import { AgentConfig, ModelConfig as ModelConfigType, VoiceConfig as VoiceConfigType, KnowledgeConfig as KnowledgeConfigType } from "./types"

export default function NewAgentPage() {
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({
    model: {
      agentName: "sAMPLE AGENT",
      firstMessage: "Hello, how can I help you today?",
      systemPrompt: "You are a helpful assistant that can answer questions and help with tasks.",
      provider: "openai",
      model: "gpt-4o-mini",
      language: "en",
      temperature: 0.7,
    },
    voice: {
      voice: "female",
      accent: "american",
      speed: 1,
      pitch: 0
    },
    knowledge: {
     files: []
    }
  });

  const handleAgentConfigChange = (key: string, config:ModelConfigType | VoiceConfigType | KnowledgeConfigType) => {
    setAgentConfig({ ...agentConfig,[key]: config });
  }

  return (
    <div className="container mx-auto p-6 min-h-screen flex gap-8">
      <div className="flex-1 w-full ">
        <MultiStepForm>
          <ModelConfig agentConfig={agentConfig.model} setAgentConfig={(config) => handleAgentConfigChange("model", config)} />
          <VoiceConfig />
          <KnowledgeConfig agentConfig={agentConfig.knowledge} setAgentConfig={(config) => handleAgentConfigChange("knowledge", config)} />
          <ReviewConfig />
        </MultiStepForm>
      </div>
      {/* <div className="hidden lg:block relative h-screen">
        <Image 
          src="/group-logo.png" 
          alt="agent-config" 
          width={500} 
          height={500} 
          className="sticky right-0 w- h-auto object-contain"
        />
        <Image src="/autobot-3d-logo.png" alt="agent-config" width={500} height={500} className="absolute bottom-0 right-40 top-0" />
      </div> */}
    </div>
  )
} 