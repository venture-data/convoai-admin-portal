"use client"

import { VoiceConfig as VoiceConfigType } from "@/app/dashboard/new_agents/types"
import { useVoice } from "@/app/hooks/use-voice";
import { useState, useEffect} from "react";
import { Volume2, Mic, Speaker, Info } from "lucide-react";
import { Input } from "../ui/input";

// Add global styles for select options
const globalStyles = `
  .voice-select option:hover,
  .voice-select option:focus {
    box-shadow: 0 0 10px 100px #f97316 inset !important;
    background-color: #f97316 !important;
    color: white !important;
  }
`;

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
            <select 
              value={voiceprovider}
              onChange={handleProviderChange}
              className="voice-select bg-[#1A1D25] border border-white/10 text-white/90 text-sm rounded-md p-2.5 pl-9 w-full focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 hover:!border-orange-500/50 hover:!border-2 transition-all appearance-none"
            >
              <option value="openai">OpenAI</option>
              <option value="elevenlabs">ElevenLabs</option>
              <option value="uplift">Uplift</option>
            </select>
            <Volume2 className="h-4 w-4 text-white/40 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-4 w-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 via-[#1A1D25]/60 to-orange-950/10 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.05)]">
          <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
            <Mic className="h-4 w-4" />
            Voice Selection
          </h4>
          
          <div className="relative">
            <select
              id="voice-select"
              value={agentConfig.tts_options?.voice || ""}
              onChange={(e) => handleVoiceChange(e.target.value)}
              className="voice-select bg-[#1A1D25] border border-white/10 text-white/90 text-sm rounded-md p-2.5 pl-9 w-full focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 hover:!border-orange-500/50 hover:!border-2 transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
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
            <Mic className="h-4 w-4 text-orange-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-4 w-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <br/>
        
          
          {isLoading && (
            <p className="mt-2 text-xs text-white/50 italic">Loading available voices...</p>
          )}
          
          
          {!isLoading && voices?.items && voices.items.length === 0 && (
            <p className="mt-2 text-xs text-orange-400">No voices available for this provider</p>
          )}

        </div>

      </div>
      {provider === "openai" &&        <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 via-[#1A1D25]/60 to-orange-950/10 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.05)]">
          <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Speech Speed
          </h4>
          
          <div className="flex flex-col space-y-2">
            <Input
              type="number"
              min="0.1"
              max="2"
              step="0.1"
              value={agentConfig.tts_options?.speed || 1.0}
              onChange={(e) => handleTtsOptionsChange('speed', parseFloat(e.target.value))}
              className="bg-[#1A1D25]/70 border-white/10 text-white/90 text-sm focus:ring-2 focus:ring-white/20 transition-all"
            />
            <div className="mt-2 text-xs text-white/60 p-3 bg-[#1A1D25]/30 rounded border border-white/5">
              <p className="flex items-start gap-2">
                <Info className="h-3 w-3 text-orange-400 mt-0.5 flex-shrink-0" />
                <span>
                  Speech speed controls how quickly the AI speaks. Values range from 0.1 (very slow) to 2.0 (very fast), with 1.0 being the normal speaking rate. Adjust this to match your preference or the context of the conversation.
                </span>
              </p>
              <div className="grid grid-cols-3 gap-2 mt-2 text-center text-white/40 text-[10px]">
                <span className="bg-[#1A1D25]/50 p-1 rounded">0.5x - Slower, more deliberate speech</span>
                <span className="bg-[#1A1D25]/50 p-1 rounded">1.0x - Normal conversational speed</span>
                <span className="bg-[#1A1D25]/50 p-1 rounded">1.5x - Faster, more efficient speech</span>
              </div>
            </div>
          </div>
        </div> }
    </div>
  );
} 