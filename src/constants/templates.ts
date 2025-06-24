import { AgentConfig } from "@/app/dashboard/new_agents/types";

export const assistantTemplates: { [key: string]: AgentConfig } = {
  "sales-assistant": {
    model: {
      agentName: "Sales Assistant",
      firstMessage: "Hello! I'm your AI sales assistant. How can I help you today?",
      type: "inbound",
      systemPrompt: "You are a professional sales assistant. Your goal is to help qualify leads and handle sales inquiries with a focus on conversion. Be friendly but professional, and always aim to understand the customer's needs before making suggestions.",
      provider: "elevenlabs",
      model: "gpt-4",
      language: "en",
      temperature: 0.7,
      description: "AI sales assistant focused on lead qualification and conversion",
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
      id: "",
      name: "alloy",
      provider: "elevenlabs",
      details: {
        name: "",
        high_quality_base_model_ids: [],
        preview_url: "",
        labels: [],
      },
      profile_options: {
        background_audio: {
          loop: true,
          volume: 0.3,
          enabled: true,
          audio_path: "office-ambience.mp3"
        },
        end_call_function: false,
        end_call_message: "",
        end_call_phrases: []
      }
    },
    knowledge: {
      files: []
    },
  },
  "support-bot": {
    model: {
      agentName: "Support Bot",
      firstMessage: "Hi there! I'm your support assistant. What can I help you with today?",
      type: "inbound",
      systemPrompt: "You are a helpful customer support assistant. Your goal is to help users resolve their issues efficiently and professionally. Always be patient and thorough in your explanations.",
      provider: "elevenlabs",
      model: "gpt-4",
      language: "en",
      temperature: 0.7,
      description: "Customer support assistant focused on issue resolution",
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
      id: "",
      name: "alloy",
      provider: "elevenlabs",
      details: {
        name: "",
        high_quality_base_model_ids: [],
        preview_url: "",
        labels: [],
      },
      profile_options: {
        background_audio: {
          loop: true,
          volume: 0.3,
          enabled: true,
          audio_path: "office-ambience.mp3"
        },
        end_call_function: false,
        end_call_message: "",
        end_call_phrases: []
      }
    },
    knowledge: {
      files: []
    },
  },
  "survey-agent": {
    model: {
      agentName: "Survey Agent",
      firstMessage: "Hello! I'm here to gather some feedback. Would you mind answering a few questions?",
      type: "outbound",
      systemPrompt: "You are a professional survey agent. Your goal is to collect feedback and information from users in a friendly and efficient manner. Be concise but thorough in your questions.",
      provider: "elevenlabs",
      model: "gpt-4",
      language: "en",
      temperature: 0.7,
      description: "Survey agent focused on gathering feedback and information",
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
      id: "",
      name: "alloy",
      provider: "elevenlabs",
      details: {
        name: "",
        high_quality_base_model_ids: [],
        preview_url: "",
        labels: [],
      },
      profile_options: {
        background_audio: {
          loop: true,
          volume: 0.3,
          enabled: true,
          audio_path: "office-ambience.mp3"
        },
        end_call_function: false,
        end_call_message: "",
        end_call_phrases: []
      }
    },
    knowledge: {
      files: []
    },
  }
}; 