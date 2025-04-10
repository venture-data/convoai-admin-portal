"use client";

import { ModelConfig as ModelConfigType } from "@/app/dashboard/new_agents/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export function ModelConfig({agentConfig, setAgentConfig}: {agentConfig: ModelConfigType, setAgentConfig: (config: ModelConfigType) => void}) {
  const [errors] = useState<{ [key: string]: boolean }>({});

  const onAgentConfigChange = (key: string, value: string | number | boolean) => {
    const newConfig = { ...agentConfig, [key]: value };
    setAgentConfig(newConfig);
  }
  return (
    <div className="space-y-6 text-white/90">
      <h3 className="text-xl font-bold mb-4 text-white">Basic Information</h3>
      <div className={`space-y-2 ${errors.agentName ? 'text-red-500' : ''}`}>
        <Label htmlFor="agent-name" className="flex items-center text-white/90">
          Agent Name
          <span
            className="ml-1 text-white/60 hover:cursor-help"
            title="The name of the agent"
          >
            ⓘ
          </span>
        </Label>
        <Input
          id="agent-name"
          value={agentConfig.agentName}
          className="w-full bg-[#1A1D25]/70 border-white/10 text-white placeholder:text-white/60"
          onChange={(e) => {
            onAgentConfigChange("agentName", e.target.value);
          }}
        />
      </div>

      <div className={`space-y-2 ${errors.description ? 'text-red-500' : ''}`}>
        <Label htmlFor="description" className="flex items-center text-white/90 text-xs">
          Description
          <span
            className="ml-1 text-white/60 hover:cursor-help"
            title="A brief description of the agent"
          >
            ⓘ
          </span>
        </Label>
        <textarea
          id="description"
          onChange={(e) => {
            onAgentConfigChange("description", e.target.value);
          }}
          className="w-full min-h-[80px] p-3 rounded-md border bg-[#1A1D25]/70 border-white/10 text-white placeholder:text-white/60 text-sm"
          value={agentConfig.description || ""}
        />
      </div>

      <div className={`space-y-2 ${errors.firstMessage ? 'text-red-500' : ''}`}>
        <Label htmlFor="first-message" className="flex items-center text-white/90 text-xs">
          Greeting
          <span
            className="ml-1 text-white/60 hover:cursor-help"
            title="The initial message your assistant will send"
          >
            ⓘ
          </span>
        </Label>
        <Input
          id="first-message"
          className="w-full bg-[#1A1D25]/70 border-white/10 text-white placeholder:text-white/60 text-sm"
          value={agentConfig.firstMessage}
          onChange={(e) => {
            onAgentConfigChange("firstMessage", e.target.value);
          }}
        />
      </div>
      <div className={`space-y-2 ${errors.systemPrompt ? 'text-red-500' : ''}`}>
        <Label htmlFor="system-prompt" className="flex items-center text-white/90 text-xs">
          System Prompt
          <span
            className="ml-1 text-white/60 hover:cursor-help"
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
          className="w-full min-h-[150px] p-3 rounded-md border bg-[#1A1D25]/70 border-white/10 text-white placeholder:text-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
          value={agentConfig.systemPrompt}
        />
      </div>

      <div className="space-y-4 border-t border-white/10 pt-4">
        <h3 className="font-medium text-white text-sm">Status</h3>
        
        <div className="bg-[#1A1D25]/70 border border-white/10 rounded-md p-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="active" className="flex items-center cursor-pointer text-white/90 text-xs">
              Active
              <span
                className="ml-1 text-white/60 hover:cursor-help"
                title="Whether this agent is active and can be used"
              >
                ⓘ
              </span>
            </Label>
            <Switch
              id="active"
              checked={agentConfig.active !== false}
              onCheckedChange={(checked) => {
                onAgentConfigChange("active", checked);
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="is_default" className="flex items-center cursor-pointer text-white/90">
            Set as Default Agent
            <span
              className="ml-1 text-white/60 hover:cursor-help"
              title="Set this agent as the default one"
            >
              ⓘ
            </span>
          </Label>
          <Switch
            id="is_default"
            checked={agentConfig.is_default === true}
            onCheckedChange={(checked) => {
              onAgentConfigChange("is_default", checked);
            }}
          />
        </div>
      </div>
    </div>
  );
}
