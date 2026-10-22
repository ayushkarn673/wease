import api from "./api";

export const getUserProfile = async () => {
  const response = await api.get("/user/profile");
  return response.data;
};

export const resendVerificationEmail = async () => {
  const response = await api.post("/user/resend-verification");
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await api.put("/user/profile", profileData);
  return response.data;
};

// Pass null to browse all cities.
export const updateCity = async (city) => {
  const response = await api.put("/user/city", { city });
  return response.data;
};
