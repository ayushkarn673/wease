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

// Phone login: sends a 6-digit code by SMS. Returns { message, phone (masked), expiresInSeconds, resendInSeconds }.
export const sendOtp = async (phone) => {
  const response = await api.post("/auth/otp/send", { phone });
  return response.data;
};

// Logs in, or creates the account when fullName (and optionally role) is given for a new number.
// A new number without a name fails with 404 and error "NEW_ACCOUNT".
export const verifyOtp = async ({ phone, code, fullName, role }) => {
  const response = await api.post("/auth/otp/verify", { phone, code, fullName, role });
  return response.data;
};

// credential: the ID token from Google Sign-In.
export const googleLogin = async ({ credential, role }) => {
  const response = await api.post("/auth/google", { credential, role });
  return response.data;
};
