"use client"

import { VoiceConfig as VoiceConfigType } from "@/app/dashboard/new_agents/types"
import { useVoice } from "@/app/hooks/use-voice";
import { useEffect} from "react";
import { Volume2, Mic, Speaker, Info, Music, Sparkles } from "lucide-react";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VoiceProvider, getVoiceProviderConfig, getVoiceModelsForProvider, voiceProviderSupportsModels } from "@/lib/providers";

// Add global styles for select options
const globalStyles = `
  .voice-select option:hover,
  .voice-select option:focus {
    box-shadow: 0 0 10px 100px #f97316 inset !important;
    background-color: #f97316 !important;
    color: white !important;
  }
`;

type ElevenLabsVoiceModel = 
  | "eleven_monolingual_v1"
  | "eleven_multilingual_v1"
  | "eleven_multilingual_v2"
  | "eleven_turbo_v2"
  | "eleven_turbo_v2_5"
  | "eleven_flash_v2_5"
  | "eleven_flash_v2";

type OpenAIVoiceModel = 
  | "tts-1"
  | "tts-1-hd"
  | "gpt-4o-mini-tts";

type VoiceModel = ElevenLabsVoiceModel | OpenAIVoiceModel;

interface Voice {
  id: string;
  provider: string;
  providerId: string;
  name: string;
  description: string;
  slug: string;
  preview_url?: string;
}

interface VoiceConfigProps {
  provider: string;
  agentConfig: VoiceConfigType;
  setAgentConfig: (config: VoiceConfigType) => void;
  onSave?: (config: VoiceConfigType) => void;
}

export function VoiceConfig({ provider, agentConfig, setAgentConfig}: VoiceConfigProps) {
  const voiceprovider = (agentConfig.provider || "openai") as "elevenlabs" | "openai" | "uplift";
  const { voices, isLoading } = useVoice(voiceprovider);

  // Get voice provider configuration for dynamic settings
  const voiceProviderConfig = getVoiceProviderConfig(voiceprovider as VoiceProvider);
  const showVoiceModelSection = voiceProviderSupportsModels(voiceprovider);

  useEffect(() => {
    if (!agentConfig.profile_options?.background_audio) {
      const updatedConfig = {
        ...agentConfig,
        profile_options: {
          ...agentConfig.profile_options,
          background_audio: {
            loop: true,
            volume: 0.3,
            enabled: true,
            audio_path: "office-ambience.mp3"
          }
        }
      };
      setAgentConfig(updatedConfig);
    }
  }, []);

  useEffect(() => {
    if (agentConfig.tts_options?.voice && !agentConfig.details?.name && voices?.items) {
      const selectedVoice = voices.items.find((voice: Voice) => voice.providerId.toLowerCase() === agentConfig.tts_options?.voice?.toLowerCase());
      if (selectedVoice) {
        setAgentConfig({
          ...agentConfig,
          id: selectedVoice.id,
          name: selectedVoice.name.toLowerCase(),
          provider: selectedVoice.provider as "elevenlabs" | "openai" | "uplift",
          details: {
            name: selectedVoice.name,
            high_quality_base_model_ids: ["tts-1"],
            preview_url: selectedVoice.preview_url || "",
            labels: [selectedVoice.description],
          }
        });
      }
    }
  }, [agentConfig.tts_options?.voice, voices?.items]);

  const handleVoiceChange = (voiceId: string) => {
    const selectedVoice = Array.isArray(voices?.items) ? voices?.items?.find((voice: Voice) => voice.providerId === voiceId) : null;
    if (selectedVoice) {
      setAgentConfig({
        ...agentConfig,
        id: selectedVoice.id,
        name: selectedVoice.name.toLowerCase(),
        provider: selectedVoice.provider as "elevenlabs" | "openai" | "uplift",
        details: {
          name: selectedVoice.name,
          high_quality_base_model_ids: ["tts-1"],
          preview_url: selectedVoice.preview_url || "",
          labels: [selectedVoice.description],
        },
        tts_options: {
          ...agentConfig.tts_options,
          voice: selectedVoice.providerId,
          speed: agentConfig.tts_options?.speed || 1.0,
          voice_name: selectedVoice.name
        }
      });
    }
  };

  const handleTtsOptionsChange = (key: string, value: number) => {
    setAgentConfig({
      ...agentConfig,
      tts_options: {
        ...agentConfig.tts_options,
        [key]: value
      }
    });
  };

  const handleProviderChange = (newProvider: string) => {
    setAgentConfig({
      ...agentConfig,
      id: "",
      name: "",
      provider: newProvider as "elevenlabs" | "openai" | "uplift",
      details: undefined,
      tts_options: {
        ...agentConfig.tts_options,
        voice: undefined
      }
    });
  };

  const handleBackgroundAudioToggle = (enabled: boolean) => {
    const updatedConfig = {
      ...agentConfig,
      profile_options: {
        ...agentConfig.profile_options,
        background_audio: {
          ...(agentConfig.profile_options?.background_audio || {}),
          loop: true,
          volume: agentConfig.profile_options?.background_audio?.volume || 0.3,
          enabled: enabled,
          audio_path: agentConfig.profile_options?.background_audio?.audio_path || "office-ambience.mp3"
        }
      }
    };
    setAgentConfig(updatedConfig);
  };

  const handleVolumeChange = (value: number[]) => {
    const updatedConfig = {
      ...agentConfig,
      profile_options: {
        ...agentConfig.profile_options,
        background_audio: {
          ...(agentConfig.profile_options?.background_audio || {}),
          loop: true,
          volume: value[0],
          enabled: agentConfig.profile_options?.background_audio?.enabled ?? true,
          audio_path: agentConfig.profile_options?.background_audio?.audio_path || "office-ambience.mp3"
        }
      }
    };
    setAgentConfig(updatedConfig);
  };

  const handleSoundTypeChange = (soundType: string) => {
    const updatedConfig = {
      ...agentConfig,
      profile_options: {
        ...agentConfig.profile_options,
        background_audio: {
          ...(agentConfig.profile_options?.background_audio || {}),
          loop: true,
          volume: agentConfig.profile_options?.background_audio?.volume || 0.3,
          enabled: agentConfig.profile_options?.background_audio?.enabled ?? true,
          audio_path: soundType
        }
      }
    };
    setAgentConfig(updatedConfig);
  };

  console.log(agentConfig.profile_options?.background_audio)
  return (
    <div className="space-y-8 text-white/90">
      <style jsx global>{globalStyles}</style>
      
      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <Volume2 className="h-5 w-5 text-orange-400" />
        <h3 className="text-xl font-bold text-white">Voice Configuration</h3>
      </div>
      
      <div className="space-y-6">
        <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 to-[#1A1D25]/60 border border-white/10">
          <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
            <Speaker className="h-4 w-4" />
            Voice Provider
          </h4>
          
          <div className="relative">
            <Select value={voiceprovider} onValueChange={handleProviderChange}>
              <SelectTrigger className="w-full bg-[#1A1D25] border-white/10">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1D25] border-white/10">
                <SelectItem value="openai" className="text-white/90 focus:bg-orange-500 focus:text-white data-[highlighted]:bg-orange-500 data-[highlighted]:text-white">OpenAI</SelectItem>
                <SelectItem value="elevenlabs" className="text-white/90 focus:bg-orange-500 focus:text-white data-[highlighted]:bg-orange-500 data-[highlighted]:text-white">ElevenLabs</SelectItem>
                <SelectItem value="uplift" className="text-white/90 focus:bg-orange-500 focus:text-white data-[highlighted]:bg-orange-500 data-[highlighted]:text-white">Uplift</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 via-[#1A1D25]/60 to-orange-950/10 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.05)]">
          <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
            <Mic className="h-4 w-4" />
            Voice Selection
          </h4>
          
          <div className="relative">
            <Select 
              value={agentConfig.tts_options?.voice || ""} 
              onValueChange={handleVoiceChange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full bg-[#1A1D25] border-white/10">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1D25] border-white/10">
                {Array.isArray(voices?.items) && voices.items
                  .filter((voice: Voice) => voice.provider === voiceprovider)
                  .map((voice: Voice) => (
                    <SelectItem 
                      key={voice.id} 
                      value={voice.providerId}
                      className="text-white/90 focus:bg-orange-500 focus:text-white data-[highlighted]:bg-orange-500 data-[highlighted]:text-white"
                    >
                      {voice.name} ({voice.provider})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <br/>
        
          {isLoading && (
            <p className="mt-2 text-xs text-white/50 italic">Loading available voices...</p>
          )}
          
          {!isLoading && voices?.items && voices.items.length === 0 && (
            <p className="mt-2 text-xs text-orange-400">No voices available for this provider</p>
          )}
        </div>

        {showVoiceModelSection && (
          <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 via-[#1A1D25]/60 to-orange-950/10 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.05)]">
            <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Voice Model
            </h4>
            
            <div className="space-y-2">
              <Select 
                value={agentConfig.tts_options?.model || voiceProviderConfig?.defaultModel || ""} 
                onValueChange={(value) => {
                  setAgentConfig({
                    ...agentConfig,
                    tts_options: {
                      ...agentConfig.tts_options,
                      model: value as VoiceModel,
                    }
                  });
                }}
              >
                <SelectTrigger className="w-full bg-[#1A1D25] border-white/10">
                  <div className="flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-orange-400" />
                    <SelectValue placeholder="Select voice model" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#1A1D25] border-white/10 max-h-[300px] overflow-y-auto">
                  {getVoiceModelsForProvider(voiceprovider as VoiceProvider).map((model) => (
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
              <p className="text-xs text-white/50 italic mt-1">Select the specific voice model for text-to-speech generation</p>
            </div>
          </div>
        )}

      </div>
      {(provider === "openai" || provider === 'elevenlabs') &&<div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 via-[#1A1D25]/60 to-orange-950/10 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.05)]">
          <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Speech Speed
          </h4>
          
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-4">
              <Slider
                id="speech-speed"
                min={0.1}
                max={voiceProviderConfig?.maxSpeed || 2}
                step={0.1}
                value={[agentConfig.tts_options?.speed || 1.0]}
                onValueChange={(value) => {
                  handleTtsOptionsChange('speed', value[0]);
                }}
                className="flex-1"
              />
              <span className="text-white/90 text-sm min-w-[3ch]">
                {(agentConfig.tts_options?.speed || 1.0).toFixed(1)}x
              </span>
            </div>
            <div className="mt-2 text-xs text-white/60 p-3 bg-[#1A1D25]/30 rounded border border-white/5">
              <p className="flex items-start gap-2">
                <Info className="h-3 w-3 text-orange-400 mt-0.5 flex-shrink-0" />
                <span>
                  Speech speed controls how quickly the AI speaks. Values range from 0.1 (very slow) to {(voiceProviderConfig?.maxSpeed || 2).toFixed(1)} (very fast), with 1.0 being the normal speaking rate. Adjust this to match your preference or the context of the conversation.
                </span>
              </p>
              <div className="grid grid-cols-3 gap-2 mt-2 text-center text-white/40 text-[10px]">
                <span className="bg-[#1A1D25]/50 p-1 rounded">0.5x - Slower, more deliberate speech</span>
                <span className="bg-[#1A1D25]/50 p-1 rounded">1.0x - Normal conversational speed</span>
                <span className="bg-[#1A1D25]/50 p-1 rounded">{(voiceProviderConfig?.maxSpeed || 2).toFixed(1)}x - Maximum speed for {voiceProviderConfig?.name || 'this provider'}</span>
              </div>
            </div>
          </div>
          {agentConfig.tts_options?.voice_name && (
            <div className="mt-4 p-3 rounded bg-[#1A1D25]/50 border border-white/5">
              <p className="text-xs text-white/70">Selected voice: <span className="text-orange-400 font-medium">{agentConfig?.tts_options?.voice_name}</span></p>
            </div>
          )}
          
        </div> }
    

      <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 via-[#1A1D25]/60 to-orange-950/10 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.05)]">
        <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
          <Music className="h-4 w-4" />
          Background Noise
        </h4>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <label className="text-sm text-white/70">Enable Background Noise</label>
            <Switch
              checked={agentConfig.profile_options?.background_audio?.enabled ?? true}
              onCheckedChange={handleBackgroundAudioToggle}
            />
          </div>

          {agentConfig.profile_options?.background_audio?.enabled && (
            <>
              <div className="space-y-2">
                <label className="text-sm text-white/70">Volume</label>
                <Slider
                  defaultValue={[agentConfig.profile_options?.background_audio?.volume ?? 0.3]}
                  max={1}
                  step={0.1}
                  onValueChange={handleVolumeChange}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-white/50">
                  <span>0</span>
                  <span>1.0</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/70">Sound Type</label>
                <Select 
                  value={agentConfig.profile_options?.background_audio?.audio_path || "office-ambience.mp3"}
                  onValueChange={handleSoundTypeChange}
                >
                  <SelectTrigger className="w-full bg-[#1A1D25] border-white/10">
                    <SelectValue placeholder="Select sound type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1D25] border-white/10">
                    <SelectItem 
                      value="office-ambience.mp3" 
                      className="text-white/90 focus:bg-orange-500 focus:text-white data-[highlighted]:bg-orange-500 data-[highlighted]:text-white"
                    >
                      Office Ambience
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 