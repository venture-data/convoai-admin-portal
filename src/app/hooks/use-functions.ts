"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api-instance";

export interface FunctionData {
  id?: string;
  name: string;
  description: string;
  base_url: string;
  endpoint_path: string;
  function_name: string;
  function_description: string;
  http_method: string;
  headers: Record<string, string>;
  parameter_schema: {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  };
  request_template: Record<string, unknown>;
  auth_required: boolean;
  response_mapping: Record<string, string>;
  error_mapping: Record<string, string>;
  active: boolean;
  is_public: boolean;
  owner_id?: string;
}

interface FunctionsResponse {
  items: Array<FunctionData>;
}

export function useFunction(function_id: string) {
  return useQuery({
    queryKey: ['functions', function_id],
    queryFn: async () => {
      const response = await api.get(`api/v1/functions/${function_id}`, {
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
      return data;
    },
    enabled: !!function_id,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 3000)
  });
}

export function useFunctions() {
  const queryClient = useQueryClient();
  const { data: functions, isLoading, error } = useQuery({
    queryKey: ['functions'],
    queryFn: async () => {
      const response = await api.get('api/v1/functions', {
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
      return {
        items: Array.isArray(data) ? data : data.items || []
      };
    },
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 1,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 3000)
  });
  const createFunction = useMutation({
    mutationFn: async (functionData: FunctionData) => {
      const response = await api.post('api/v1/functions', {
        body: JSON.stringify(functionData),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('Function creation failed:', responseData);
        throw new Error(responseData.error || responseData.detail || 'Failed to create function');
      }

      return responseData;
    },
    onMutate: async (newFunction: FunctionData) => {
      await queryClient.cancelQueries({ queryKey: ['functions'] });
      
      const previousFunctions = queryClient.getQueryData<FunctionsResponse>(['functions']);

      const tempId = `temp_${Date.now()}`;
      const optimisticFunction = {
        ...newFunction,
        id: tempId,
        function_name: newFunction.function_name || tempId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      queryClient.setQueryData<FunctionsResponse>(['functions'], (old) => {
        if (!old) return { items: [optimisticFunction] };
        return {
          ...old,
          items: [...old.items, optimisticFunction]
        };
      });

      return { previousFunctions };
    },
    onError: (err, newFunction, context) => {
      console.error('Rolling back optimistic update due to error:', err);
      
      if (context?.previousFunctions) {
        queryClient.setQueryData(['functions'], context.previousFunctions);
      } else {
        queryClient.invalidateQueries({ queryKey: ['functions'] });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['functions'] });
    },
    retry: 1,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 3000)
  });

  const updateFunction = useMutation({
    mutationFn: async (updatedFunction: FunctionData & { function_id: string }) => {
      const { function_id, ...data } = updatedFunction;
      const response = await api.put(`api/v1/functions/${function_id}`, {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include'
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update function');
      }

      return { function_id, ...data };
    },
    onMutate: async (updatedFunction: FunctionData & { function_id: string }) => {
      await queryClient.cancelQueries({ queryKey: ['functions'] });
      const previousFunctions = queryClient.getQueryData<FunctionsResponse>(['functions']);

      queryClient.setQueryData<FunctionsResponse>(['functions'], (old) => {
        if (!old) return { items: [] };
        return {
          ...old,
          items: old.items.map(func => 
            func.function_name === updatedFunction.function_name
              ? {
                  ...func,
                  ...updatedFunction,
                  updated_at: new Date().toISOString(),
                }
              : func
          )
        };
      });

      return { previousFunctions };
    },
    onError: (err, updatedFunction, context?: { previousFunctions: FunctionsResponse | undefined }) => {
      if (context?.previousFunctions) {
        queryClient.setQueryData(['functions'], context.previousFunctions);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['functions'] });
    },
    retry: 1,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 3000)
  });

  const deleteFunction = useMutation({
    mutationFn: async (function_id: string) => {
      console.log("function_id", function_id);
      const functionsData = queryClient.getQueryData<FunctionsResponse>(['functions']);
      console.log("functionsData", functionsData);
      let functionItem = functionsData?.items.find(f => f.function_name === function_id);
      if (!functionItem) {
        functionItem = functionsData?.items.find(f => f.id === function_id);
      }
      
      console.log("functionItem", functionItem);
      
      // If we found a function, use its id; otherwise use what was passed
      const actualId = functionItem?.id || function_id;
      console.log("function_id", function_id);
      console.log("actualId", actualId);
      
      const response = await api.delete(`api/v1/functions/${actualId}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete function');
      }
      return function_id;
    },
    onMutate: async (function_id) => {
      await queryClient.cancelQueries({ queryKey: ['functions'] });
      const previousFunctions = queryClient.getQueryData<FunctionsResponse>(['functions']);

      queryClient.setQueryData<FunctionsResponse>(['functions'], (old) => {
        if (!old) return { items: [] };
        return {
          ...old,
          items: old.items.filter((func) => func.function_name !== function_id)
        };
      });

      return { previousFunctions };
    },
    onError: (err, function_id, context?: { previousFunctions: FunctionsResponse | undefined }) => {
      if (context?.previousFunctions) {
        queryClient.setQueryData(['functions'], context.previousFunctions);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['functions'] });
    },
    retry: 1,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 3000)
  });

  return {
    functions,
    isLoading,
    error,
    createFunction,
    updateFunction,
    deleteFunction,
    getFunction: useFunction
  };
} 