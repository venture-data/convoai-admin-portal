import { GPT_MODELS, GOOGLE_MODELS, ELEVENLABS_VOICE_MODELS, OPENAI_VOICE_MODELS } from "@/constants";

// Dynamic model mapping for different providers
export const PROVIDER_MODELS = {
  openai: GPT_MODELS,
  google: GOOGLE_MODELS,
} as const;

export type LLMProvider = keyof typeof PROVIDER_MODELS;

// Voice model mapping for different voice providers
export const VOICE_PROVIDER_MODELS = {
  elevenlabs: ELEVENLABS_VOICE_MODELS,
  openai: OPENAI_VOICE_MODELS,
  uplift: [], // Uplift models to be added when available
} as const;

export type VoiceProvider = keyof typeof VOICE_PROVIDER_MODELS;

// Provider configuration for dynamic UI
export const PROVIDER_CONFIG = {
  openai: {
    name: "OpenAI",
    maxTemperature: 1,
    defaultModel: "gpt-4o",
    defaultTemperature: 0.7,
  },
  google: {
    name: "Google",
    maxTemperature: 1,
    defaultModel: "gemini-2.0-flash-001",
    defaultTemperature: 0.7,
  },
} as const;

// Voice provider configuration for dynamic UI
export const VOICE_PROVIDER_CONFIG = {
  elevenlabs: {
    name: "ElevenLabs",
    defaultModel: "eleven_multilingual_v2",
    maxSpeed: 1.2,
  },
  openai: {
    name: "OpenAI",
    defaultModel: "tts-1",
    maxSpeed: 2,
  },
  uplift: {
    name: "Uplift",
    defaultModel: "tts-1",
    maxSpeed: 2,
  },
} as const;

// Utility function to get available models for a provider
export const getModelsForProvider = (provider: LLMProvider) => {
  return PROVIDER_MODELS[provider] || [];
};

// Utility function to get provider configuration
export const getProviderConfig = (provider: LLMProvider) => {
  return PROVIDER_CONFIG[provider];
};

// Helper function to check if a provider supports model selection
export const providerSupportsModels = (provider: string): provider is LLMProvider => {
  return provider in PROVIDER_MODELS;
};

// Get all supported providers
export const getSupportedProviders = (): LLMProvider[] => {
  return Object.keys(PROVIDER_MODELS) as LLMProvider[];
};

// Voice provider utility functions
export const getVoiceModelsForProvider = (provider: VoiceProvider) => {
  return VOICE_PROVIDER_MODELS[provider] || [];
};

export const getVoiceProviderConfig = (provider: VoiceProvider) => {
  return VOICE_PROVIDER_CONFIG[provider];
};

export const voiceProviderSupportsModels = (provider: string): provider is VoiceProvider => {
  return provider in VOICE_PROVIDER_MODELS;
};

export const getSupportedVoiceProviders = (): VoiceProvider[] => {
  return Object.keys(VOICE_PROVIDER_MODELS) as VoiceProvider[];
}; 