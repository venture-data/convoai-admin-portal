"use client";

import { ModelConfig as ModelConfigType } from "@/app/dashboard/new_agents/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Settings2, Clock, MessagesSquare, Zap, PhoneOff, X } from "lucide-react";
import { useState } from "react";

export function InteractionSettings({agentConfig, setAgentConfig}: {agentConfig: ModelConfigType, setAgentConfig: (config: ModelConfigType) => void}) {
  const [phraseInput, setPhraseInput] = useState('');

  const onAgentConfigChange = (key: string, value: string | number | boolean) => {
    const newConfig = { ...agentConfig, [key]: value };
    setAgentConfig(newConfig);
  }

  const onProfileOptionsChange = (key: string, value: boolean | string | string[]) => {
    const newConfig = {
      ...agentConfig,
      profile_options: {
        ...(agentConfig.profile_options || {}),
        [key]: value,
      },
    };
    setAgentConfig(newConfig as ModelConfigType);
  };

  const handleAddPhrase = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && phraseInput.trim() !== '') {
      e.preventDefault();
      const currentPhrases = agentConfig.profile_options?.end_call_phrases || [];
      const newPhrases = [...currentPhrases, phraseInput.trim()];
      onProfileOptionsChange('end_call_phrases', newPhrases);
      setPhraseInput('');
    }
  };

  const handleRemovePhrase = (indexToRemove: number) => {
    const currentPhrases = agentConfig.profile_options?.end_call_phrases || [];
    const newPhrases = currentPhrases.filter((_: string, index: number) => index !== indexToRemove);
    onProfileOptionsChange('end_call_phrases', newPhrases);
  };
  
  return (
    <div className="space-y-8 text-white/90">
      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <Settings2 className="h-5 w-5 text-orange-400" />
        <h3 className="text-xl font-bold text-white">Interaction Settings</h3>
      </div>
      
      {/* Interruption Settings - No background as requested */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-orange-400 mb-3 flex items-center gap-2">
          <MessagesSquare className="h-4 w-4" />
          Interruption Control
        </h4>
        
        <div className="flex items-center justify-between py-2 border-b border-white/5">
          <Label htmlFor="allow_interruptions" className="flex items-center text-sm text-white/90">
            Allow Interruptions
            <span
              className="ml-1 text-white/60 hover:cursor-help"
              title="Allow users to interrupt the agent while speaking"
            >
              ⓘ
            </span>
          </Label>
          <Switch
            id="allow_interruptions"
            checked={agentConfig.allow_interruptions !== false}
            onCheckedChange={(checked) => {
              onAgentConfigChange("allow_interruptions", checked);
            }}
          />
        </div>
      </div>

      {/* Timing configuration */}
      {agentConfig.allow_interruptions !== false && (
        <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 to-[#1A1D25]/60 border border-white/10">
          <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Interruption Timing
          </h4>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="interrupt_speech_duration" className="flex items-center text-sm text-white/90">
                  Interrupt Speech Duration (seconds)
                  <span
                    className="ml-1 text-white/60 hover:cursor-help"
                    title="Minimum duration of speech before interruption is allowed"
                  >
                    ⓘ
                  </span>
                </Label>
                <span className="text-sm text-orange-400 font-medium">{agentConfig.interrupt_speech_duration || 0.5}s</span>
              </div>
              <Slider
                id="interrupt_speech_duration"
                min={0}
                max={2}
                step={0.1}
                value={[agentConfig.interrupt_speech_duration || 0.5]}
                onValueChange={(value) => {
                  onAgentConfigChange("interrupt_speech_duration", value[0]);
                }}
                className="focus:ring-1 focus:ring-orange-500/20 transition-all"
              />
              <p className="text-xs text-white/50 italic">Shorter duration allows for quicker interruptions</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="interrupt_min_words" className="flex items-center text-sm text-white/90">
                  Interrupt Minimum Words
                  <span
                    className="ml-1 text-white/60 hover:cursor-help"
                    title="Minimum number of words before interruption is allowed"
                  >
                    ⓘ
                  </span>
                </Label>
                <span className="text-sm text-orange-400 font-medium">{agentConfig.interrupt_min_words || 0} words</span>
              </div>
              <Slider
                id="interrupt_min_words"
                min={0}
                max={10}
                step={1}
                value={[agentConfig.interrupt_min_words || 0]}
                onValueChange={(value) => {
                  onAgentConfigChange("interrupt_min_words", value[0]);
                }}
                className="focus:ring-1 focus:ring-orange-500/20 transition-all"
              />
            </div>
          </div>
        </div>
      )}
      <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 via-[#1A1D25]/60 to-orange-950/10 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.05)]">
        <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Response Timing
        </h4>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label htmlFor="min_endpointing_delay" className="flex items-center text-sm text-white/90">
                Minimum Endpointing Delay
                <span
                  className="ml-1 text-white/60 hover:cursor-help"
                  title="Minimum delay before considering speech ended (seconds)"
                >
                  ⓘ
                </span>
              </Label>
              <span className="text-sm text-orange-400 font-medium">{agentConfig.min_endpointing_delay || 0.5}s</span>
            </div>
            <Slider
              id="min_endpointing_delay"
              min={0}
              max={2}
              step={0.1}
              value={[agentConfig.min_endpointing_delay || 0.5]}
              onValueChange={(value) => {
                onAgentConfigChange("min_endpointing_delay", value[0]);
              }}
              className="focus:ring-1 focus:ring-orange-500/20 transition-all"
            />
            <p className="text-xs text-white/50 italic">Shorter delays mean quicker responses but may cut off speech</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label htmlFor="max_endpointing_delay" className="flex items-center text-sm text-white/90">
                Maximum Endpointing Delay
                <span
                  className="ml-1 text-white/60 hover:cursor-help"
                  title="Maximum delay before considering speech ended (seconds)"
                >
                  ⓘ
                </span>
              </Label>
              <span className="text-sm text-orange-400 font-medium">{agentConfig.max_endpointing_delay || 6}s</span>
            </div>
            <Slider
              id="max_endpointing_delay"
              min={1}
              max={10}
              step={0.5}
              value={[agentConfig.max_endpointing_delay || 6]}
              onValueChange={(value) => {
                onAgentConfigChange("max_endpointing_delay", value[0]);
              }}
              className="focus:ring-1 focus:ring-orange-500/20 transition-all"
            />
            <p className="text-xs text-white/50 italic">Longer delays prevent premature responses during pauses</p>
          </div>
        </div>
      </div>

      {/* Function Call Settings */}
      <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 to-[#1A1D25]/60 border border-white/10">
        <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Function Call Settings
        </h4>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label htmlFor="max_nested_function_calls" className="flex items-center text-sm text-white/90">
              Maximum Nested Function Calls
              <span
                className="ml-1 text-white/60 hover:cursor-help"
                title="Maximum number of nested function calls allowed"
              >
                ⓘ
              </span>
            </Label>
            <span className="text-sm text-orange-400 font-medium">{agentConfig.max_nested_function_calls || 1}</span>
          </div>
          <Slider
            id="max_nested_function_calls"
            min={0}
            max={5}
            step={1}
            value={[agentConfig.max_nested_function_calls || 1]}
            onValueChange={(value) => {
              onAgentConfigChange("max_nested_function_calls", value[0]);
            }}
            className="focus:ring-1 focus:ring-orange-500/20 transition-all"
          />
          <p className="text-xs text-white/50 italic">Higher values allow more complex operations but may increase latency</p>
        </div>
      </div>

      {/* End of Call Settings */}
      <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 to-[#1A1D25]/60 border border-white/10">
        <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
          <PhoneOff className="h-4 w-4" />
          End of Call Settings
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-white/5 pr-2">
            <Label htmlFor="end_call_function" className="flex items-center text-sm text-white/90">
              End Call Function
              <span
                className="ml-1 text-white/60 hover:cursor-help"
                title="Enable function to end the call"
              >
                ⓘ
              </span>
            </Label>
            <Switch
              id="end_call_function"
              checked={agentConfig.profile_options?.end_call_function === true}
              onCheckedChange={(checked) => onProfileOptionsChange("end_call_function", checked)}
              className="data-[state=checked]:bg-orange-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end_call_message" className="flex items-center text-white/90 text-sm">
              End Call Message
              <span
                className="ml-1 text-white/60 hover:cursor-help"
                title="The message to be sent when the call ends."
              >
                ⓘ
              </span>
            </Label>
            <div className="relative">
              <textarea
                id="end_call_message"
                onChange={(e) => onProfileOptionsChange("end_call_message", e.target.value)}
                placeholder="Enter end call message"
                className="w-full min-h-[80px] p-3 pl-9 rounded-md border bg-[#1A1D25] border-white/10 text-white placeholder:text-white/60 text-sm focus:border-orange-500/50 focus:ring-orange-500/20"
                value={agentConfig.profile_options?.end_call_message || ""}
              />
              <MessagesSquare className="h-4 w-4 text-white/40 absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="end_call_phrases" className="flex items-center text-white/90 text-sm">
              End Call Phrases
              <span
                className="ml-1 text-white/60 hover:cursor-help"
                title="Phrases that will trigger the end of the call. Press Enter to add a phrase."
              >
                ⓘ
              </span>
            </Label>
            <div className="flex flex-wrap gap-2 p-2 rounded-md border bg-[#1A1D25] border-white/10 items-center">
              {(agentConfig.profile_options?.end_call_phrases || []).map((phrase: string, index: number) => (
                <div key={index} className="flex items-center gap-1 bg-white/10 text-white/90 rounded-full px-3 py-1 text-sm">
                  <span>{phrase}</span>
                  <button onClick={() => handleRemovePhrase(index)} className="text-white/70 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <Input
                id="end_call_phrases_input"
                type="text"
                value={phraseInput}
                onChange={(e) => setPhraseInput(e.target.value)}
                onKeyDown={handleAddPhrase}
                placeholder="Add phrase and press Enter..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder:text-white/50"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 