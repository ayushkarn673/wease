import axios from "axios";
import { getToken, clearAuth } from "../utils/auth";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// An expired or invalid token makes the backend answer 401. Clear the stale
// session and send the user to login. Auth endpoints are excluded so a wrong
// password on the login page shows its error instead of reloading the page.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthRequest = error.config?.url?.startsWith("/auth/");
        if (error.response?.status === 401 && !isAuthRequest) {
            clearAuth();
            window.location.assign("/login");
        }
        return Promise.reject(error);
    }
);

export default api;
