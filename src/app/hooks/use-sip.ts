import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from '@/lib/api-instance';

interface PhoneNumberFormData {
  name: string;
  phone_number: string;
  sip_termination_uri: string;
  username: string;
  password: string;
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

  const createSipTrunk = useMutation({
    mutationFn: async (data: PhoneNumberFormData) => {
      const response = await api.post('/api/sip-trunk', {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create SIP trunk');
      }

      return response.json();
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
    createError: createSipTrunk.error
  };
}
