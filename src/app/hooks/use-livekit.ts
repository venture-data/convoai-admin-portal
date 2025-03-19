"use client"

import { useMutation} from "@tanstack/react-query";
import { useAuthStore } from "./useAuth";

export function useLiveKit() {
    const token = useAuthStore.getState().token;
    const createAccessToken= useMutation({
        mutationFn:async (agent_id:string) =>{
            const response = await fetch(`/api/livekit?agent_id=${agent_id}`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`,
                }
              });
              const responseData = await response.json();
      
              if (!response.ok) {
                throw new Error(responseData.error || 'Failed to create agent');
              }
        
              return responseData;
        }
    })
    return {
        createAccessToken
    }
}

