"use client"

import { useAuthStore } from '@/app/hooks/useAuth';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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
  console.log("Token:", token);
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  console.log("Request token:", token);
  console.log("Request URL:", `${BASE_URL}${url}`);

  const response = await fetch(`${BASE_URL}/${url}`, {
    ...options,
    headers
  });

  console.log("Response status:", response.status);

  if (response.status === 401) {
    if (isRefreshing) {
      try {
        await new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
        const newToken = useAuthStore.getState().token;
        console.log("Using refreshed token:", newToken);
        headers.set('Authorization', `Bearer ${newToken}`);
        return fetch(`${BASE_URL}/${url}`, {
          ...options,
          headers
        });
      } catch (error) {
        console.error("Queue error:", error);
        throw error;
      }
    }

    isRefreshing = true;

    try {
      const currentToken = useAuthStore.getState().token;
      console.log("Attempting refresh with token:", currentToken);
      
      const refreshResponse = await fetch(`${BASE_URL}/api/v1/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: currentToken })
      });

      if (!refreshResponse.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await refreshResponse.json();
      console.log("Refresh response:", data);
      
      const { access_token } = data;
      useAuthStore.getState().setCreds({ token: access_token });
      
      processQueue(null);
      headers.set('Authorization', `Bearer ${access_token}`);
      
      return fetch(`${BASE_URL}/${url}`, {
        ...options,
        headers
      });
    } catch (error) {
      console.error("Refresh error:", error);
      processQueue(error instanceof Error ? error : new Error('Token refresh failed'));
      useAuthStore.getState().setCreds({ token: '', isAuth: false });
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
    return fetchWithAuth(url, { ...options, method: 'DELETE' });
  }
};

export default api; 