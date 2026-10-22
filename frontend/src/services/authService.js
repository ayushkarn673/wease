import api from "./api";

export const register = async (data) => {
    const response = await api.post("/auth/register", data);
    return response.data;
};

export const login = async (data) => {
    const response = await api.post("/auth/login", data);
    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
};

export const resetPassword = async (token, newPassword) => {
    const response = await api.post("/auth/reset-password", { token, newPassword });
    return response.data;
};

export const verifyEmail = async (token) => {
    const response = await api.post("/auth/verify-email", { token });
    return response.data;
};
