import { useQuery } from "@tanstack/react-query"
import { VoiceConfig } from "@/app/dashboard/new_agents/types"


export function useVoice() {
  const { data: voices = [] as VoiceConfig[], isLoading, error } = useQuery({
    queryKey: ["voices"],
    queryFn: async () => {
      const response = await fetch('/api/voices');
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

