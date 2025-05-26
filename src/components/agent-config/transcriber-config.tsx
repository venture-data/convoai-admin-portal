"use client"

import { ModelConfig } from "@/app/dashboard/new_agents/types"
import { Mic, FileText, Sliders } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const currentProvider = (agentConfig.stt_provider || "deepgram") as SttProvider;

  const handleProviderChange = (value: string) => {
    const newProvider = value as SttProvider;
    
    const defaultModel = (agentConfig.stt_options?.model || agentConfig?.stt_model || modelOptions[newProvider][0].value) as SttModel;
    const defaultTelephonyModel = (agentConfig.stt_options?.model_telephony || agentConfig?.stt_model_telephony || telephonyModelOptions[newProvider][0]?.value || defaultModel) as TelephonyModel;
    
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
    console.log("key", key)
    console.log("value", value)
    console.log("agentConfig", agentConfig)
    const currentModel = agentConfig.stt_options?.model || agentConfig?.stt_model || modelOptions[currentProvider][0].value;
    const currentTelephonyModel = agentConfig.stt_options?.model_telephony || agentConfig?.stt_model_telephony || telephonyModelOptions[currentProvider][0]?.value || currentModel;

    setAgentConfig({
      ...agentConfig,
      stt_options: {
        model: key === "model" ? value as SttModel : currentModel as SttModel,
        model_telephony: key === "model_telephony" ? value as TelephonyModel : currentTelephonyModel as TelephonyModel
      }
    });
  };

  console.log(agentConfig)

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
          <Select value={currentProvider} onValueChange={handleProviderChange}>
            <SelectTrigger className="w-full bg-[#1A1D25] border-white/10 text-white">
              <div className="flex items-center">
                <Mic className="w-4 h-4 mr-2 text-orange-400" />
                <SelectValue placeholder="Select provider" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-[#1A1D25] border-white/10">
              {sttProviders.map(provider => (
                <SelectItem 
                  key={provider.value} 
                  value={provider.value}
                  className="text-white/90 focus:bg-orange-500 focus:text-white data-[highlighted]:bg-orange-500 data-[highlighted]:text-white"
                >
                  {provider.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              <Select 
                value={agentConfig.stt_options?.model || agentConfig?.stt_model || modelOptions[currentProvider][0].value}
                onValueChange={(value) => handleModelChange("model", value)}
              >
                <SelectTrigger className="w-full bg-[#1A1D25] border-white/10 text-white">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-orange-400" />
                    <SelectValue placeholder="Select model" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#1A1D25] border-white/10">
                  {modelOptions[currentProvider].map(model => (
                    <SelectItem 
                      key={model.value} 
                      value={model.value}
                      className="text-white/90 focus:bg-orange-500 focus:text-white data-[highlighted]:bg-orange-500 data-[highlighted]:text-white"
                    >
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {telephonyModelOptions[currentProvider].length > 0 && (
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
                <Select 
                  value={agentConfig.stt_options?.model_telephony || agentConfig?.stt_model_telephony || telephonyModelOptions[currentProvider][0].value}
                  onValueChange={(value) => handleModelChange("model_telephony", value)}
                >
                  <SelectTrigger className="w-full bg-[#1A1D25] border-white/10 text-white">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-orange-400" />
                      <SelectValue placeholder="Select telephony model" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1D25] border-white/10">
                    {telephonyModelOptions[currentProvider].map(model => (
                      <SelectItem 
                        key={model.value} 
                        value={model.value}
                        className="text-white/90 focus:bg-orange-500 focus:text-white data-[highlighted]:bg-orange-500 data-[highlighted]:text-white"
                      >
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
} 