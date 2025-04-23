"use client"

import { VoiceConfig as VoiceConfigType } from "@/app/dashboard/new_agents/types"
import { useVoice } from "@/app/hooks/use-voice";
import { useState, useEffect} from "react";
import { Volume2, Mic, Speaker, Info } from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

      </div>
      {(provider === "openai" || provider === 'elevenlabs') &&<div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 via-[#1A1D25]/60 to-orange-950/10 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.05)]">
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
        {agentConfig.tts_options?.voice_name && (
            <div className="mt-4 p-3 rounded bg-[#1A1D25]/50 border border-white/5">
              <p className="text-xs text-white/70">Selected voice: <span className="text-orange-400 font-medium">{agentConfig?.tts_options?.voice_name}</span></p>
            </div>
          )}
    </div>
  );
} 