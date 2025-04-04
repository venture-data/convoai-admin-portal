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
      <h3 className="font-medium text-sm">Interaction Settings</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="allow_interruptions" className="flex items-center text-xs cursor-pointer">
            Allow Interruptions
            <span
              className="ml-1 text-muted-foreground hover:cursor-help"
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

        {agentConfig.allow_interruptions !== false && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="interrupt_speech_duration" className="flex items-center text-xs">
                  Interrupt Speech Duration (seconds)
                  <span
                    className="ml-1 text-muted-foreground hover:cursor-help"
                    title="Minimum duration of speech before interruption is allowed"
                  >
                    ⓘ
                  </span>
                </Label>
                <span className="text-sm">{agentConfig.interrupt_speech_duration || 0.5}</span>
              </div>
              <Slider
                id="interrupt_speech_duration"
                min={0}
                max={2}
                step={0.1}
                inverted={true}
                value={[agentConfig.interrupt_speech_duration || 0.5]}
                onValueChange={(value) => {
                  onAgentConfigChange("interrupt_speech_duration", value[0]);
                }}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="interrupt_min_words" className="flex items-center text-xs">
                  Interrupt Minimum Words
                  <span
                    className="ml-1 text-muted-foreground hover:cursor-help"
                    title="Minimum number of words before interruption is allowed"
                  >
                    ⓘ
                  </span>
                </Label>
                <span>{agentConfig.interrupt_min_words || 0}</span>
              </div>
              <Slider
                id="interrupt_min_words"
                min={0}
                max={10}
                step={1}
                inverted={true}
                value={[agentConfig.interrupt_min_words || 0]}
                onValueChange={(value) => {
                  onAgentConfigChange("interrupt_min_words", value[0]);
                }}
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="min_endpointing_delay" className="flex items-center text-xs">
              Minimum Endpointing Delay (seconds)
              <span
                className="ml-1 text-muted-foreground hover:cursor-help"
                title="Minimum delay before considering speech ended"
              >
                ⓘ
              </span>
            </Label>
            <span>{agentConfig.min_endpointing_delay || 0.5}</span>
          </div>
          <Slider
            id="min_endpointing_delay"
            min={0}
            max={2}
            step={0.1}
            inverted={true}
            value={[agentConfig.min_endpointing_delay || 0.5]}
            onValueChange={(value) => {
              onAgentConfigChange("min_endpointing_delay", value[0]);
            }}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="max_endpointing_delay" className="flex items-center text-xs">
              Maximum Endpointing Delay (seconds)
              <span
                className="ml-1 text-muted-foreground hover:cursor-help"
                title="Maximum delay before considering speech ended"
              >
                ⓘ
              </span>
            </Label>
            <span>{agentConfig.max_endpointing_delay || 6}</span>
          </div>
          <Slider
            id="max_endpointing_delay"
            min={1}
            max={10}
            step={0.5}
            inverted={true}
            value={[agentConfig.max_endpointing_delay || 6]}
            onValueChange={(value) => {
              onAgentConfigChange("max_endpointing_delay", value[0]);
            }}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="max_nested_function_calls" className="flex items-center text-xs">
              Maximum Nested Function Calls
              <span
                className="ml-1 text-muted-foreground hover:cursor-help"
                title="Maximum number of nested function calls allowed"
              >
                ⓘ
              </span>
            </Label>
            <span>{agentConfig.max_nested_function_calls || 1}</span>
          </div>
          <Slider
            id="max_nested_function_calls"
            min={0}
            max={5}
            step={1}
            inverted={true}
            value={[agentConfig.max_nested_function_calls || 1]}
            onValueChange={(value) => {
              onAgentConfigChange("max_nested_function_calls", value[0]);
            }}
          />
        </div>
      </div>
    </div>
  );
} 