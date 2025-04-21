"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { ModelConfig } from "@/app/dashboard/new_agents/types"
import { Mic, FileText, Sliders, Clock } from "lucide-react";

type SttProvider = "deepgram" | "google" | "openai";
type DeepgramModel = "nova-general" | "nova-phonecall" | "nova-meeting" | "nova-2-general" | "nova-2-meeting" | 
  "nova-2-phonecall" | "nova-2-finance" | "nova-2-conversationalai" | "nova-2-voicemail" | "nova-2-video" | 
  "nova-2-medical" | "nova-2-drivethru" | "nova-2-automotive" | "nova-3" | "nova-3-general" | "enhanced-general" | 
  "enhanced-meeting" | "enhanced-phonecall" | "enhanced-finance" | "base" | "meeting" | "phonecall" | "finance" | 
  "conversationalai" | "voicemail" | "video";
type GoogleModel = "whisper-tiny" | "whisper-base" | "whisper-small" | "whisper-medium" | "whisper-large";
type OpenAIModel = "whisper-1";
type SttModel = DeepgramModel | GoogleModel | OpenAIModel;
type TelephonyModel = "nova-phonecall" | "nova-2-phonecall" | "enhanced-phonecall" | "phonecall";

interface TranscriberConfigProps {
  provider: string;
  agentConfig: ModelConfig;
  setAgentConfig: (config: ModelConfig) => void;
}

const sttProviders = [
  { value: "deepgram" as const, label: "Deepgram" },
  { value: "google" as const, label: "Google" },
  { value: "openai" as const, label: "OpenAI" }
];

const modelOptions: Record<SttProvider, Array<{ value: SttModel; label: string }>> = {
  deepgram: [
    { value: "nova-3", label: "Nova 3" },
    { value: "nova-3-general", label: "Nova 3 (General)" },
    { value: "nova-general", label: "Nova (General)" },
    { value: "nova-phonecall", label: "Nova (Phone Call)" },
    { value: "nova-meeting", label: "Nova (Meeting)" },
    { value: "nova-2-general", label: "Nova 2 (General)" },
    { value: "nova-2-meeting", label: "Nova 2 (Meeting)" },
    { value: "nova-2-phonecall", label: "Nova 2 (Phone Call)" },
    { value: "nova-2-finance", label: "Nova 2 (Finance)" },
    { value: "nova-2-conversationalai", label: "Nova 2 (Conversational AI)" },
    { value: "nova-2-voicemail", label: "Nova 2 (Voicemail)" },
    { value: "nova-2-video", label: "Nova 2 (Video)" },
    { value: "nova-2-medical", label: "Nova 2 (Medical)" },
    { value: "nova-2-drivethru", label: "Nova 2 (Drive-thru)" },
    { value: "nova-2-automotive", label: "Nova 2 (Automotive)" },
    { value: "enhanced-general", label: "Enhanced (General)" },
    { value: "enhanced-meeting", label: "Enhanced (Meeting)" },
    { value: "enhanced-phonecall", label: "Enhanced (Phone Call)" },
    { value: "enhanced-finance", label: "Enhanced (Finance)" },
    { value: "base", label: "Base" },
    { value: "meeting", label: "Meeting" },
    { value: "phonecall", label: "Phone Call" },
    { value: "finance", label: "Finance" },
    { value: "conversationalai", label: "Conversational AI" },
    { value: "voicemail", label: "Voicemail" },
    { value: "video", label: "Video" }
  ],
  google: [
    { value: "whisper-tiny", label: "Whisper (Tiny)" },
    { value: "whisper-base", label: "Whisper (Base)" },
    { value: "whisper-small", label: "Whisper (Small)" },
    { value: "whisper-medium", label: "Whisper (Medium)" },
    { value: "whisper-large", label: "Whisper (Large)" }
  ],
  openai: [
    { value: "whisper-1", label: "Whisper-1" }
  ]
};

const telephonyModelOptions: Record<SttProvider, Array<{ value: TelephonyModel; label: string }>> = {
  deepgram: [
    { value: "nova-phonecall", label: "Nova (Phone Call)" },
    { value: "nova-2-phonecall", label: "Nova 2 (Phone Call)" },
    { value: "enhanced-phonecall", label: "Enhanced (Phone Call)" },
    { value: "phonecall", label: "Phone Call" }
  ],
  google: [],
  openai: []
};

export function TranscriberConfig({ agentConfig, setAgentConfig }: TranscriberConfigProps) {
  const [sttProvider, setSttProvider] = useState<SttProvider>(agentConfig.stt_provider || "deepgram");

  const handleProviderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newProvider = event.target.value as SttProvider;
    setSttProvider(newProvider);
    
    const defaultModel = modelOptions[newProvider][0].value;
    const defaultTelephonyModel = telephonyModelOptions[newProvider][0]?.value || defaultModel;
    
    setAgentConfig({
      ...agentConfig,
      stt_provider: newProvider,
      stt_options: {
        model: defaultModel as SttModel,
        model_telephony: defaultTelephonyModel as TelephonyModel
      }
    });
  };

  const handleModelChange = (key: "model" | "model_telephony", value: string) => {
    const currentModel = agentConfig.stt_options?.model || agentConfig?.stt_model || modelOptions[sttProvider][0].value;
    const currentTelephonyModel = agentConfig.stt_options?.model_telephony || agentConfig?.stt_model_telephony || telephonyModelOptions[sttProvider][0]?.value || currentModel;

    setAgentConfig({
      ...agentConfig,
      stt_options: {
        model: key === "model" ? value as SttModel : currentModel as SttModel,
        model_telephony: key === "model_telephony" ? value as TelephonyModel : currentTelephonyModel as TelephonyModel
      }
    });
  };

  return (
    <div className="space-y-8 text-white/90">
      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <Mic className="h-5 w-5 text-orange-400" />
        <h3 className="text-xl font-bold text-white">Speech Recognition</h3>
      </div>
      
      <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 to-[#1A1D25]/60 border border-white/10">
        <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Transcription Provider
        </h4>
        
        <div className="relative">
          <select
            value={sttProvider}
            onChange={handleProviderChange}
            className="bg-[#1A1D25] border border-white/10 text-white/90 text-sm rounded-md p-2.5 pl-9 w-full focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all appearance-none"
          >
            {sttProviders.map(provider => (
              <option key={provider.value} value={provider.value}>
                {provider.label}
              </option>
            ))}
          </select>
          <Mic className="h-4 w-4 text-white/40 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-4 w-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 via-[#1A1D25]/60 to-orange-950/10 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.05)]">
        <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
          <Sliders className="h-4 w-4" />
          Model Selection
        </h4>
        
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90 flex items-center">
              General Model
              <span
                className="ml-1 text-white/60 hover:cursor-help"
                title="The model to use for general speech recognition"
              >
                ⓘ
              </span>
            </label>
            <div className="relative">
              <select
                value={agentConfig.stt_options?.model || agentConfig?.stt_model || modelOptions[sttProvider][0].value}
                onChange={(e) => handleModelChange("model", e.target.value)}
                className="bg-[#1A1D25] border border-white/10 text-white/90 text-sm rounded-md p-2.5 pl-9 w-full focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all appearance-none"
              >
                {modelOptions[sttProvider].map(model => (
                  <option key={model.value} value={model.value}>
                    {model.label}
                  </option>
                ))}
              </select>
              <FileText className="h-4 w-4 text-white/40 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-4 w-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {telephonyModelOptions[sttProvider].length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90 flex items-center">
                Telephony Model
                <span
                  className="ml-1 text-white/60 hover:cursor-help"
                  title="The model to use specifically for phone call transcription"
                >
                  ⓘ
                </span>
              </label>
              <div className="relative">
                <select
                  value={agentConfig.stt_options?.model_telephony || agentConfig?.stt_model_telephony || telephonyModelOptions[sttProvider][0].value}
                  onChange={(e) => handleModelChange("model_telephony", e.target.value)}
                  className="bg-[#1A1D25] border border-white/10 text-white/90 text-sm rounded-md p-2.5 pl-9 w-full focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all appearance-none"
                >
                  {telephonyModelOptions[sttProvider].map(model => (
                    <option key={model.value} value={model.value}>
                      {model.label}
                    </option>
                  ))}
                </select>
                <FileText className="h-4 w-4 text-white/40 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-4 w-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 to-[#1A1D25]/60 border border-white/10">
        <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Timing Settings
        </h4>
        
        <div className="space-y-5">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-white/90 flex items-center">
                Minimum Endpointing Delay
                <span
                  className="ml-1 text-white/60 hover:cursor-help"
                  title="Minimum delay before considering speech ended"
                >
                  ⓘ
                </span>
              </label>
              <span className="text-sm text-orange-400 font-medium">{agentConfig.min_endpointing_delay || 0.5}s</span>
            </div>
            <div className="relative">
              <Input
                type="number"
                min="0.1"
                max="2"
                step="0.1"
                value={agentConfig.min_endpointing_delay || 0.5}
                onChange={(e) => setAgentConfig({
                  ...agentConfig,
                  min_endpointing_delay: parseFloat(e.target.value)
                })}
                className="bg-[#1A1D25] border-white/10 text-white/90 text-sm pl-9 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
              />
              <Clock className="h-4 w-4 text-white/40 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <p className="text-xs text-white/50 italic">Shorter delays mean quicker responses but may cut off speech</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-white/90 flex items-center">
                Maximum Endpointing Delay
                <span
                  className="ml-1 text-white/60 hover:cursor-help"
                  title="Maximum delay before considering speech ended"
                >
                  ⓘ
                </span>
              </label>
              <span className="text-sm text-orange-400 font-medium">{agentConfig.max_endpointing_delay || 6.0}s</span>
            </div>
            <div className="relative">
              <Input
                type="number"
                min="1"
                max="10"
                step="0.5"
                value={agentConfig.max_endpointing_delay || 6.0}
                onChange={(e) => setAgentConfig({
                  ...agentConfig,
                  max_endpointing_delay: parseFloat(e.target.value)
                })}
                className="bg-[#1A1D25] border-white/10 text-white/90 text-sm pl-9 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
              />
              <Clock className="h-4 w-4 text-white/40 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <p className="text-xs text-white/50 italic">Longer delays prevent premature responses during pauses</p>
          </div>
        </div>
      </div>
    </div>
  );
} 