"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AgentConfig } from "@/app/dashboard/new_agents/types";
import { useAuthStore } from "./useAuth";

export function useAgent() {
  const queryClient = useQueryClient()
  const token = useAuthStore.getState().token;
  const createAgent = useMutation({
    mutationFn: async (agentConfig: AgentConfig) => {
      const formData = new FormData()
      formData.append('name', agentConfig.model.agentName);
      formData.append('provider', agentConfig.model.provider);
      formData.append('type', agentConfig.model.type);
      formData.append('language', agentConfig.model.language);
      formData.append('llm_model', agentConfig.model.model);
      formData.append('temperature', agentConfig.model.temperature.toString());
      formData.append('first_message', agentConfig.model.firstMessage);
      formData.append('system_prompt', agentConfig.model.systemPrompt);
      formData.append('voice_details', JSON.stringify(agentConfig.voice));

      if (agentConfig.knowledge.files) {
        agentConfig.knowledge.files.forEach(fileData => {
          if (fileData instanceof File) {
            formData.append('files', fileData);
          } else if (fileData.file instanceof File || fileData.file instanceof Blob) {
            formData.append('files', fileData.file);
          } else {
            throw new Error(`Invalid file object. Expected File or Blob but got ${typeof fileData}`);
          }
        });
      }

      const response = await fetch('/api/agents', {
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
    },
  });

  const updateAgent = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/agents', {
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
      const response = await fetch('/api/agents', {
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