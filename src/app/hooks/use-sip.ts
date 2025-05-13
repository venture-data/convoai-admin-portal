import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from '@/lib/api-instance';
import { toast } from "./use-toast";

interface PhoneNumberFormData {
  id: string;
  agent_id: string;
}

interface CreateSipTrunkData {
  name: string;
  trunk_type: 'inbound' | 'outbound';
  phone_number: string;
  sip_termination_uri: string;
  username?: string;
  password?: string;
}

interface ApiResponse {
  error?: string;
  detail?: string;
}

function parseErrorMessage(error: string): string {
  try {
    if (error.includes('message:')) {
      const messageJson = error.split('message: ')[1];
      const parsedError = JSON.parse(messageJson);
      
      if (parsedError.detail) {
        const phoneNumberMatch = parsedError.detail.match(/\["([^"]+)"\]/);
        const phoneNumber = phoneNumberMatch ? phoneNumberMatch[1] : '';
        if (parsedError.detail.includes('Conflicting inbound SIP Trunks')) {
          return `Phone number "${phoneNumber}" is already in use by another trunk. Please use a different number.`;
        }
        const cleanMessage = parsedError.detail
          .replace(/\([^)]*\)/g, '')
          .replace(/Failed to create complete SIP setup: /i, '')
          .replace(/Failed to create inbound SIP trunk: /i, '')
          .replace(/invalid_argument,/i, '')
          .replace(/without AllowedNumbers set/i, '')
          .trim();
          
        return cleanMessage;
      }
    }
    return 'Failed to create SIP trunk. Please try again.';
  } catch (e) {
    console.error('Error parsing error message:', e);
    return 'An unexpected error occurred. Please try again.';
  }
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
      queryClient.invalidateQueries({ queryKey: ['sip-trunks'] });
      queryClient.invalidateQueries({ queryKey: ['sip-agent-mappings'] });
    }
  });

  const deleteSipTrunk = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/api/sip-trunk/${id}`, {
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
      queryClient.invalidateQueries({ queryKey: ['sip-agent-mappings'] });
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
