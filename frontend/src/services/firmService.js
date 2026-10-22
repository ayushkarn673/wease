import api from "./api";

// Optional filters: { profession: "LABOURER", city: "Pune" }
export const searchFirms = async (params = {}) => {
  const response = await api.get("/firms", { params });
  return response.data;
};

export const getFirm = async (id) => {
  const response = await api.get(`/firms/${id}`);
  return response.data;
};

export const getOwnFirm = async () => {
  const response = await api.get("/firms/profile");
  return response.data;
};

export const createFirmProfile = async (profile) => {
  const response = await api.post("/firms/profile", profile);
  return response.data;
};

export const updateFirmProfile = async (profile) => {
  const response = await api.put("/firms/profile", profile);
  return response.data;
};

export const updateFirmAvailability = async (available) => {
  const response = await api.put("/firms/availability", { available });
  return response.data;
};