import { z } from "zod";

export const modelConfigSchema = z.object({
    agentName: z.string().min(1, "Agent name is required"),
    firstMessage: z.string().min(1, "First message is required"),
    systemPrompt: z.string().min(1, "System prompt is required"),
    provider: z.enum(["openai", "anthropic"]).default("openai"),
    model: z.enum(["gpt-4o-mini", "gpt-3.5-turbo"]).default("gpt-4o-mini"),
    language: z.enum(["en", "ur"]).default("en"),
    temperature: z.number().min(0).max(1).default(0.7),
  });

export const voiceConfigSchema = z.object({
  voice: z.enum(["male", "female"]).default("female"),
  accent: z.enum(["american", "british", "australian"]).default("american"),
  speed: z.number().min(0.5).max(2).default(1),
  pitch: z.number().min(-20).max(20).default(0)
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