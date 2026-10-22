import api from "./api";

export const createCrewRequest = async (request) => {
  const response = await api.post("/crew-requests", request);
  return response.data;
};

export const getCustomerCrewRequests = async () => {
  const response = await api.get("/crew-requests/customer");
  return response.data;
};

export const getFirmCrewRequests = async () => {
  const response = await api.get("/crew-requests/firm");
  return response.data;
};

export const getCrewRequest = async (id) => {
  const response = await api.get(`/crew-requests/${id}`);
  return response.data;
};

export const acceptCrewRequest = async (id) => {
  const response = await api.put(`/crew-requests/${id}/accept`);
  return response.data;
};

export const rejectCrewRequest = async (id) => {
  const response = await api.put(`/crew-requests/${id}/reject`);
  return response.data;
};

// actualWorkerDays is optional and can only be lower than planned.
export const completeCrewRequest = async (id, actualWorkerDays) => {
  const response = await api.put(`/crew-requests/${id}/complete`, actualWorkerDays ? { actualWorkerDays } : undefined);
  return response.data;
};

export const cancelCrewRequest = async (id) => {
  const response = await api.put(`/crew-requests/${id}/cancel`);
  return response.data;
};