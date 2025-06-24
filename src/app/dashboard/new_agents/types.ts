import { z } from "zod";

export const ModelConfig = z.object({
  id: z.string().optional(),
  agentName: z.string(),
  description: z.string().optional(),
  firstMessage: z.string().optional(),
  systemPrompt: z.string().optional(),
  provider: z.enum(["elevenlabs", "openai", "google", "uplift", "cartesia"]),
  model: z.string().optional(),
  type: z.enum(["inbound", "outbound"]).optional(),
  language: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  stt_provider: z.enum(["deepgram", "google", "openai"]).optional(),
  stt_options: z.object({
    model: z.enum([
      // Deepgram models
      "nova-general", "nova-phonecall", "nova-meeting",
      "nova-2-general", "nova-2-meeting", "nova-2-phonecall",
      "nova-2-finance", "nova-2-conversationalai", "nova-2-voicemail",
      "nova-2-video", "nova-2-medical", "nova-2-drivethru",
      "nova-2-automotive", "nova-3", "nova-3-general",
      "enhanced-general", "enhanced-meeting", "enhanced-phonecall",
      "enhanced-finance", "base", "meeting", "phonecall", "finance",
      "conversationalai", "voicemail", "video",
      "whisper-tiny", "whisper-base", "whisper-small",
      "whisper-medium", "whisper-large",
      "whisper-1"
    ]),
    model_telephony: z.enum([
      // Deepgram telephony models
      "nova-phonecall", "nova-2-phonecall", "enhanced-phonecall", "phonecall"
    ])
  }).optional(),
  tts_provider: z.enum(["elevenlabs", "openai", "cartesia"]).optional(),
  tts_options: z.object({
    model: z.enum([
      "eleven_monolingual_v1", "eleven_multilingual_v1",
      "eleven_multilingual_v2", "eleven_turbo_v2",
      "eleven_turbo_v2_5", "eleven_flash_v2_5",
      "eleven_flash_v2",
      "tts-1", "tts-1-hd", "gpt-4o-mini-tts",
      "sonic-english", "sonic-multilingual"
    ]).optional(),
    voice: z.string().optional(),
    voice_name: z.string().optional(),
    speed: z.number().min(0.1).max(2).default(1.0).optional(),
  }).optional(),
  llm_options: z.object({
    model: z.enum([
      // OpenAI models
      "gpt-4.1", "gpt-4.1-mini", "gpt-4.1-nano",
      "gpt-4o", "gpt-4o-2024-05-13", "gpt-4o-mini",
      "gpt-4o-mini-2024-07-18", "gpt-4-turbo",
      "gpt-4-turbo-2024-04-09", "gpt-4-turbo-preview",
      "gpt-4-0125-preview", "gpt-4-1106-preview",
      "gpt-4-vision-preview", "gpt-4-1106-vision-preview",
      "gpt-4", "gpt-4-0314", "gpt-4-0613",
      "gpt-4-32k", "gpt-4-32k-0314", "gpt-4-32k-0613",
      "gpt-3.5-turbo", "gpt-3.5-turbo-16k",
      "gpt-3.5-turbo-0301", "gpt-3.5-turbo-0613",
      "gpt-3.5-turbo-1106", "gpt-3.5-turbo-16k-0613",
      // Google models
      "gemini-2.0-flash-001", "gemini-2.0-flash-lite-preview-02-05",
      "gemini-2.0-pro-exp-02-05", "gemini-1.5-pro"
    ]).optional(),
    temperature: z.number().min(0).max(2).optional()
  }).optional(),
  stt_model: z.string().optional(),
  stt_model_telephony: z.string().optional(),
  allow_interruptions: z.boolean().optional(),
  interrupt_speech_duration: z.number().optional(),
  interrupt_min_words: z.number().optional(),
  min_endpointing_delay: z.number().optional(),
  max_endpointing_delay: z.number().optional(),
  active: z.boolean().optional(),
  is_default: z.boolean().optional(),
  max_nested_function_calls: z.number().optional(),
  profile_options: z.object({
    background_audio: z.object({
      loop: z.boolean().default(true),
      volume: z.number().min(0).max(1).default(0.3),
      enabled: z.boolean().default(true),
      audio_path: z.string().default("office-ambience.mp3"),
    }).optional(),
    end_call_function: z.boolean().optional(),
    end_call_message: z.string().optional(),
    end_call_phrases: z.array(z.string()).optional(),
  }).optional(),
});

export type ModelConfig = z.infer<typeof ModelConfig>;

export const voiceConfigSchema = z.object({
  id: z.string().min(1, "Voice ID is required").optional(),
  name: z.string().min(1, "Voice name is required"),
  providerId: z.string().optional(),
  provider: z.enum(["elevenlabs", "openai","google","uplift"]).default("openai").optional(),
  details: z.object({
    name: z.string().min(1, "Voice name is required"),
    high_quality_base_model_ids: z.array(z.string()).min(1, "High quality base model IDs are required").optional(),
    preview_url: z.string().min(1, "Preview URL is required").optional(),
    labels: z.array(z.string()).min(1, "Labels are required").optional(),
  }).optional(),
  tts_options: z.object({
    model: z.enum([
      "eleven_monolingual_v1", "eleven_multilingual_v1",
      "eleven_multilingual_v2", "eleven_turbo_v2",
      "eleven_turbo_v2_5", "eleven_flash_v2_5",
      "eleven_flash_v2",
      "tts-1", "tts-1-hd", "gpt-4o-mini-tts",
      "sonic-english", "sonic-multilingual"
    ]).optional(),
    voice: z.string().optional(),
    voice_name: z.string().optional(),
    speed: z.number().min(0.1).max(2).default(1.0).optional(),
  }).optional(),
  profile_options: z.object({
    background_audio: z.object({
      loop: z.boolean().default(true),
      volume: z.number().min(0).max(1).default(0.3),
      enabled: z.boolean().default(true),
      audio_path: z.string().default("office-ambience.mp3"),
    }),
    end_call_function: z.boolean().optional(),
    end_call_message: z.string().optional(),
    end_call_phrases: z.array(z.string()).optional(),
  }).optional(),
})

export const knowledgeConfigSchema = z.object({
    files: z.array(z.any()).optional(),
})

export const agentConfigSchema = z.object({
  model: z.lazy(() => ModelConfig),
  voice: z.lazy(() => voiceConfigSchema).optional(),
  knowledge: z.lazy(() => knowledgeConfigSchema).optional()
}).transform(data => ({
  ...data,
  voice: data.voice || {
    id: "",
    name: "alloy",
    provider: "openai",
    tts_options: {
      voice: "",
      voice_name: "",
      speed: 1.0
    },
    profile_options: data.voice?.profile_options || {
      background_audio: {
        loop: true,
        volume: 0.3,
        enabled: false,
        audio_path: "office-ambience.mp3"
      },
      end_call_function: false,
      end_call_message: "",
      end_call_phrases: []
    },
    details: {
      name: "",
      high_quality_base_model_ids: [],
      preview_url: "",
      labels: [],
    }
  },
  knowledge: data.knowledge || { files: [] }
}))



export interface Agent {
  id: string
  name: string
  description: string
  system_prompt: string
  greeting: string
  llm_provider: "openai" | "google"
  tts_provider: "elevenlabs" | "openai" | "google"
  stt_provider: string
  llm_options: {
    model: string
    temperature: number
  }
  tts_options: {
    voice: string
    voice_name: string
    speed: number
  }
  stt_options: {
    model: string
    model_telephony: string
  },
  profile_options: {
    background_audio: {
      loop: boolean
      volume: number
      enabled: boolean
      audio_path: string
    }
    end_call_function?: boolean
    end_call_message?: string
    end_call_phrases?: string[]
  },
  allow_interruptions: boolean
  interrupt_speech_duration: number
  interrupt_min_words: number
  min_endpointing_delay: number
  max_endpointing_delay: number
  active: boolean
  is_default: boolean
  max_nested_function_calls: number
  owner_id: string
  created_at: string
  updated_at: string
}


export type AgentConfig = z.infer<typeof agentConfigSchema>
export type VoiceConfig = z.infer<typeof voiceConfigSchema>
export type KnowledgeConfig = z.infer<typeof knowledgeConfigSchema>