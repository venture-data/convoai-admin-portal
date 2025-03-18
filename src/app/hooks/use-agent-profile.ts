"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AgentProfile, AgentProfileResponse } from "@/app/types/agent-profile";
import { useAuthStore } from "./useAuth";

export function useAgentProfile() {
  const queryClient = useQueryClient();
  const token = useAuthStore.getState().token;

  const createAgentProfile = useMutation({
    mutationFn: async (profileData: AgentProfile) => {
      const response = await fetch('/api/v1/agent-profile', {
        method: 'POST',
        body: JSON.stringify(profileData),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to create agent profile');
      }

      return responseData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-profile'] });
    },
  });

  const updateAgentProfile = useMutation({
    mutationFn: async (profileData: AgentProfile) => {
      const response = await fetch('/api/v1/agent-profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update agent profile');
      }

      return responseData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-profile'] });
    },
  });

  const deleteAgentProfile = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/v1/agent-profile?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to delete agent profile');
      }

      return responseData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-profile'] });
    },
  });

  const { data: agentProfiles = [], isLoading, error } = useQuery<AgentProfileResponse[]>({
    queryKey: ['agent-profile'],
    queryFn: async () => {
      const response = await fetch('/api/v1/agent-profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch agent profiles');
      }
      return response.json();
    },
  });

  return {
    createAgentProfile,
    updateAgentProfile,
    deleteAgentProfile,
    agentProfiles,
    isLoading,
    error
  };
} 