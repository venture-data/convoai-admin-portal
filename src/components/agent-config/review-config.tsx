"use client"

import { AgentConfig } from "@/app/dashboard/new_agents/types"

interface ReviewConfigProps {
  agentConfig: AgentConfig
}

export function ReviewConfig({ agentConfig }: ReviewConfigProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Review Configuration</h3>
      
      <div className="space-y-4">
        <div className="border rounded p-4">
          <h4 className="font-medium mb-2">Model Configuration</h4>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-gray-500">Agent Name</dt>
              <dd>{agentConfig.model.agentName}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">First Message</dt>
              <dd>{agentConfig.model.firstMessage}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">System Prompt</dt>
              <dd>{agentConfig.model.systemPrompt}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Model</dt>
              <dd>{agentConfig.model.provider} / {agentConfig.model.model}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Language</dt>
              <dd>{agentConfig.model.language}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Temperature</dt>
              <dd>{agentConfig.model.temperature}</dd>
            </div>
          </dl>
        </div>

        <div className="border rounded p-4">
          <h4 className="font-medium mb-2">Voice Configuration</h4> 
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-gray-500">Voice</dt>
              <dd>{agentConfig.voice.name || "No voice selected"}</dd>
              <p className="text-sm text-gray-500">Provider</p>
              <dd>{agentConfig.voice.provider || "No provider selected"}</dd>
            </div>
          </dl>
        </div>

        <div className="border rounded p-4">
          <h4 className="font-medium mb-2">Knowledge Configuration</h4>
          <div>
            <dt className="text-sm text-gray-500">Files</dt>
            <p className="text-sm text-black font-semibold">{agentConfig.knowledge.files.map((file) => file.name).join(", ")}</p>
            <dd>{agentConfig.knowledge.files.length} files uploaded</dd>
          </div>
        </div>
      </div>
    </div>
  )
} 