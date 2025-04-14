"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { ModelConfig } from "@/app/dashboard/new_agents/types"

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
  const [errors] = useState<{ [key: string]: boolean }>({});
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

    console.log(key, value, currentModel, currentTelephonyModel);
    setAgentConfig({
      ...agentConfig,
      stt_options: {
        model: key === "model" ? value as SttModel : currentModel as SttModel,
        model_telephony: key === "model_telephony" ? value as TelephonyModel : currentTelephonyModel as TelephonyModel
      }
    });
  };


  console.log("agentConfig");
  console.log(agentConfig);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-white/90">Transcriber Configuration</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-white/90">Select Provider</label>
          <select
            value={sttProvider}
            onChange={handleProviderChange}
            className="bg-[#1A1D25]/70 border border-white/10 text-white/90 rounded-md p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
          >
            {sttProviders.map(provider => (
              <option key={provider.value} value={provider.value}>
                {provider.label}
              </option>
            ))}
          </select>
        </div>

        <div className={`flex flex-col space-y-2 ${errors.model ? 'text-red-500' : ''}`}>
          <label className="text-xs font-medium text-white/90">
            General Model
          </label>
          <select
            value={agentConfig.stt_options?.model || agentConfig?.stt_model ||  modelOptions[sttProvider][0].value}
            onChange={(e) => handleModelChange("model", e.target.value)}
            className="bg-[#1A1D25]/70 border border-white/10 text-white/90 rounded-md p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
          >
            {modelOptions[sttProvider].map(model => (
              <option key={model.value} value={model.value}>
                {model.label}
              </option>
            ))}
          </select>
        </div>

        {telephonyModelOptions[sttProvider].length > 0 && (
          <div className={`flex flex-col space-y-2 ${errors.model_telephony ? 'text-red-500' : ''}`}>
            <label className="text-xs font-medium text-white/90">
              Telephony Model
            </label>
            <select
              value={agentConfig.stt_options?.model_telephony || agentConfig?.stt_model_telephony || telephonyModelOptions[sttProvider][0].value}
              onChange={(e) => handleModelChange("model_telephony", e.target.value)}
              className="bg-[#1A1D25]/70 border border-white/10 text-white/90 rounded-md p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
            >
              {telephonyModelOptions[sttProvider].map(model => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="bg-[#1A1D25]/70 border border-white/10 rounded-md p-4 space-y-4">
          <h4 className="text-sm font-medium text-white/90">Additional Settings</h4>
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-white/90">Minimum Endpointing Delay</label>
              <span className="text-xs text-white/60">{agentConfig.min_endpointing_delay || 0.5}s</span>
            </div>
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
              className="bg-[#1A1D25]/70 border-white/10 text-white/90 focus:ring-2 focus:ring-white/20 transition-all"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-white/90">Maximum Endpointing Delay</label>
              <span className="text-xs text-white/60">{agentConfig.max_endpointing_delay || 6.0}s</span>
            </div>
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
              className="bg-[#1A1D25]/70 border-white/10 text-white/90 focus:ring-2 focus:ring-white/20 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 