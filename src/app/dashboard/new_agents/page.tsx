import { MultiStepForm } from "@/components/ui/multi-step-form"
import { ModelConfig } from "@/components/agent-config/model-config"
import { VoiceConfig } from "@/components/agent-config/voice-config"
import { KnowledgeConfig } from "@/components/agent-config/knowledge-config"
import { ReviewConfig } from "@/components/agent-config/review-config"

export default function NewAgentPage() {
  return (
    <div className="p-6">
      <MultiStepForm>
        <ModelConfig />
        <VoiceConfig />
        <KnowledgeConfig />
        <ReviewConfig />
      </MultiStepForm>
    </div>
  )
} 