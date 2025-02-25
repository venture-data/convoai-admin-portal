"use client"
import { useState } from "react"
import { MultiStepForm } from "@/components/ui/multi-step-form"
import { ModelConfig } from "@/components/agent-config/model-config"
import { KnowledgeConfig } from "@/components/agent-config/knowledge-config"
import { ReviewConfig } from "@/components/agent-config/review-config"

import { AgentConfig, ModelConfig as ModelConfigType, KnowledgeConfig as KnowledgeConfigType, VoiceConfig as VoiceConfigType } from "./types"
import { VoiceConfig } from "@/components/agent-config/voice-config"

export default function NewAgentPage() {
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({
    model: {
      agentName: "Sample Agent",
      firstMessage: "Hello, how can I help you today?",
      systemPrompt: "You are a helpful assistant that can answer questions and help with tasks.",
      provider: "elevenlabs",
      model: "gemini-1.5-flash",
      language: "en",
      temperature: 0.7,
    },
    voice:{
      id:"",
      name:"",
      provider:"elevenlabs",
      details:{
        name:"",
        high_quality_base_model_ids:[],
        preview_url:"",
        labels:[],
      },
    },
    knowledge: {
     files: []
    }
  });

  const handleAgentConfigChange = (key: string, config:ModelConfigType | KnowledgeConfigType | VoiceConfigType) => {
    setAgentConfig({ ...agentConfig,[key]: config });
  }

  return (
    <div className="container mx-auto p-6 min-h-screen flex gap-8">
      <div className="flex-1 w-full ">
        <MultiStepForm>
          <ModelConfig agentConfig={agentConfig.model} setAgentConfig={(config) => handleAgentConfigChange("model", config)} />
          <VoiceConfig agentConfig={agentConfig.voice} setAgentConfig={(config) => handleAgentConfigChange("voice", config)} />
          <KnowledgeConfig agentConfig={agentConfig.knowledge} setAgentConfig={(config) => handleAgentConfigChange("knowledge", config)} />
          <ReviewConfig agentConfig={agentConfig} />
        </MultiStepForm>
      </div>
    </div>
  )
} 