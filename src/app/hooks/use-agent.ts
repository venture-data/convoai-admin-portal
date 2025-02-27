"use client"

import { useMutation } from "@tanstack/react-query";
import { AgentConfig } from "@/app/dashboard/new_agents/types";
import { useSession } from "next-auth/react";

export function useAgent() {
  const session = useSession()
  console.log(session)
  const createAgent = useMutation({
    mutationFn: async (agentConfig: AgentConfig) => {
      const formData = new FormData()
      

      console.log('Sending agent config:', {
        name: agentConfig.model.agentName,
        provider: agentConfig.model.provider,
        type: agentConfig.model.type,
        language: agentConfig.model.language,
        llm_model: agentConfig.model.model,
        files: agentConfig.knowledge.files?.length
      });

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
          'Authorization': `Bearer ${session.data?.token}`,
        }
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to create agent');
      }

      return responseData;
    },
  });

  return {
    createAgent,
  };
} 