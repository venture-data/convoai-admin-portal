"use client"

import { VoiceConfig as VoiceConfigType } from "@/app/dashboard/new_agents/types"
import { useVoice } from "@/app/hooks/use-voice"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


interface VoiceConfigProps {
  agentConfig: VoiceConfigType
  setAgentConfig: (config: VoiceConfigType) => void
}

export function VoiceConfig({ agentConfig, setAgentConfig }: VoiceConfigProps) {
  const { voices, isLoading, error } = useVoice()

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error: {error.message}</div>
  }

  const handleVoiceChange = (voiceId: string) => {
    const selectedVoice = Array.isArray(voices) ? voices.find((voice) => voice.id === voiceId) : null
    if (selectedVoice) {
      setAgentConfig({
        ...agentConfig,
        id: voiceId,
        name: selectedVoice.details.name,
        provider: selectedVoice.provider,
        details: selectedVoice.details
      })
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Voice Configuration</h3>
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="voice-select" className="text-sm font-medium">
            Select Voice
          </label>
          <Select value={agentConfig.id || ''} onValueChange={handleVoiceChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(voices) && voices.map((voice) => (
                <SelectItem key={voice.id} value={voice.id}>
                  {voice.details.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {agentConfig.id && (
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Preview Voice</label>
            <audio
              controls
              src={Array.isArray(voices) ? voices.find((v: VoiceConfigType) => v.id === agentConfig.id)?.details.preview_url : undefined}
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