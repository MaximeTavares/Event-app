import { BrowserRouter } from 'react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'leaflet/dist/leaflet.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import { AuthProvider } from './features/auth/components/auth.provider';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000, // 1 min par défaut, override-able par hook
            refetchOnWindowFocus: false,
        },
    },
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <BrowserRouter>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                </QueryClientProvider>
            </BrowserRouter>
        </GoogleOAuthProvider>
    </StrictMode>,
);
