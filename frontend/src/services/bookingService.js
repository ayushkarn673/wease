import api from "./api";

export const createBooking = async (data) => {
    const response = await api.post("/bookings", data);
    return response.data;
};

export const getCustomerBookings = async () => {
    const response = await api.get("/bookings/customer");
    return response.data;
};

export const getWorkerBookings = async () => {
    const response = await api.get("/bookings/worker");
    return response.data;
};

export const acceptBooking = async (id) => {
    const response = await api.put(`/bookings/${id}/accept`);
    return response.data;
};

export const rejectBooking = async (id) => {
    const response = await api.put(`/bookings/${id}/reject`);
    return response.data;
};

export const completeBooking = async (id) => {
    const response = await api.put(`/bookings/${id}/complete`);
    return response.data;
};


export const updateAvailability = async (available) => {
    const response = await api.put("/workers/availability", { available });
    return response.data;
};

export const getBookingDetails = async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
};
