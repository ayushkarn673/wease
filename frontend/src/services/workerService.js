import api from "./api";

export const createWorkerProfile = async (profileData) => {
  const response = await api.post("/workers/profile", profileData);
  return response.data;
};

export const getAvailableWorkers = async () => {
  const response = await api.get("/workers");
  return response.data;
};

export const getWorkerDetails = async (id) => {
  const response = await api.get(`/workers/${id}`);
  return response.data;
};
