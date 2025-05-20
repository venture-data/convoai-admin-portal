"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FunctionData } from "./use-functions";
import api from "@/lib/api-instance";

export interface AgentFunctionsResponse {
  items: FunctionData[];
  total: number;
}

interface MutationContext {
  previousFunctions?: AgentFunctionsResponse;
}

export function useAgentFunctions(agent_id: string) {
  const queryClient = useQueryClient();

  const getAgentFunctions = useQuery({
    queryKey: ['agent-functions', agent_id],
    queryFn: async () => {
      if (!agent_id) return { items: [], total: 0 };
      
      const response = await api.get(`api/v1/agents/${agent_id}/functions`, {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - session expired, please login again');
        }
        throw new Error('Something went wrong, please try again or refresh the page');
      }
      
      const data = await response.json();
      return data as AgentFunctionsResponse;
    },
    enabled: !!agent_id,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 3000)
  });

  const updateAgentFunctions = useMutation({
    mutationFn: async (functionIds: string[]) => {
      if (!agent_id) {
        throw new Error('Agent ID is required');
      }

      const payload = { function_ids: functionIds };
      const response = await api.post(`api/v1/agents/${agent_id}/functions`, {
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update agent functions');
      }

      return await response.json();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['agent-functions', agent_id] });
      
      const previousFunctions = queryClient.getQueryData<AgentFunctionsResponse>(['agent-functions', agent_id]);

      return { previousFunctions };
    },
    onError: (err, newFunctionIds, context: MutationContext) => {
      if (context?.previousFunctions) {
        queryClient.setQueryData(['agent-functions', agent_id], context.previousFunctions);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-functions', agent_id] });
    },
    retry: 1,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 3000)
  });

  return {
    agentFunctions: getAgentFunctions.data,
    isLoading: getAgentFunctions.isLoading,
    isError: getAgentFunctions.isError,
    error: getAgentFunctions.error,
    updateAgentFunctions
  };
} 