"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AgentConfig } from "@/app/dashboard/new_agents/types";
import api from "@/lib/api-instance";

interface UpdateAgentPayload {
  name: string;
  description: string;
  system_prompt: string;
  greeting: string;
  llm_provider: string;
  tts_provider: string;
  stt_provider: "deepgram" | "google" | "openai";
  llm_options: {
    model: string;
    temperature: number;
  };
  tts_options: {
    voice: string;
    speed: number;
  };
  stt_options: {
    model: string;
    model_telephony: string;
  };
  allow_interruptions: boolean;
  interrupt_speech_duration: number;
  interrupt_min_words: number;
  min_endpointing_delay: number;
  max_endpointing_delay: number;
  active: boolean;
  is_default: boolean;
  max_nested_function_calls: number;
}

interface AgentsResponse {
  items: Array<{
    id: number;
    name: string;
    description: string;
  }>;
}

export function useAgent() {
  const queryClient = useQueryClient()
  const createAgent = useMutation({
    mutationFn: async (agentConfig: AgentConfig) => {
      const payload = {
        name: agentConfig.model.agentName,
        description: agentConfig.model.description || null,
        system_prompt: agentConfig.model.systemPrompt,
        greeting: agentConfig.model.firstMessage,
        llm_provider: agentConfig.model.provider || "openai",
        tts_provider: agentConfig.voice?.provider || "openai",
        stt_provider: "deepgram",  
        llm_options: {
          model: agentConfig.model.model || "gpt-4o",
          temperature: agentConfig.model.temperature || 0.7
        },
        tts_options: {
          voice: agentConfig.voice?.name || "alloy",
          speed: 1.0
        },
        allow_interruptions: agentConfig.model.allow_interruptions !== false,
        interrupt_speech_duration: Number(agentConfig.model.interrupt_speech_duration || 0.5),
        interrupt_min_words: Number(agentConfig.model.interrupt_min_words || 0),
        min_endpointing_delay: Number(agentConfig.model.min_endpointing_delay || 0.5),
        max_endpointing_delay: Number(agentConfig.model.max_endpointing_delay || 6.0),
        active: agentConfig.model.active !== false,
        is_default: agentConfig.model.is_default === true,
        max_nested_function_calls: Number(agentConfig.model.max_nested_function_calls || 1)
      };

      if (agentConfig.knowledge?.files && agentConfig.knowledge.files.length > 0) {
        const formData = new FormData();
      
        formData.append('data', JSON.stringify(payload));
      
        agentConfig.knowledge.files.forEach(fileData => {
          if (fileData instanceof File) {
            formData.append('files', fileData);
          } else if (fileData.file instanceof File || fileData.file instanceof Blob) {
            formData.append('files', fileData.file);
          } else {
            throw new Error(`Invalid file object. Expected File or Blob but got ${typeof fileData}`);
          }
        });
        
        const response = await api.post('api/v1/agent-profile', {
          body: formData,
          credentials: 'include'
        });

        const responseData = await response.json();
        
        if (!response.ok) {
          throw new Error(responseData.error || 'Failed to create agent');
        }

        return responseData;
      } else {
        const response = await api.post('api/v1/agent-profile', {
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        const responseData = await response.json();
        
        if (!response.ok) {
          throw new Error(responseData.error || 'Failed to create agent');
        }

        return responseData;
      }
    },
    onMutate: async (newAgent: AgentConfig) => {
      await queryClient.cancelQueries({ queryKey: ['agents'] });
      const previousAgents = queryClient.getQueryData<AgentsResponse>(['agents']);

      // Create an optimistic agent entry
      const optimisticAgent = {
        id: Date.now(), // Temporary ID
        name: newAgent.model.agentName,
        description: newAgent.model.description || "",
        system_prompt: newAgent.model.systemPrompt,
        greeting: newAgent.model.firstMessage,
        voice: newAgent.voice?.name || "alloy",
        llm_model: newAgent.model.model,
        stt_model: newAgent.model.stt_model,
        stt_model_telephony: newAgent.model.stt_model_telephony,
        allow_interruptions: newAgent.model.allow_interruptions,
        interrupt_speech_duration: newAgent.model.interrupt_speech_duration,
        interrupt_min_words: newAgent.model.interrupt_min_words,
        min_endpointing_delay: newAgent.model.min_endpointing_delay,
        max_endpointing_delay: newAgent.model.max_endpointing_delay,
        active: newAgent.model.active,
        is_default: newAgent.model.is_default,
        max_nested_function_calls: newAgent.model.max_nested_function_calls,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      queryClient.setQueryData<AgentsResponse>(['agents'], (old) => {
        if (!old) return { items: [optimisticAgent] };
        return {
          ...old,
          items: [...old.items, optimisticAgent]
        };
      });

      return { previousAgents };
    },
    onError: (err, newAgent, context?: { previousAgents: AgentsResponse | undefined }) => {
      if (context?.previousAgents) {
        queryClient.setQueryData(['agents'], context.previousAgents);
      }
    },
    onSettled: (data) => {
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: ['agents', data.id.toString()] });
      }
      // Still invalidate the list since we added a new item
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    }
  });

  const updateAgent = useMutation({
    mutationFn: async ({ agent_id, ...data }: UpdateAgentPayload & { agent_id: string }) => {
      const response = await api.put(`api/v1/agent-profile?agent_id=${agent_id}`, {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include'
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update agent');
      }

      return { agent_id, ...data };
    },
    onMutate: async (updatedAgent: UpdateAgentPayload & { agent_id: string }) => {
      await queryClient.cancelQueries({ queryKey: ['agents'] });
      const previousAgents = queryClient.getQueryData<AgentsResponse>(['agents']);

      queryClient.setQueryData<AgentsResponse>(['agents'], (old) => {
        if (!old) return { items: [] };
        return {
          ...old,
          items: old.items.map(agent => 
            agent.id.toString() === updatedAgent.agent_id
              ? {
                  ...agent,
                  name: updatedAgent.name,
                  description: updatedAgent.description,
                  system_prompt: updatedAgent.system_prompt,
                  greeting: updatedAgent.greeting,
                  stt_provider: updatedAgent.stt_provider,
                  stt_options: {
                    model: updatedAgent.stt_options.model,
                    model_telephony: updatedAgent.stt_options.model_telephony
                  },
                  tts_provider: updatedAgent.tts_provider,
                  tts_options: updatedAgent.tts_options,
                  llm_provider: updatedAgent.llm_provider,
                  llm_options: updatedAgent.llm_options,
                  allow_interruptions: updatedAgent.allow_interruptions,
                  interrupt_speech_duration: updatedAgent.interrupt_speech_duration,
                  interrupt_min_words: updatedAgent.interrupt_min_words,
                  min_endpointing_delay: updatedAgent.min_endpointing_delay,
                  max_endpointing_delay: updatedAgent.max_endpointing_delay,
                  active: updatedAgent.active,
                  is_default: updatedAgent.is_default,
                  max_nested_function_calls: updatedAgent.max_nested_function_calls,
                  updated_at: new Date().toISOString(),
                }
              : agent
          )
        };
      });

      return { previousAgents };
    },
    onError: (err, updatedAgent, context?: { previousAgents: AgentsResponse | undefined }) => {
      if (context?.previousAgents) {
        queryClient.setQueryData(['agents'], context.previousAgents);
      }
    },
    onSettled: (data) => {
      if (data?.agent_id) {
        queryClient.invalidateQueries({ queryKey: ['agents', data.agent_id] });
      }
    }
  });

  const deleteAgent = useMutation({
    mutationFn: async (agent_id: string) => {
      const response = await api.delete(`api/v1/agent-profile?agent_id=${agent_id}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete agent');
      }
      return agent_id;
    },
    onMutate: async (agent_id) => {
      await queryClient.cancelQueries({ queryKey: ['agents'] });
      const previousAgents = queryClient.getQueryData<AgentsResponse>(['agents']);

      queryClient.setQueryData<AgentsResponse>(['agents'], (old) => {
        if (!old) return { items: [] };
        return {
          ...old,
          items: old.items.filter((agent) => agent.id.toString() !== agent_id)
        };
      });

      return { previousAgents };
    },
    onError: (err, agent_id, context?: { previousAgents: AgentsResponse | undefined }) => {
      if (context?.previousAgents) {
        queryClient.setQueryData(['agents'], context.previousAgents);
      }
    },
    onSettled: (agent_id) => {
      if (agent_id) {
        // For delete, we only need to invalidate the list since the individual agent is gone
        queryClient.invalidateQueries({ queryKey: ['agents'] });
      }
    }
  });

  const { data: agents, isLoading, error } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const response = await api.get('api/v1/agent-profile',{
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch agents');
      }
      const data = await response.json();
      return {
        items: Array.isArray(data) ? data : data.items || []
      };
    },
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  });

  
  

  return {
    createAgent,
    updateAgent,
    agents,
    isLoading,
    error,
    deleteAgent
  };
} 