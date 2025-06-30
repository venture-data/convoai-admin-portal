"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api-instance';

export interface AgentKnowledgeMapping {
  id: string;
  agent_profile_id: string;
  knowledge_base_id: string;
}

export interface AssociateKnowledgeBaseData {
  agent_profile_id: string;
  knowledge_base_id: string;
}

export function useAgentKnowledge(agentId: string | null) {
  const queryClient = useQueryClient();

  // Get knowledge bases for an agent
  const { data: agentKnowledgeBases, isLoading, error } = useQuery({
    queryKey: ['agent-knowledge', agentId],
    queryFn: async (): Promise<AgentKnowledgeMapping[]> => {
      if (!agentId) return [];
      
      if (!api.isTokenAvailable()) {
        throw new Error("Cannot fetch agent knowledge bases because token is not in local storage. Please refresh the page or log in again.");
      }

      const response = await api.get(`api/v1/agent-knowledge/${agentId}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch agent knowledge bases');
      }

      return response.json();
    },
    enabled: !!agentId
  });

  // Associate knowledge base with agent
  const associateKnowledgeBase = useMutation({
    mutationFn: async (data: AssociateKnowledgeBaseData): Promise<AgentKnowledgeMapping> => {
      if (!api.isTokenAvailable()) {
        throw new Error("Knowledge base not associated because token is not in local storage. Please refresh the page or log in again.");
      }

      const response = await api.post('api/v1/agent-knowledge', {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to associate knowledge base');
      }

      return responseData;
    },
    onSuccess: () => {
      // Invalidate and refetch agent knowledge bases
      queryClient.invalidateQueries({ queryKey: ['agent-knowledge', agentId] });
    }
  });

  // Dissociate knowledge base from agent
  const dissociateKnowledgeBase = useMutation({
    mutationFn: async (associationId: string): Promise<void> => {
      if (!api.isTokenAvailable()) {
        throw new Error("Knowledge base not dissociated because token is not in local storage. Please refresh the page or log in again.");
      }

      const response = await api.delete(`api/v1/agent-knowledge?id=${associationId}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to dissociate knowledge base');
      }
    },
    onSuccess: () => {
      // Invalidate and refetch agent knowledge bases
      queryClient.invalidateQueries({ queryKey: ['agent-knowledge', agentId] });
    }
  });

  return {
    agentKnowledgeBases: agentKnowledgeBases || [],
    isLoading,
    error,
    associateKnowledgeBase,
    dissociateKnowledgeBase,
    isAssociating: associateKnowledgeBase.isPending,
    isDissociating: dissociateKnowledgeBase.isPending
  };
} 