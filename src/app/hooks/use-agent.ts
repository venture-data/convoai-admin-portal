"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AgentConfig } from "@/app/dashboard/new_agents/types";
import { useAuthStore } from "./useAuth";

export function useAgent() {
  const queryClient = useQueryClient()
  const token = useAuthStore.getState().token;
  const createAgent = useMutation({
    mutationFn: async (agentConfig: AgentConfig) => {
      // Create a payload object with the correct field names
      const payload = {
        name: agentConfig.model.agentName || '',
        description: agentConfig.model.description || '',
        system_prompt: agentConfig.model.systemPrompt || '',
        greeting: agentConfig.model.firstMessage || '',
        voice: agentConfig.voice?.name || 'alloy',
        llm_model: agentConfig.model.model || 'gpt-4o',
        stt_model: agentConfig.model.stt_model || 'nova-3-general',
        stt_model_telephony: agentConfig.model.stt_model_telephony || 'nova-2-phonecall',
        allow_interruptions: agentConfig.model.allow_interruptions !== false,
        interrupt_speech_duration: Number(agentConfig.model.interrupt_speech_duration || 0.5),
        interrupt_min_words: Number(agentConfig.model.interrupt_min_words || 0),
        min_endpointing_delay: Number(agentConfig.model.min_endpointing_delay || 0.5),
        max_endpointing_delay: Number(agentConfig.model.max_endpointing_delay || 6),
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
        
        const response = await fetch('/api/v1/agent-profile', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        const responseData = await response.json();
        
        if (!response.ok) {
          throw new Error(responseData.error || 'Failed to create agent');
        }

        return responseData;
      } else {
        const response = await fetch('/api/v1/agent-profile', {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        const responseData = await response.json();
        
        if (!response.ok) {
          throw new Error(responseData.error || 'Failed to create agent');
        }

        return responseData;
      }
    },
  });

  const updateAgent = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/v1/agent-profile', {
        method: 'PUT',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update agent');
      }

      return responseData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
  });

  const { data: agents = [] as AgentConfig[], isLoading, error } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const response = await fetch('/api/v1/agent-profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch agents');
      }
      return response.json();
    },
  });
  

  return {
    createAgent,
    updateAgent,
    agents,
    isLoading,
    error
  };
} 