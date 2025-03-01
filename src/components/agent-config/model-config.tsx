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
import { ChatLanguages, elevenlabsVoiceLanguages } from "@/constants";
import { useState } from "react";

export function ModelConfig({agentConfig, setAgentConfig}: {agentConfig: ModelConfigType, setAgentConfig: (config: ModelConfigType) => void}) {
  const [errors] = useState<{ [key: string]: boolean }>({});

  const onAgentConfigChange = (key: string, value: string | number) => {
    const newConfig = { ...agentConfig, [key]: value };
    setAgentConfig(newConfig);
  }
  return (
    <div className="space-y-6">
      <div className={`space-y-2 ${errors.agentName ? 'text-red-500' : ''}`}>
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
      <div className={`space-y-2 ${errors.firstMessage ? 'text-red-500' : ''}`}>
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
      <div className={`space-y-2 ${errors.systemPrompt ? 'text-red-500' : ''}`}>
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
        <Select 
          value={agentConfig.provider} 
          onValueChange={(value: "elevenlabs" | "openai") => {
            onAgentConfigChange("provider", value);
          }}
        >
          <SelectTrigger id="provider">
            <SelectValue placeholder="Select provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
            <SelectItem value="openai">OpenAI</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className={`space-y-2 ${errors.model ? 'text-red-500' : ''}`}>
        <Label htmlFor="model" className="flex items-center">
          Model
          <span
            className="ml-1 text-muted-foreground hover:cursor-help"
            title="Select the AI model to power your assistant"
          >
            ⓘ
          </span>
        </Label>
        <Select 
          defaultValue={agentConfig.model}
          onValueChange={(value) => onAgentConfigChange("model", value)}
        >
          <SelectTrigger id="model">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            {agentConfig.provider === "elevenlabs" ? (
              <>
                <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash (Fastest)</SelectItem>
                <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                <SelectItem value="gemini-1.0-pro">Gemini 1.0 Pro</SelectItem>
                <SelectItem value="claude-3-5-sonnet">Claude 3.5 Sonnet</SelectItem>
                <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                <SelectItem value="grok-beta">Grok Beta</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="gpt-4o-mini-realtime">GPT-4o Mini Realtime</SelectItem>
                <SelectItem value="gpt-4o-realtime">GPT-4o Realtime</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className={`space-y-2 ${errors.language ? 'text-red-500' : ''}`}>
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
          {
            agentConfig.provider === "elevenlabs" ? (
              <SelectContent>
                {elevenlabsVoiceLanguages.map((language) => (
                  <SelectItem key={language} value={language}>{language}</SelectItem>
                ))}
              </SelectContent>
            ) : (
              <SelectContent>
                {ChatLanguages.map((language) => (
                  <SelectItem key={language} value={language?.toLowerCase()}>{language}</SelectItem>
                ))}
              </SelectContent>
            )
          }
        </Select>
      </div>

      <div className={`space-y-4 ${errors.temperature ? 'text-red-500' : ''}`}>
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

      <div className="space-y-2">
        <Label htmlFor="type" className="flex items-center">
          Type
          <span
            className="ml-1 text-muted-foreground hover:cursor-help"
            title="Select the type of messages this agent can handle"
          >
            ⓘ
          </span>
        </Label>
        <Select 
          value={agentConfig.type} 
          onValueChange={(value) => onAgentConfigChange("type", value)}
        >
          <SelectTrigger id="type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="outbound">Outbound</SelectItem>
            <SelectItem value="inbound">Inbound</SelectItem>
          </SelectContent>
        </Select>
      </div>

    </div>
  );
}
