"use client"

import { useMutation} from "@tanstack/react-query";
import { useAuthStore } from "./useAuth";

export function useSubscription() {
    const token = useAuthStore.getState().token;
    const createSubscriptionIntent= useMutation({
        mutationFn:async (priceId:string) =>{
            const response = await fetch('/api/subscription', {
                method: 'POST',
                body:priceId,
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
        createSubscriptionIntent
    }
}

