import api from "./api";

export const createWorkerProfile = async (profileData) => {
  const response = await api.post("/workers/profile", profileData);
  return response.data;
};

export const getAvailableWorkers = async (profession, keyword) => {
  const params = {};
  if (profession && profession !== "ALL") params.profession = profession;
  if (keyword) params.keyword = keyword;
  const response = await api.get("/workers", { params });
  return response.data;
};

export const getWorkerDetails = async (id) => {
  const response = await api.get(`/workers/${id}`);
  return response.data;
};
