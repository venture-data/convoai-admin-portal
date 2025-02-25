import { z } from "zod";

export const modelConfigSchema = z.object({
    agentName: z.string().min(1, "Agent name is required"),
    firstMessage: z.string().min(1, "First message is required"),
    systemPrompt: z.string().min(1, "System prompt is required"),
    provider: z.enum(["elevenlabs", "openai"]).default("elevenlabs"),
    model: z.string().min(1, "Model is required"),
    language: z.enum(["en", "ur"]).default("en"),
    temperature: z.number().min(0).max(1).default(0.7),
  });

export const voiceConfigSchema = z.object({
  id: z.string().min(1, "Voice ID is required"),
  name: z.string().min(1, "Voice name is required"),
  provider: z.enum(["elevenlabs", "openai"]).default("elevenlabs"),
  details: z.object({
    name: z.string().min(1, "Voice name is required"),
    high_quality_base_model_ids: z.array(z.string()).min(1, "High quality base model IDs are required"),
    preview_url: z.string().min(1, "Preview URL is required"),
    labels: z.array(z.string()).min(1, "Labels are required"),
  })
})

export const knowledgeConfigSchema = z.object({
    files: z.array(z.any()),
})

export const agentConfigSchema = z.object({
  model: z.lazy(() => modelConfigSchema),
  voice: z.lazy(() => voiceConfigSchema),
  knowledge: z.lazy(() => knowledgeConfigSchema)
})

export type AgentConfig = z.infer<typeof agentConfigSchema>
export type ModelConfig = z.infer<typeof modelConfigSchema>
export type VoiceConfig = z.infer<typeof voiceConfigSchema>
export type KnowledgeConfig = z.infer<typeof knowledgeConfigSchema>