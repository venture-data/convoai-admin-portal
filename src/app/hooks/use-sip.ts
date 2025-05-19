import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from '@/lib/api-instance';
import { toast } from "./use-toast";
import { parseErrorMessage } from "@/lib/utils";

interface PhoneNumberFormData {
  id: string;
  agent_id: string;
}

interface CreateSipTrunkData {
  name: string;
  phone_number: string;
  sip_termination_uri: string;
  username?: string;
  password?: string;
}

interface ApiResponse {
  error?: string;
  detail?: string;
}

export function useSip() {
  const queryClient = useQueryClient();

  const { data: sipTrunks, isLoading, error } = useQuery({
    queryKey: ['sip-trunks'],
    queryFn: async () => {
      const response = await api.get('/api/sip-trunk', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch SIP trunks');
      }
      
      return response.json();
    }
  });

  const { data: agentMappings, isPending: isLoadingMapping } = useQuery({
    queryKey: ['sip-agent-mappings'],
    queryFn: async () => {
      const response = await api.get('/api/sip-agent-mapping', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch agent mappings');
      }
      
      return response.json();
    }
  });

  const createSipTrunk = useMutation<ApiResponse, Error, CreateSipTrunkData>({
    mutationFn: async (data) => {
      const response = await api.post('/api/sip-trunk', {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      const responseData = await response.json();

      if (!response.ok || responseData.error) {
        throw new Error(responseData.error || JSON.stringify(responseData));
      }
      return responseData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sip-trunks'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: parseErrorMessage(error.message),
        variant: "destructive",
      });
    }
  });

  const updateSipTrunk = useMutation<ApiResponse, Error, PhoneNumberFormData>({
    mutationFn: async (data) => {
      const response = await api.put(`/api/sip-trunk`, {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(JSON.stringify(responseData));
      }
      return responseData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sip-agent-mappings'] });
    }
  });

  const deleteSipTrunk = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/api/sip-trunk`, {
        body: JSON.stringify({ id }),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete SIP trunk');
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sip-trunks'] });
    }
  });

  return {
    sipTrunks,
    isLoading,
    error,
    createSipTrunk: createSipTrunk.mutate,
    isCreating: createSipTrunk.isPending,
    createError: createSipTrunk.error,
    updateSipTrunk: updateSipTrunk.mutate,
    isUpdating: updateSipTrunk.isPending,
    updateError: updateSipTrunk.error,
    deleteSipTrunk: deleteSipTrunk.mutate,
    isDeleting: deleteSipTrunk.isPending,
    deleteError: deleteSipTrunk.error,
    agentMappings,
    isLoadingMapping
  };
}
