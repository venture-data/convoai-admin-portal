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

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = useAuthStore.getState().token;
  console.log("Current token:", token);
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  const response = await fetch(`${BASE_URL}/api/v1/${url}`, {
    ...options,
    headers,
    credentials: 'include'
  });

  if (response.status === 401) {
    if (isRefreshing) {
      try {
        await new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
        const newToken = useAuthStore.getState().token;
        headers.set('Authorization', `Bearer ${newToken}`);
        return fetch(`/api/v1/${url}`, {
          ...options,
          headers,
          credentials: 'include'
        });
      } catch (error) {
        console.error("Queue error:", error);
        await signOut({ callbackUrl: '/' });
        throw error;
      }
    }

    isRefreshing = true;

    try {
      console.log("Attempting to refresh token");
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
        throw new Error('Token refresh failed');
      }

      const data = await refreshResponse.json();
      console.log("Refresh response:", data);
      
      if (!data.access_token) {
        throw new Error('No access token in refresh response');
      }
      
      processQueue(null);
      headers.set('Authorization', `Bearer ${data.access_token}`);
      
      return fetch(`/api/v1/${url}`, {
        ...options,
        headers,
        credentials: 'include'
      });
    } catch (error) {
      console.error("Refresh error:", error);
      processQueue(error instanceof Error ? error : new Error('Token refresh failed'));
      throw error;
    } finally {
      isRefreshing = false;
    }
  }

  return response;
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
    console.log("Making DELETE request for:", url);
    return fetchWithAuth(url, { ...options, method: 'DELETE' });
  }
};

export default api; 