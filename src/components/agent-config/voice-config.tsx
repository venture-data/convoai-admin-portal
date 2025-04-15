"use client"

import { VoiceConfig as VoiceConfigType } from "@/app/dashboard/new_agents/types"
import { useVoice } from "@/app/hooks/use-voice";
import { useState, useEffect} from "react";
import { Input } from "@/components/ui/input";

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
}

export function VoiceConfig({ provider, agentConfig, setAgentConfig }: VoiceConfigProps) {
  const [voiceprovider, setvoiceprovider] = useState(provider);
  const { voices, isLoading } = useVoice(voiceprovider);

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
    console.log(voiceId);
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
          voice: selectedVoice.providerId
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

  const handleProviderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newProvider = event.target.value;
    setvoiceprovider(newProvider);
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

  console.log(provider)
  console.log(agentConfig)
  return (
    <div className="space-y-6 text-white/90">
      <h3 className="text-xl font-bold mb-4 text-white">Voice Configuration</h3>
      <div className="space-y-4">
        <div className="space-y-2 bg-[#1A1D25]/70 border border-white/10 rounded-md p-4">
          <label className="text-xs font-medium text-white/90 flex items-center">
            Select Provider
            <span
              className="ml-1 text-white/60 hover:cursor-help"
              title="Choose the voice provider to use"
            >
              ⓘ
            </span>
          </label>
          <select 
            value={voiceprovider}
            onChange={handleProviderChange}
            className="bg-[#1A1D25]/70 border border-white/10 text-white/90 text-sm rounded-md p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-white/20 transition-all [&>option]:bg-[#1A1D25] [&>option]:text-white/90 [&>option:hover]:bg-orange-500"
          >
            <option value="openai">Open AI</option>
            <option value="elevenlabs">Eleven Labs</option>
            <option value="uplift">Uplift</option>
          </select>
        </div>
        <div className="space-y-2 bg-[#1A1D25]/70 border border-white/10 rounded-md p-4">
          <label htmlFor="voice-select" className="text-xs font-medium text-white/90 flex items-center">
            Select Voice
            <span
              className="ml-1 text-white/60 hover:cursor-help"
              title="Choose the voice for your assistant"
            >
              ⓘ
            </span>
          </label>
          <select
            id="voice-select"
            value={agentConfig.tts_options?.voice || ""}
            onChange={(e) => handleVoiceChange(e.target.value)}
            className="bg-[#1A1D25]/70 border border-white/10 text-white/90 text-sm rounded-md p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-white/20 transition-all [&>option]:bg-[#1A1D25] [&>option]:text-white/90 [&>option:hover]:bg-orange-500"
            disabled={isLoading}
          >
            <option value="">Select a voice</option>
            {Array.isArray(voices?.items) && voices.items
              .filter((voice: Voice) => voice.provider === voiceprovider)
              .map((voice: Voice) => (
                <option key={voice.id} value={voice.providerId}>
                  {voice.name} ({voice.provider})
                </option>
              ))}
          </select>
        </div>

        <div className="bg-[#1A1D25]/70 border border-white/10 rounded-md p-4 space-y-4">
          <h4 className="text-sm font-medium text-white/90">Voice Options</h4>
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-white/90 flex items-center">
                Speech Speed
                <span
                  className="ml-1 text-white/60 hover:cursor-help"
                  title="Adjust the speed of speech"
                >
                  ⓘ
                </span>
              </label>
              <span className="text-xs text-white/60">{agentConfig.tts_options?.speed || 1.0}x</span>
            </div>
            <Input
              type="number"
              min="0.1"
              max="2"
              step="0.1"
              value={agentConfig.tts_options?.speed || 1.0}
              onChange={(e) => handleTtsOptionsChange('speed', parseFloat(e.target.value))}
              className="bg-[#1A1D25]/70 border-white/10 text-white/90 text-sm focus:ring-2 focus:ring-white/20 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 