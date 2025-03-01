import { useAuthStore } from '@/app/hooks/useAuth';
import ky from 'ky';

// Update the environment variable name to match .env file
const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL;

if (!baseUrl) {
    throw new Error('Unable to determine base URL');
}

const api = ky.create({
    prefixUrl: baseUrl,
    timeout: 10000, 
    hooks: {
        beforeRequest: [
            (request) => {
                const token = useAuthStore.getState().token;
                if (token) {
                    request.headers.set('Authorization', `Bearer ${token}`);
                }
            },
        ],
        afterResponse: [
            (_request, _options, response) => {
                if (!response.ok) {
                    console.error('API request failed:', response);
                }
            },
        ],
    },
});

export default api;
