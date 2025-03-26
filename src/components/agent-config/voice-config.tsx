"use client"

import { VoiceConfig as VoiceConfigType } from "@/app/dashboard/new_agents/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { voices } from "@/constants"
import { useState } from "react";


interface VoiceConfigProps {
  provider:string,
  agentConfig: VoiceConfigType
  setAgentConfig: (config: VoiceConfigType) => void
}

export function VoiceConfig({provider, agentConfig, setAgentConfig }: VoiceConfigProps) {
  const [errors] = useState<{ [key: string]: boolean }>({});

  const handleVoiceChange = (voiceId: string) => {
    const selectedVoice = Array.isArray(voices) ? voices.find((voice) => voice.details.id === voiceId) : null
    if (selectedVoice) {
      setAgentConfig({
        ...agentConfig,
        id: voiceId,
        name: selectedVoice.details.name,
        provider: selectedVoice.provider as "elevenlabs" | "openai",
        details: {
          ...selectedVoice.details,
          labels: Object.values(selectedVoice.details.labels),
        }
      })
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-white/90">Voice Configuration</h3>
      <div className="space-y-4">
        <div className={`flex flex-col space-y-2 ${errors.id ? 'text-red-500' : ''}`}>
          <label htmlFor="voice-select" className="text-xs font-medium text-white/90">
            Select Voice
          </label>
          <Select value={agentConfig.id || ''} onValueChange={handleVoiceChange}>
            <SelectTrigger className="bg-[#1A1D25]/70 border-white/10 text-white/90">
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(voices) && voices.map((voice) => (
                voice.provider === provider && <SelectItem key={voice.details.id} value={voice.details.id}>
                {voice.details.name}
              </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {agentConfig.id && (
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-medium text-white/90">Preview Voice</label>
            <audio
              controls
              src={Array.isArray(voices) ? voices.find((v) => v.details.id === agentConfig.id)?.details.preview_url : undefined}
              className="w-full"
            >
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
    </div>
  )
} 