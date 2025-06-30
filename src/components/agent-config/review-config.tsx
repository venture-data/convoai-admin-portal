"use client"

import { AgentConfig } from "@/app/dashboard/new_agents/types"
import { CheckCircle2, AlertCircle, ClipboardCheck, BotIcon, Brain, Volume2, Settings2 } from "lucide-react";
import { useKnowledgeBase } from "@/app/hooks/use-knowledge-base";

interface ReviewConfigProps {
  agentConfig: AgentConfig
}

function KnowledgeBaseReviewSection({ agentConfig }: { agentConfig: AgentConfig }) {
  const { knowledgeBases } = useKnowledgeBase();
  
  const getStatusIcon = (value: string | boolean | number | undefined | null, required: boolean = false) => {
    if (!required) return null;
    
    return value ? (
      <CheckCircle2 className="h-4 w-4 text-green-500 ml-1" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-500 ml-1" />
    );
  };

  const selectedKnowledgeBases = knowledgeBases?.items?.filter(kb => 
    agentConfig.knowledge?.knowledgeBaseIds?.includes(kb.id)
  ) || [];

  return (
    <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 to-[#1A1D25]/60 border border-white/10">
      <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
        <Brain className="h-4 w-4" />
        Knowledge Base
      </h4>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <dt className="text-sm text-white/90 flex items-center">
            Knowledge Bases {getStatusIcon(selectedKnowledgeBases.length, false)}
          </dt>
          <dd className={`text-sm font-medium px-2 py-0.5 rounded-full ${
            selectedKnowledgeBases.length 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-gray-500/20 text-gray-400'
          }`}>
            {selectedKnowledgeBases.length} selected
          </dd>
        </div>
        
        {selectedKnowledgeBases.length > 0 ? (
          <div className="mt-3 p-3 bg-[#1A1D25]/50 rounded border border-white/5">
            <h5 className="text-xs font-medium text-white/70 mb-2 flex items-center gap-2">
              <Brain className="h-3 w-3" />
              Selected Knowledge Bases
            </h5>
            <ul className="space-y-2 max-h-32 overflow-y-auto pr-2">
              {selectedKnowledgeBases.map((kb) => (
                <li key={kb.id} className="text-xs text-white/60 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  </span>
                  <div>
                    <div className="font-medium text-white/80">{kb.name}</div>
                    {kb.description && (
                      <div className="text-white/50">{kb.description}</div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-3 p-3 bg-[#1A1D25]/50 rounded border border-white/5 text-center">
            <p className="text-xs text-white/60">No knowledge bases selected</p>
            <p className="text-xs text-white/40">Agent will not have access to any documents</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function ReviewConfig({ agentConfig }: ReviewConfigProps) {
  const getStatusIcon = (value: string | boolean | number | undefined | null, required: boolean = false) => {
    if (!required) return null;
    
    return value ? (
      <CheckCircle2 className="h-4 w-4 text-green-500 ml-1" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-500 ml-1" />
    );
  };
  
  return (
    <div className="space-y-8 text-white/90">
      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <ClipboardCheck className="h-5 w-5 text-orange-400" />
        <h3 className="text-xl font-bold text-white">Review Configuration</h3>
      </div>
      
      <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 to-[#1A1D25]/60 border border-white/10">
        <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
          <BotIcon className="h-4 w-4" />
          Basic Information
        </h4>
        
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <dt className="text-xs text-white/60 flex items-center">
              Agent Name {getStatusIcon(agentConfig.model.agentName, true)}
            </dt>
            <dd className={`text-sm font-medium ${agentConfig.model.agentName ? 'text-white' : 'text-red-500'}`}>
              {agentConfig.model.agentName || 'Missing (Required)'}
            </dd>
          </div>
          
          <div className="space-y-1">
            <dt className="text-xs text-white/60">Description</dt>
            <dd className="text-sm text-white/90">{agentConfig.model.description || 'None provided'}</dd>
          </div>
          
          <div className="space-y-1">
            <dt className="text-xs text-white/60 flex items-center">
              Greeting {getStatusIcon(agentConfig.model.firstMessage, true)}
            </dt>
            <dd className={`text-sm font-medium ${agentConfig.model.firstMessage ? 'text-white' : 'text-red-500'}`}>
              {agentConfig.model.firstMessage || 'Missing (Required)'}
            </dd>
          </div>
          
          <div className="space-y-1">
            <dt className="text-xs text-white/60 flex items-center">
              System Prompt {getStatusIcon(agentConfig.model.systemPrompt, true)}
            </dt>
            <dd className={`text-sm font-medium ${agentConfig.model.systemPrompt ? 'text-white' : 'text-red-500'}`}>
              {agentConfig.model.systemPrompt 
                ? (agentConfig.model.systemPrompt.length > 60 
                  ? `${agentConfig.model.systemPrompt.substring(0, 60)}...` 
                  : agentConfig.model.systemPrompt)
                : 'Missing (Required)'}
            </dd>
          </div>
        </dl>
      </div>

      <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 via-[#1A1D25]/60 to-orange-950/10 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.05)]">
        <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
          <Brain className="h-4 w-4" />
          Model Configuration
        </h4>
        
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <dt className="text-xs text-white/60 flex items-center">
              Provider {getStatusIcon(agentConfig.model.provider, true)}
            </dt>
            <dd className={`text-sm font-medium ${agentConfig.model.provider ? 'text-white' : 'text-red-500'}`}>
              {agentConfig.model.provider 
                ? <span className="capitalize">{agentConfig.model.provider}</span> 
                : 'Missing (Required)'}
            </dd>
          </div>
          
          <div className="space-y-1">
            <dt className="text-xs text-white/60 flex items-center">
              LLM Model {getStatusIcon(agentConfig.model.model, true)}
            </dt>
            <dd className={`text-sm font-medium ${agentConfig.model.model ? 'text-white' : 'text-red-500'}`}>
              {agentConfig.model.model || 'Missing (Required)'}
            </dd>
          </div>
          
          <div className="space-y-1">
            <dt className="text-xs text-white/60">STT Model</dt>
            <dd className="text-sm text-white/90">
              {agentConfig.model.stt_model || agentConfig.model?.stt_options?.model || 'nova-3-general'}
            </dd>
          </div>
          
          <div className="space-y-1">
            <dt className="text-xs text-white/60">STT Model Telephony</dt>
            <dd className="text-sm text-white/90">
              {agentConfig.model.stt_model_telephony || agentConfig.model?.stt_options?.model_telephony || 'nova-2-phonecall'}
            </dd>
          </div>
          
          <div className="space-y-1">
            <dt className="text-xs text-white/60 flex items-center">
              Language {getStatusIcon(agentConfig.model.language, true)}
            </dt>
            <dd className={`text-sm font-medium ${agentConfig.model.language ? 'text-white' : 'text-red-500'}`}>
              {agentConfig.model.language || 'Missing (Required)'}
            </dd>
          </div>
          
          <div className="space-y-1">
            <dt className="text-xs text-white/60 flex items-center">
              Temperature {getStatusIcon(agentConfig.model.temperature, false)}
            </dt>
            <dd className="text-sm font-medium text-white">
              {agentConfig.model.temperature !== undefined ? agentConfig.model.temperature : '0.7 (Default)'}
            </dd>
          </div>
          
          <div className="space-y-1">
            <dt className="text-xs text-white/60 flex items-center">
              Type {getStatusIcon(agentConfig.model.type, true)}
            </dt>
            <dd className={`text-sm font-medium ${agentConfig.model.type ? 'text-white' : 'text-red-500'}`}>
              {agentConfig.model.type 
                ? <span className="capitalize">{agentConfig.model.type}</span> 
                : 'Missing (Required)'}
            </dd>
          </div>
        </dl>
      </div>

      <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 to-[#1A1D25]/60 border border-white/10">
        <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
          <Volume2 className="h-4 w-4" />
          Voice Configuration
        </h4>
        
        <dl className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <dt className="text-xs text-white/60 flex items-center">
                Voice {getStatusIcon(agentConfig.voice?.name, true)}
              </dt>
              <dd className={`text-sm font-medium ${agentConfig.voice?.name ? 'text-white' : 'text-red-500'}`}>
                {agentConfig.voice?.name 
                  ? <span className="capitalize">{agentConfig.voice.name}</span> 
                  : 'No voice selected (Required)'}
              </dd>
            </div>
            
            <div className="space-y-1">
              <dt className="text-xs text-white/60 flex items-center">
                Provider {getStatusIcon(agentConfig.voice?.provider, true)}
              </dt>
              <dd className={`text-sm font-medium ${agentConfig.voice?.provider ? 'text-white' : 'text-red-500'}`}>
                {agentConfig.voice?.provider 
                  ? <span className="capitalize">{agentConfig.voice.provider}</span> 
                  : 'No provider selected (Required)'}
              </dd>
            </div>
          </div>
          
          {agentConfig.voice?.tts_options && (
            <div className="mt-2 p-3 bg-[#1A1D25]/50 rounded border border-white/5">
              <h5 className="text-xs font-medium text-white/70 mb-2">TTS Options</h5>
              <div className="grid grid-cols-2 gap-3">
                {agentConfig.voice.tts_options.voice && (
                  <div>
                    <dt className="text-xs text-white/50">Voice ID</dt>
                    <dd className="text-xs text-white/80">{agentConfig.voice.tts_options.voice}</dd>
                  </div>
                )}
                {agentConfig.voice.tts_options.speed && (
                  <div>
                    <dt className="text-xs text-white/50">Speed</dt>
                    <dd className="text-xs text-white/80">{agentConfig.voice.tts_options.speed}x</dd>
                  </div>
                )}
              </div>
            </div>
          )}
        </dl>
      </div>

      <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 to-[#1A1D25]/60 border border-white/10">
        <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
          <Settings2 className="h-4 w-4" />
          Interaction Settings
        </h4>
        
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <dt className="text-xs text-white/60">Allow Interruptions</dt>
            <dd className="text-sm font-medium text-white flex items-center">
              {agentConfig.model.allow_interruptions !== false ? (
                <>Yes <CheckCircle2 className="h-3 w-3 text-green-500 ml-1.5" /></>
              ) : (
                'No'
              )}
            </dd>
          </div>
          
          {agentConfig.model.allow_interruptions !== false && (
            <>
              <div className="space-y-1">
                <dt className="text-xs text-white/60">Interrupt Speech Duration</dt>
                <dd className="text-sm text-white/90">{agentConfig.model.interrupt_speech_duration || 0.5} seconds</dd>
              </div>
              
              <div className="space-y-1">
                <dt className="text-xs text-white/60">Interrupt Minimum Words</dt>
                <dd className="text-sm text-white/90">{agentConfig.model.interrupt_min_words || 0} words</dd>
              </div>
            </>
          )}
          
          <div className="space-y-1">
            <dt className="text-xs text-white/60">Minimum Endpointing Delay</dt>
            <dd className="text-sm text-white/90">{agentConfig.model.min_endpointing_delay || 0.5} seconds</dd>
          </div>
          
          <div className="space-y-1">
            <dt className="text-xs text-white/60">Maximum Endpointing Delay</dt>
            <dd className="text-sm text-white/90">{agentConfig.model.max_endpointing_delay || 6} seconds</dd>
          </div>
          
          <div className="space-y-1">
            <dt className="text-xs text-white/60">Maximum Nested Function Calls</dt>
            <dd className="text-sm text-white/90">{agentConfig.model.max_nested_function_calls || 1}</dd>
          </div>
        </dl>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-orange-400 flex items-center gap-2">
          <BotIcon className="h-4 w-4" />
          Status Settings
        </h4>
        
        <dl className="grid grid-cols-2 gap-5 mt-2">
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <dt className="text-sm text-white/90">Active</dt>
            <dd className="flex items-center text-sm">
              {agentConfig.model.active !== false ? (
                <span className="flex items-center text-green-500">
                  Yes <CheckCircle2 className="h-4 w-4 ml-1" />
                </span>
              ) : (
                <span className="text-white/60">No</span>
              )}
            </dd>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <dt className="text-sm text-white/90">Default Agent</dt>
            <dd className="flex items-center text-sm">
              {agentConfig.model.is_default === true ? (
                <span className="flex items-center text-green-500">
                  Yes <CheckCircle2 className="h-4 w-4 ml-1" />
                </span>
              ) : (
                <span className="text-white/60">No</span>
              )}
            </dd>
          </div>
        </dl>
      </div>

      <KnowledgeBaseReviewSection agentConfig={agentConfig} />
    </div>
  )
} 