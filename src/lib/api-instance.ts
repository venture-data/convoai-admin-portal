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

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = useAuthStore.getState().token;
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  const response = await fetch(`${BASE_URL}/${url}`, {
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
  console.log("response");
  console.log(response);
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
    return fetchWithAuth(url, { ...options, method: 'DELETE' });
  }
};

export default api; 