import kyInstance from "@/lib/kyInstance"
import { useQuery } from "@tanstack/react-query"
import { VoiceConfig } from "@/app/dashboard/new_agents/types"


export function useVoice() {
  const { data: voices = [] as VoiceConfig[], isLoading, error } = useQuery({
    queryKey: ["voices"],
    queryFn: async () => {
      const response = await kyInstance.get("elevenlabs/voices")
      return response.json() as Promise<{ voices: VoiceConfig[] }>
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

