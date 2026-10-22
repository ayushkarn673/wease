import api from "./api";

// review: { rating: 1-5, comment? }
export const rateBooking = async (bookingId, review) => {
  const response = await api.post(`/bookings/${bookingId}/review`, review);
  return response.data;
};

// { average, count, breakdown: { 5: n, ... 1: n }, reviews: [...] }
export const getWorkerReviews = async (workerId) => {
  const response = await api.get(`/workers/${workerId}/reviews`);
  return response.data;
};

export const rateCrewRequest = async (crewRequestId, review) => {
  const response = await api.post(`/crew-requests/${crewRequestId}/review`, review);
  return response.data;
};

export const getFirmReviews = async (firmId) => {
  const response = await api.get(`/firms/${firmId}/reviews`);
  return response.data;
};
