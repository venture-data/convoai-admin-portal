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
              <dd className={agentConfig.model.agentName ? '' : 'text-red-500'}>{agentConfig.model.agentName || 'Missing'}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">First Message</dt>
              <dd className={agentConfig.model.firstMessage ? '' : 'text-red-500'}>{agentConfig.model.firstMessage || 'Missing'}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">System Prompt</dt>
              <dd className={agentConfig.model.systemPrompt ? '' : 'text-red-500'}>{agentConfig.model.systemPrompt || 'Missing'}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Model</dt>
              <dd className={agentConfig.model.provider && agentConfig.model.model ? '' : 'text-red-500'}>{agentConfig.model.provider} / {agentConfig.model.model || 'Missing'}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Language</dt>
              <dd className={agentConfig.model.language ? '' : 'text-red-500'}>{agentConfig.model.language || 'Missing'}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Temperature</dt>
              <dd className={agentConfig.model.temperature ? '' : 'text-red-500'}>{agentConfig.model.temperature || 'Missing'}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Type</dt>
              <dd className={agentConfig.model.type ? '' : 'text-red-500'}>{agentConfig.model.type || 'Missing'}</dd>
            </div>
          </dl>
        </div>

        <div className="border rounded p-4">
          <h4 className="font-medium mb-2">Voice Configuration</h4> 
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-gray-500">Voice</dt>
              <dd className={agentConfig.voice.name ? '' : 'text-red-500'}>{agentConfig.voice.name || 'No voice selected'}</dd>
              <p className="text-sm text-gray-500">Provider</p>
              <dd className={agentConfig.voice.provider ? '' : 'text-red-500'}>{agentConfig.voice.provider || 'No provider selected'}</dd>
            </div>
          </dl>
        </div>

        <div className="border rounded p-4">
          <h4 className="font-medium mb-2">Knowledge Configuration</h4>
          <div>
            <dt className="text-sm text-gray-500">Files</dt>
            <p className="text-sm text-black font-semibold">{agentConfig.knowledge.files.map((file) => file.name).join(", ")}</p>
            <dd className={agentConfig.knowledge.files.length > 0 ? '' : 'text-red-500'}>{agentConfig.knowledge.files.length} files uploaded</dd>
          </div>
        </div>
      </div>
    </div>
  )
} 