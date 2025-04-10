"use client";

import { ModelConfig as ModelConfigType } from "@/app/dashboard/new_agents/types";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export function InteractionSettings({agentConfig, setAgentConfig}: {agentConfig: ModelConfigType, setAgentConfig: (config: ModelConfigType) => void}) {
  const onAgentConfigChange = (key: string, value: string | number | boolean) => {
    const newConfig = { ...agentConfig, [key]: value };
    setAgentConfig(newConfig);
  }
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-white/90">Interaction Settings</h3>
      
      <div className="space-y-4">
        <div className="bg-[#1A1D25]/70 border border-white/10 rounded-md p-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="allow_interruptions" className="flex items-center text-xs text-white/90">
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

        {agentConfig.allow_interruptions !== false && (
          <>
            <div className="space-y-2 bg-[#1A1D25]/70 border border-white/10 rounded-md p-4">
              <div className="flex justify-between">
                <Label htmlFor="interrupt_speech_duration" className="flex items-center text-xs text-white/90">
                  Interrupt Speech Duration (seconds)
                  <span
                    className="ml-1 text-white/60 hover:cursor-help"
                    title="Minimum duration of speech before interruption is allowed"
                  >
                    ⓘ
                  </span>
                </Label>
                <span className="text-sm text-white/90">{agentConfig.interrupt_speech_duration || 0.5}</span>
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
                className="focus:ring-2 focus:ring-white/20 transition-all"
              />
            </div>

            <div className="space-y-2 bg-[#1A1D25]/70 border border-white/10 rounded-md p-4">
              <div className="flex justify-between">
                <Label htmlFor="interrupt_min_words" className="flex items-center text-xs text-white/90">
                  Interrupt Minimum Words
                  <span
                    className="ml-1 text-white/60 hover:cursor-help"
                    title="Minimum number of words before interruption is allowed"
                  >
                    ⓘ
                  </span>
                </Label>
                <span className="text-sm text-white/90">{agentConfig.interrupt_min_words || 0}</span>
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
                className="transition-all"
              />
            </div>
          </>
        )}

        <div className="space-y-2 bg-[#1A1D25]/70 border border-white/10 rounded-md p-4">
          <div className="flex justify-between">
            <Label htmlFor="min_endpointing_delay" className="flex items-center text-xs text-white/90">
              Minimum Endpointing Delay (seconds)
              <span
                className="ml-1 text-white/60 hover:cursor-help"
                title="Minimum delay before considering speech ended"
              >
                ⓘ
              </span>
            </Label>
            <span className="text-sm text-white/90">{agentConfig.min_endpointing_delay || 0.5}</span>
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
            className="focus:ring-2 focus:ring-white/20 transition-all"
          />
        </div>

        <div className="space-y-2 bg-[#1A1D25]/70 border border-white/10 rounded-md p-4">
          <div className="flex justify-between">
            <Label htmlFor="max_endpointing_delay" className="flex items-center text-xs text-white/90">
              Maximum Endpointing Delay (seconds)
              <span
                className="ml-1 text-white/60 hover:cursor-help"
                title="Maximum delay before considering speech ended"
              >
                ⓘ
              </span>
            </Label>
            <span className="text-sm text-white/90">{agentConfig.max_endpointing_delay || 6}</span>
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
            className="focus:ring-2 focus:ring-white/20 transition-all"
          />
        </div>

        <div className="space-y-2 bg-[#1A1D25]/70 border border-white/10 rounded-md p-4">
          <div className="flex justify-between">
            <Label htmlFor="max_nested_function_calls" className="flex items-center text-xs text-white/90">
              Maximum Nested Function Calls
              <span
                className="ml-1 text-white/60 hover:cursor-help"
                title="Maximum number of nested function calls allowed"
              >
                ⓘ
              </span>
            </Label>
            <span className="text-sm text-white/90">{agentConfig.max_nested_function_calls || 1}</span>
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
            className="focus:ring-2 focus:ring-white/20 transition-all"
          />
        </div>
      </div>
    </div>
  );
} 