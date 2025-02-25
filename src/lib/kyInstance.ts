import { useAuthStore } from '@/app/hooks/useAuth';
import ky from 'ky';


const api = ky.create({
    prefixUrl: 'https://rrfgpte7rx.us-east-1.awsapprunner.com/',
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
