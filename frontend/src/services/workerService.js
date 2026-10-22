import api from "./api";

export const createWorkerProfile = async (profileData) => {
  const response = await api.post("/workers/profile", profileData);
  return response.data;
};

// Optional filters: { profession: "PLUMBER", q: "name search" }
export const getAvailableWorkers = async (params = {}) => {
  const response = await api.get("/workers", { params });
  return response.data;
};

export const getWorkerDetails = async (id) => {
  const response = await api.get(`/workers/${id}`);
  return response.data;
};

// NEW
export const getWorkerProfile = async () => {
  const response = await api.get("/workers/profile");
  return response.data;
};

// NEW
export const updateWorkerProfile = async (profileData) => {
  const response = await api.put("/workers/profile", profileData);
  return response.data;
};

// { visitingCharge, visitingChargePolicy }
export const updateWorkerPricing = async (pricing) => {
  const response = await api.put("/workers/pricing", pricing);
  return response.data;
};

// The worker's base location; they serve customers within 10 km of it.
export const updateWorkerLocation = async ({ lat, lng }) => {
  const response = await api.put("/workers/location", { latitude: lat, longitude: lng });
  return response.data;
};
