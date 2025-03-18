export interface AgentProfile {
  id?: string;
  name: string;
  description: string;
  system_prompt: string;
  greeting: string;
  voice: string;
  llm_model: string;
  stt_model: string;
  stt_model_telephony: string;
  allow_interruptions: boolean;
  interrupt_speech_duration: number;
  interrupt_min_words: number;
  min_endpointing_delay: number;
  max_endpointing_delay: number;
  active: boolean;
  is_default: boolean;
  max_nested_function_calls: number;
}

export interface AgentProfileResponse {
  id: string;
  name: string;
  description: string;
  system_prompt: string;
  greeting: string;
  voice: string;
  llm_model: string;
  stt_model: string;
  stt_model_telephony: string;
  allow_interruptions: boolean;
  interrupt_speech_duration: number;
  interrupt_min_words: number;
  min_endpointing_delay: number;
  max_endpointing_delay: number;
  active: boolean;
  is_default: boolean;
  max_nested_function_calls: number;
  created_at: string;
  updated_at: string;
} 