"use client"

import { VoiceConfig as VoiceConfigType } from "@/app/dashboard/new_agents/types"
import { useVoice } from "@/app/hooks/use-voice";
import { useState, useEffect } from "react";
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
  provider:string,
  agentConfig: VoiceConfigType
  setAgentConfig: (config: VoiceConfigType) => void
}

export function VoiceConfig({provider, agentConfig, setAgentConfig }: VoiceConfigProps) {
  const [errors] = useState<{ [key: string]: boolean }>({});
  const {voices} = useVoice()

  // Set the initial voice if it's not already set
  useEffect(() => {
    if (agentConfig.tts_options?.voice && !agentConfig.details?.name && voices?.items) {
      const selectedVoice = voices.items.find((voice: Voice) => voice.id.toLowerCase() === agentConfig.tts_options?.voice?.toLowerCase());
      if (selectedVoice) {
        setAgentConfig({
          ...agentConfig,
          id: selectedVoice.id,
          name: selectedVoice.name.toLowerCase(),
          provider: selectedVoice.provider as "elevenlabs" | "openai",
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
    const selectedVoice = Array.isArray(voices?.items) ? voices?.items?.find((voice: Voice) => voice.providerId.toLowerCase() === voiceId.toLowerCase()) : null
    if (selectedVoice) {
      setAgentConfig({
        ...agentConfig,
        id: selectedVoice.id,
        name: selectedVoice.name.toLowerCase(),
        provider: selectedVoice.provider as "elevenlabs" | "openai",
        details: {
          name: selectedVoice.name,
          high_quality_base_model_ids: ["tts-1"],
          preview_url: selectedVoice.preview_url || "",
          labels: [selectedVoice.description],
        },
        tts_options: {
          ...agentConfig.tts_options,
          voice: selectedVoice.id
        }
      })
    }
  }

  const handleTtsOptionsChange = (key: string, value: number) => {
    setAgentConfig({
      ...agentConfig,
      tts_options: {
        ...agentConfig.tts_options,
        [key]: value
      }
    })
  }
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-white/90">Voice Configuration</h3>
      <div className="space-y-4">
        <div className={`flex flex-col space-y-2 ${errors.id ? 'text-red-500' : ''}`}>
          <label htmlFor="voice-select" className="text-xs font-medium text-white/90">
            Select Voice
          </label>
          <select
            id="voice-select"
            value={agentConfig.name}
            onChange={(e) => handleVoiceChange(e.target.value)}
            className="bg-[#1A1D25]/70 border border-white/10 text-white/90 rounded-md p-2 w-full"
          >
            <option value="">Select a voice</option>
            {Array.isArray(voices?.items) && voices.items.map((voice: Voice) => (
              voice.provider === provider && (
                <option key={voice.id} value={voice.providerId.toLowerCase()}>
                  {voice.name.toLowerCase()} ({voice.provider.toLowerCase()})
                </option>
              )
            ))}
          </select>
        </div>

        {agentConfig.tts_options?.voice && (
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-medium text-white/90">Preview Voice</label>
            <audio
              controls
              src={Array.isArray(voices?.items) ? voices.items.find((voice: Voice) => voice.name.toLowerCase() === agentConfig.tts_options?.voice?.toLowerCase())?.preview_url : undefined}
              className="w-full"
            >
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-white/90">TTS Options</h4>
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-medium text-white/90">Speed</label>
            <Input
              type="number"
              min="0.1"
              max="2"
              step="0.1"
              value={agentConfig.tts_options?.speed || 1.0}
              onChange={(e) => handleTtsOptionsChange('speed', parseFloat(e.target.value))}
              className="bg-[#1A1D25]/70 border-white/10 text-white/90"
            />
          </div>
        </div>
      </div>
    </div>
  )
} 