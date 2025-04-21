"use client";

import { ModelConfig as ModelConfigType } from "@/app/dashboard/new_agents/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { BotIcon, Brain, MessageSquare, Sparkles } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export function ModelConfig({agentConfig, setAgentConfig}: {agentConfig: ModelConfigType, setAgentConfig: (config: ModelConfigType) => void}) {
  const [errors] = useState<{ [key: string]: boolean }>({});

  const onAgentConfigChange = (key: string, value: string | number | boolean) => {
    const newConfig = { ...agentConfig, [key]: value };
    setAgentConfig(newConfig);
  }
  
  return (
    <div className="space-y-8 text-white/90 w-full">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <BotIcon className="h-5 w-5 text-orange-400" />
          <h3 className="text-xl font-bold text-white">Model Configuration</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-2 py-1 border-none">
            <span className="text-xs text-white/60">
              {agentConfig.active !== false ? "Active" : "Inactive"}
            </span>
            <Switch
              id="active"
              checked={agentConfig.active !== false}
              onCheckedChange={(checked) => {
                onAgentConfigChange("active", checked);
              }}
              className="data-[state=checked]:bg-orange-500 h-4 w-7"
            />
          </div>
        </div>
      </div>
      <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 to-[#1A1D25]/60 border border-white/10">
        <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
          <BotIcon className="h-4 w-4" />
          Basic Information
        </h4>
        
        <div className="space-y-5">
          <div className={`space-y-2 ${errors.agentName ? 'text-red-500' : ''}`}>
            <Label htmlFor="agent-name" className="flex items-center text-white/90 text-sm">
              Agent Name
              <span
                className="ml-1 text-white/60 hover:cursor-help"
                title="The name of the agent"
              >
                ⓘ
              </span>
            </Label>
            <div className="relative">
              <Input
                id="agent-name"
                value={agentConfig.agentName}
                className="w-full bg-[#1A1D25] border-white/10 text-white rounded-md pl-9 text-sm placeholder:text-white/60 focus:border-orange-500/50 focus:ring-orange-500/20"
                placeholder="Enter agent name"
                onChange={(e) => {
                  onAgentConfigChange("agentName", e.target.value);
                }}
              />
              <BotIcon className="h-4 w-4 text-white/40 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          <div className={`space-y-2 ${errors.description ? 'text-red-500' : ''}`}>
            <Label htmlFor="description" className="flex items-center text-white/90 text-sm">
              Description
              <span
                className="ml-1 text-white/60 hover:cursor-help"
                title="A brief description of the agent"
              >
                ⓘ
              </span>
            </Label>
            <div className="relative">
              <textarea
                id="description"
                onChange={(e) => {
                  onAgentConfigChange("description", e.target.value);
                }}
                placeholder="Describe what this agent does"
                className="w-full min-h-[80px] p-3 pl-9 rounded-md border bg-[#1A1D25] border-white/10 text-white placeholder:text-white/60 text-sm focus:border-orange-500/50 focus:ring-orange-500/20"
                value={agentConfig.description || ""}
              />
              <MessageSquare className="h-4 w-4 text-white/40 absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="llm-provider" className="flex items-center text-white/90 text-sm">
              LLM Provider
              <span
                className="ml-1 text-white/60 hover:cursor-help"
                title="The provider for the language model"
              >
                ⓘ
              </span>
            </Label>
            <Select 
              value={agentConfig.provider} 
              onValueChange={(value) => onAgentConfigChange("provider", value)}
            >
              <SelectTrigger 
                className="w-full bg-[#1A1D25] border-white/10 text-white placeholder:text-white/60 focus:border-orange-500/50 focus:ring-orange-500/20"
                id="llm-provider"
              >
                <div className="flex items-center">
                  <Brain className="w-4 h-4 mr-2 text-orange-400" />
                  <SelectValue placeholder="Select provider" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-[#1A1D25] border-white/10 text-white">
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
                <SelectItem value="uplift">Uplift</SelectItem>
                <SelectItem value="cartesia">Cartesia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>


      <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 via-[#1A1D25]/60 to-orange-950/10 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.05)]">
        <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          AI Prompt Settings
        </h4>
        
        <div className="space-y-5">
          <div className={`space-y-2 ${errors.firstMessage ? 'text-red-500' : ''}`}>
            <Label htmlFor="first-message" className="flex items-center text-white/90 text-sm">
              Greeting
              <span
                className="ml-1 text-white/60 hover:cursor-help"
                title="The initial message your assistant will send"
              >
                ⓘ
              </span>
            </Label>
            <div className="relative">
              <Input
                id="first-message"
                className="w-full bg-[#1A1D25] border-white/10 text-white pl-9 rounded-md text-sm placeholder:text-white/60 focus:border-orange-500/50 focus:ring-orange-500/20"
                placeholder="Hello! How can I assist you today?"
                value={agentConfig.firstMessage}
                onChange={(e) => {
                  onAgentConfigChange("firstMessage", e.target.value);
                }}
              />
              <MessageSquare className="h-4 w-4 text-white/40 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          <div className={`space-y-2 ${errors.systemPrompt ? 'text-red-500' : ''}`}>
            <Label htmlFor="system-prompt" className="flex items-center text-white/90 text-sm">
              System Prompt
              <span
                className="ml-1 text-white/60 hover:cursor-help"
                title="Instructions for the AI assistant"
              >
                ⓘ
              </span>
            </Label>
            <div className="relative">
              <textarea
                id="system-prompt"
                onChange={(e) => {
                  onAgentConfigChange("systemPrompt", e.target.value);
                }}
                placeholder="You are a helpful AI assistant..."
                className="w-full min-h-[150px] p-3 pl-9 rounded-md border bg-[#1A1D25] border-white/10 text-white placeholder:text-white/60 text-sm focus:border-orange-500/50 focus:ring-orange-500/20 transition-all"
                value={agentConfig.systemPrompt}
              />
              <Sparkles className="h-4 w-4 text-orange-400 absolute left-3 top-3" />
            </div>
            <p className="text-xs text-white/50 italic mt-1">Detailed instructions to control how the AI behaves</p>
          </div>
        </div>
      </div>
    </div>
  );
}
