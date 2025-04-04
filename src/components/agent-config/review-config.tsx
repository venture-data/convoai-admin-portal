"use client"

import { AgentConfig } from "@/app/dashboard/new_agents/types"

interface ReviewConfigProps {
  agentConfig: AgentConfig
}

export function ReviewConfig({ agentConfig }: ReviewConfigProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-white">Review Configuration</h3>
      
      <div className="space-y-4">
        <div className="border border-white/10 rounded-lg bg-[#1A1D25]/70 p-4">
          <h4 className="font-medium mb-2 text-white/90">Basic Information</h4>
          <dl className="space-y-2">
            <div>
              <dt className="text-xs text-white/60">Agent Name</dt>
              <dd className={`text-[13px] ${agentConfig.model.agentName ? 'text-white' : 'text-red-500'}`}>
                {agentConfig.model.agentName || 'Missing'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-white/60">Description</dt>
              <dd className="text-[13px] text-white">{agentConfig.model.description || 'None'}</dd>
            </div>
            <div>
              <dt className="text-xs text-white/60">Greeting</dt>
              <dd className={`text-[13px] ${agentConfig.model.firstMessage ? 'text-white' : 'text-red-500'}`}>
                {agentConfig.model.firstMessage || 'Missing'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-white/60">System Prompt</dt>
              <dd className={`text-[13px] ${agentConfig.model.systemPrompt ? 'text-white' : 'text-red-500'}`}>
                {agentConfig.model.systemPrompt || 'Missing'}
              </dd>
            </div>
          </dl>
        </div>

        <div className="border border-white/10 rounded-lg bg-[#1A1D25]/70 p-4">
          <h4 className="font-medium mb-2 text-white/90">Model Configuration</h4>
          <dl className="space-y-2">
            <div>
              <dt className="text-xs text-white/60">Provider</dt>
              <dd className={`text-[13px] ${agentConfig.model.provider ? 'text-white' : 'text-red-500'}`}>
                {agentConfig.model.provider || 'Missing'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-white/60">LLM Model</dt>
              <dd className={`text-[13px] ${agentConfig.model.model ? 'text-white' : 'text-red-500'}`}>
                {agentConfig.model.model || 'Missing'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-white/60">STT Model</dt>
              <dd className="text-[13px] text-white">{agentConfig.model.stt_model || 'nova-3-general'}</dd>
            </div>
            <div>
              <dt className="text-xs text-white/60">STT Model Telephony</dt>
              <dd className="text-[13px] text-white">{agentConfig.model.stt_model_telephony || 'nova-2-phonecall'}</dd>
            </div>
            <div>
              <dt className="text-xs text-white/60">Language</dt>
              <dd className={`text-[13px] ${agentConfig.model.language ? 'text-white' : 'text-red-500'}`}>
                {agentConfig.model.language || 'Missing'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-white/60">Temperature</dt>
              <dd className={`text-[13px] ${agentConfig.model.temperature ? 'text-white' : 'text-red-500'}`}>
                {agentConfig.model.temperature || 'Missing'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-white/60">Type</dt>
              <dd className={`text-[13px] ${agentConfig.model.type ? 'text-white' : 'text-red-500'}`}>
                {agentConfig.model.type || 'Missing'}
              </dd>
            </div>
          </dl>
        </div>

        <div className="border border-white/10 rounded-lg bg-[#1A1D25]/70 p-4">
          <h4 className="font-medium mb-2 text-white/90">Voice Configuration</h4> 
          <dl className="space-y-2">
            <div>
              <dt className="text-xs text-white/60">Voice</dt>
              <dd className={`text-[13px] ${agentConfig.voice?.name ? 'text-white' : 'text-red-500'}`}>
                {agentConfig.voice?.name || 'No voice selected'}
              </dd>
              <dt className="text-xs text-white/60 mt-2">Provider</dt>
              <dd className={`text-[13px] ${agentConfig.voice?.provider ? 'text-white' : 'text-red-500'}`}>
                {agentConfig.voice?.provider || 'No provider selected'}
              </dd>
            </div>
          </dl>
        </div>

        <div className="border border-white/10 rounded-lg bg-[#1A1D25]/70 p-4">
          <h4 className="font-medium mb-2 text-white/90">Interaction Settings</h4>
          <dl className="space-y-2">
            <div>
              <dt className="text-xs text-white/60">Allow Interruptions</dt>
              <dd className="text-[13px] text-white">{agentConfig.model.allow_interruptions !== false ? 'Yes' : 'No'}</dd>
            </div>
            {agentConfig.model.allow_interruptions !== false && (
              <>
                <div>
                  <dt className="text-xs text-white/60">Interrupt Speech Duration</dt>
                  <dd className="text-[13px] text-white">{agentConfig.model.interrupt_speech_duration || 0.5} seconds</dd>
                </div>
                <div>
                  <dt className="text-xs text-white/60">Interrupt Minimum Words</dt>
                  <dd className="text-[13px] text-white">{agentConfig.model.interrupt_min_words || 0} words</dd>
                </div>
              </>
            )}
            <div>
              <dt className="text-xs text-white/60">Minimum Endpointing Delay</dt>
              <dd className="text-[13px] text-white">{agentConfig.model.min_endpointing_delay || 0.5} seconds</dd>
            </div>
            <div>
              <dt className="text-xs text-white/60">Maximum Endpointing Delay</dt>
              <dd className="text-[13px] text-white">{agentConfig.model.max_endpointing_delay || 6} seconds</dd>
            </div>
            <div>
              <dt className="text-xs text-white/60">Maximum Nested Function Calls</dt>
              <dd className="text-[13px] text-white">{agentConfig.model.max_nested_function_calls || 1}</dd>
            </div>
          </dl>
        </div>

        <div className="border border-white/10 rounded-lg bg-[#1A1D25]/70 p-4">
          <h4 className="font-medium mb-2 text-white/90">Status</h4>
          <dl className="space-y-2">
            <div>
              <dt className="text-xs text-white/60">Active</dt>
              <dd className="text-[13px] text-white">{agentConfig.model.active !== false ? 'Yes' : 'No'}</dd>
            </div>
            <div>
              <dt className="text-xs text-white/60">Default Agent</dt>
              <dd className="text-[13px] text-white">{agentConfig.model.is_default === true ? 'Yes' : 'No'}</dd>
            </div>
          </dl>
        </div>

        <div className="border border-white/10 rounded-lg bg-[#1A1D25]/70 p-4">
          <h4 className="font-medium mb-2 text-white/90">Knowledge Configuration</h4>
          <div>
            <dt className="text-xs text-white/60">Files</dt>
            <p className="text-[13px] text-white font-medium">{agentConfig.knowledge?.files?.map((file) => file.name).join(", ") || ''}</p>
            <dd className={`text-[13px] ${agentConfig.knowledge?.files?.length ? 'text-white' : 'text-red-500'}`}>
              {agentConfig.knowledge?.files?.length || 0} files uploaded
            </dd>
          </div>
        </div>
      </div>
    </div>
  )
} 