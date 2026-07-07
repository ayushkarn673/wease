import api from "./api";

export const getWorkerDashboard = async () => {
  const bookings = await api.get("/bookings/worker");

  return bookings.data;
};
