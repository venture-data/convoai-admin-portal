import { useQuery } from "@tanstack/react-query"
import { VoiceConfig } from "@/app/dashboard/new_agents/types"
import api from "@/lib/api-instance";

export function useVoice(provider: string = "openai") {
  const { data: voices = [] as VoiceConfig[], isLoading, error } = useQuery({
    queryKey: ["voices", provider],
    queryFn: async () => {
      const response = await api.get(`/api/voices?provider=${provider}`,{
        method: 'GET',
        credentials: 'include'
      });
      const data = await response.json();
      return data
    },
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  })

  return {
    voices,
    isLoading,
    error
  }
}

