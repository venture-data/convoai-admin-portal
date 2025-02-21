"use client";

import { ModelConfig as ModelConfigType } from "@/app/dashboard/new_agents/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export function ModelConfig({agentConfig, setAgentConfig}: {agentConfig: ModelConfigType, setAgentConfig: (config: ModelConfigType) => void}) {
  
  const onAgentConfigChange = (key: string, value: string | number) => {
    setAgentConfig({ ...agentConfig, [key]: value });
  }
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="agent-name" className="flex items-center">
          Agent Name
          <span
            className="ml-1 text-muted-foreground hover:cursor-help"
            title="The name of the agent"
          >
            ⓘ
          </span>
        </Label>
        <Input
          id="agent-name"
          value={agentConfig.agentName}
          className="w-full"
          onChange={(e) => {
            onAgentConfigChange("agentName", e.target.value);
          }}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="first-message" className="flex items-center">
          First Message
          <span
            className="ml-1 text-muted-foreground hover:cursor-help"
            title="The initial message your assistant will send"
          >
            ⓘ
          </span>
        </Label>
        <Input
          id="first-message"
          className="w-full"
          value={agentConfig.firstMessage}
          onChange={(e) => {
            onAgentConfigChange("firstMessage", e.target.value);
          }}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="system-prompt" className="flex items-center">
          System Prompt
          <span
            className="ml-1 text-muted-foreground hover:cursor-help"
            title="Instructions for the AI assistant"
          >
            ⓘ
          </span>
        </Label>
        <textarea
          id="system-prompt"
          onChange={(e) => {
            onAgentConfigChange("systemPrompt", e.target.value);
          }}
          className="w-full min-h-[150px] p-3 rounded-md border"
          value={agentConfig.systemPrompt}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="provider">Provider</Label>
        <Select value={agentConfig.provider} onValueChange={(value) => {
          onAgentConfigChange("provider", value);
        }}>
          <SelectTrigger id="provider">
            <SelectValue placeholder="Select provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="openai">OpenAI</SelectItem>
            <SelectItem value="anthropic">Anthropic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="model" className="flex items-center">
          Model
          <span
            className="ml-1 text-muted-foreground hover:cursor-help"
            title="Select the AI model to power your assistant"
          >
            ⓘ
          </span>
        </Label>
        <Select value={agentConfig.model} onValueChange={(value) => {
          onAgentConfigChange("model", value);
        }}>
          <SelectTrigger id="model">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4o-mini">GPT-4o-mini</SelectItem>
            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="language" className="flex items-center">
          Language
          <span
            className="ml-1 text-muted-foreground hover:cursor-help"
            title="Select the language of the assistant"
          >
            ⓘ
          </span>
        </Label>
        <Select value={agentConfig.language} onValueChange={(value) => {
          onAgentConfigChange("language", value);
        }}>
          <SelectTrigger id="language">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ur">Urdu</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label htmlFor="temperature" className="flex items-center">
          Temperature
          <span
            className="ml-1 text-muted-foreground hover:cursor-help"
            title="Controls randomness in the model's responses"
          >
            ⓘ
          </span>
        </Label>
        <div className="flex items-center gap-4">
          <Slider
            id="temperature"
            value={[agentConfig.temperature]}
            max={1}
            step={0.05}
            className="flex-1"
            onValueChange={(value) => {
              onAgentConfigChange("temperature", value[0]);
            }}
          />
          <span className="w-12 text-center">{agentConfig.temperature}</span>
        </div>
      </div>

    </div>
  );
}
