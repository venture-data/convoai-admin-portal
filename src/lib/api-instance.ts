"use client"

import { useAuthStore } from '@/app/hooks/useAuth';
import { signOut } from 'next-auth/react';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: () => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });
  failedQueue = [];
};

const handleSessionTimeout = async () => {
  useAuthStore.getState().setCreds({
    token: '',
    isAuth: false
  });
  await signOut({ 
    callbackUrl: '/?error=Session expired. Please login again.' 
  });
};

const isTokenAvailable = (): boolean => {
  const token = useAuthStore.getState().token;
  return !!token && token.length > 0;
};

const isTimeoutError = (response: Response): boolean => {
  return response.status === 504 || response.status === 522 || response.status === 524;
};

const waitForToken = async (timeoutMs = 5000, intervalMs = 100): Promise<string> => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkToken = () => {
      const token = useAuthStore.getState().token;
      
      if (token && token.length > 0) {
        resolve(token);
        return;
      }
      
      if (Date.now() - startTime > timeoutMs) {
        reject(new Error('Token not available in localStorage after timeout'));
        return;
      }
      
      setTimeout(checkToken, intervalMs);
    };
    
    checkToken();
  });
};

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let token = useAuthStore.getState().token;

  if (!token) {
    try {
      console.log("Token not found in localStorage, waiting for it to be available...");
      token = await waitForToken();
      console.log("Token is now available in localStorage");
    } catch (error) {
      console.error("Failed to get token:", error);
      return new Response(JSON.stringify({ error: 'Authentication token not available. Please refresh the page or log in again.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  try {
    const response = await fetch(`${BASE_URL}/${url}`, {
      ...options,
      headers,
      credentials: 'include'
    });

    // Handle timeout errors as potential success cases
    if (isTimeoutError(response)) {
      console.log("Request timed out, but it might still be processing on the server side.");
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Your request has been sent and is being processed",
        timeout: true
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (response.status === 401) {
      if (isRefreshing) {
        try {
          await new Promise<void>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          const newToken = useAuthStore.getState().token;
          headers.set('Authorization', `Bearer ${newToken}`);
          return fetch(`${BASE_URL}/${url}`, {
            ...options,
            headers,
            credentials: 'include'
          });
        } catch (error) {
          console.error("Queue error:", error);
          await handleSessionTimeout();
          return new Response(null, { status: 401 });
        }
      }

      isRefreshing = true;

      try {
        const refreshResponse = await fetch('/api/refresh', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!refreshResponse.ok) {
          console.error("Refresh failed:", await refreshResponse.text());
          await handleSessionTimeout();
          return new Response(null, { status: 401 });
        }

        const data = await refreshResponse.json();
        if (!data.access_token) {
          await handleSessionTimeout();
          return new Response(null, { status: 401 });
        }

        useAuthStore.getState().setCreds({
          token: data.access_token,
          isAuth: true
        });
        
        processQueue(null);
        
        headers.set('Authorization', `Bearer ${data.access_token}`);
        const newResponse = await fetch(`${BASE_URL}/${url}`, {
          ...options,
          headers,
          credentials: 'include'
        });
        
        return newResponse;
      } catch (error) {
        processQueue(error instanceof Error ? error : new Error('Token refresh failed'));
        await handleSessionTimeout();
        return new Response(null, { status: 401 });
      } finally {
        isRefreshing = false;
      }
    }
    
    return response;
  } catch (error) {
    // Handle fetch errors (including timeouts) as potentially successful for certain operations
    if (error instanceof Error && 
        (error.message.includes('timeout') || 
         error.message.includes('network') || 
         error.message.includes('failed to fetch'))) {
      console.log("Network error, but the request might still be processing:", error);
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Your request has been sent and is being processed",
        timeout: true
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    throw error;
  }
}

const api = {
  async get(url: string, options: RequestInit = {}) {
    return fetchWithAuth(url, { ...options, method: 'GET' });
  },

  async post(url: string, options: RequestInit = {}) {
    return fetchWithAuth(url, { ...options, method: 'POST' });
  },

  async put(url: string, options: RequestInit = {}) {
    return fetchWithAuth(url, { ...options, method: 'PUT' });
  },

  async delete(url: string, options: RequestInit = {}) {
    return fetchWithAuth(url, { ...options, method: 'DELETE' });
  },
  
  isTokenAvailable,
  isTimeoutError
};

export default api; 