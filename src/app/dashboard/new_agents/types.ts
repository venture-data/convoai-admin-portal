import { z } from "zod";

export const modelConfigSchema = z.object({
    id:z.string().optional(),
    agentName: z.string().min(1, "Agent name is required"),
    firstMessage: z.string().min(1, "First message is required"),
    systemPrompt: z.string().default("").optional(),
    type: z.enum(["inbound", "outbound"]).default("inbound").optional(),
    provider: z.enum(["elevenlabs", "openai","google"]).default("openai"),
    model: z.string().default("gpt-3.5-turbo").optional(),
    language: z.enum(["en", "ur"]).default("en").optional(),
    temperature: z.number().min(0).max(1).default(0.7).optional(),
    description: z.string().default("").optional(),
    stt_model: z.string().default("nova-3-general").optional(),
    stt_model_telephony: z.string().default("nova-2-phonecall").optional(),
    allow_interruptions: z.boolean().default(true).optional(),
    interrupt_speech_duration: z.number().min(0).default(0.5).optional(),
    interrupt_min_words: z.number().min(0).default(0).optional(),
    min_endpointing_delay: z.number().min(0).default(0.5).optional(),
    max_endpointing_delay: z.number().min(0).default(6).optional(),
    active: z.boolean().default(true).optional(),
    is_default: z.boolean().default(false).optional(),
    max_nested_function_calls: z.number().min(0).default(1).optional(),
  });

export const voiceConfigSchema = z.object({
  id: z.string().min(1, "Voice ID is required").optional(),
  name: z.string().min(1, "Voice name is required").optional(),
  provider: z.enum(["elevenlabs", "openai","google"]).default("openai").optional(),
  details: z.object({
    name: z.string().min(1, "Voice name is required").optional(),
    high_quality_base_model_ids: z.array(z.string()).min(1, "High quality base model IDs are required").optional(),
    preview_url: z.string().min(1, "Preview URL is required").optional(),
    labels: z.array(z.string()).min(1, "Labels are required").optional(),
  }).optional()
})

export const knowledgeConfigSchema = z.object({
    files: z.array(z.any()).optional(),
})

export const agentConfigSchema = z.object({
  model: z.lazy(() => modelConfigSchema),
  voice: z.lazy(() => voiceConfigSchema).optional(),
  knowledge: z.lazy(() => knowledgeConfigSchema).optional()
}).transform(data => ({
  ...data,
  voice: data.voice || {
    id: "",
    name: "alloy",
    provider: "openai",
    details: {
      name: "",
      high_quality_base_model_ids: [],
      preview_url: "",
      labels: [],
    }
  },
  knowledge: data.knowledge || { files: [] }
}))

export type AgentConfig = z.infer<typeof agentConfigSchema>
export type ModelConfig = z.infer<typeof modelConfigSchema>
export type VoiceConfig = z.infer<typeof voiceConfigSchema>
export type KnowledgeConfig = z.infer<typeof knowledgeConfigSchema>