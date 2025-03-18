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
          <h4 className="font-medium mb-2">Basic Information</h4>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-gray-500">Agent Name</dt>
              <dd className={agentConfig.model.agentName ? '' : 'text-red-500'}>{agentConfig.model.agentName || 'Missing'}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Description</dt>
              <dd>{agentConfig.model.description || 'None'}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Greeting</dt>
              <dd className={agentConfig.model.firstMessage ? '' : 'text-red-500'}>{agentConfig.model.firstMessage || 'Missing'}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">System Prompt</dt>
              <dd className={agentConfig.model.systemPrompt ? '' : 'text-red-500'}>{agentConfig.model.systemPrompt || 'Missing'}</dd>
            </div>
          </dl>
        </div>

        <div className="border rounded p-4">
          <h4 className="font-medium mb-2">Model Configuration</h4>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-gray-500">Provider</dt>
              <dd className={agentConfig.model.provider ? '' : 'text-red-500'}>{agentConfig.model.provider || 'Missing'}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">LLM Model</dt>
              <dd className={agentConfig.model.model ? '' : 'text-red-500'}>{agentConfig.model.model || 'Missing'}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">STT Model</dt>
              <dd>{agentConfig.model.stt_model || 'nova-3-general'}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">STT Model Telephony</dt>
              <dd>{agentConfig.model.stt_model_telephony || 'nova-2-phonecall'}</dd>
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
              <dd className={agentConfig.voice?.name ? '' : 'text-red-500'}>{agentConfig.voice?.name || 'No voice selected'}</dd>
              <p className="text-sm text-gray-500">Provider</p>
              <dd className={agentConfig.voice?.provider ? '' : 'text-red-500'}>{agentConfig.voice?.provider || 'No provider selected'}</dd>
            </div>
          </dl>
        </div>

        <div className="border rounded p-4">
          <h4 className="font-medium mb-2">Interaction Settings</h4>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-gray-500">Allow Interruptions</dt>
              <dd>{agentConfig.model.allow_interruptions !== false ? 'Yes' : 'No'}</dd>
            </div>
            {agentConfig.model.allow_interruptions !== false && (
              <>
                <div>
                  <dt className="text-sm text-gray-500">Interrupt Speech Duration</dt>
                  <dd>{agentConfig.model.interrupt_speech_duration || 0.5} seconds</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Interrupt Minimum Words</dt>
                  <dd>{agentConfig.model.interrupt_min_words || 0} words</dd>
                </div>
              </>
            )}
            <div>
              <dt className="text-sm text-gray-500">Minimum Endpointing Delay</dt>
              <dd>{agentConfig.model.min_endpointing_delay || 0.5} seconds</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Maximum Endpointing Delay</dt>
              <dd>{agentConfig.model.max_endpointing_delay || 6} seconds</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Maximum Nested Function Calls</dt>
              <dd>{agentConfig.model.max_nested_function_calls || 1}</dd>
            </div>
          </dl>
        </div>

        <div className="border rounded p-4">
          <h4 className="font-medium mb-2">Status</h4>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-gray-500">Active</dt>
              <dd>{agentConfig.model.active !== false ? 'Yes' : 'No'}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Default Agent</dt>
              <dd>{agentConfig.model.is_default === true ? 'Yes' : 'No'}</dd>
            </div>
          </dl>
        </div>

        <div className="border rounded p-4">
          <h4 className="font-medium mb-2">Knowledge Configuration</h4>
          <div>
            <dt className="text-sm text-gray-500">Files</dt>
            <p className="text-sm text-black font-semibold">{agentConfig.knowledge?.files?.map((file) => file.name).join(", ") || ''}</p>
            <dd className={agentConfig.knowledge?.files?.length ? '' : 'text-red-500'}>{agentConfig.knowledge?.files?.length || 0} files uploaded</dd>
          </div>
        </div>
      </div>
    </div>
  )
} 