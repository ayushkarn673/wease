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

// The final amount comes from the approved quote (or the visiting charge alone); it isn't typed in.
export const completeBooking = async (id) => {
    const response = await api.put(`/bookings/${id}/complete`);
    return response.data;
};

export const getQuotes = async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}/quotes`);
    return response.data;
};

// quote: { items: [{ type, description, quantity, unitPrice }], note }
export const submitQuote = async (bookingId, quote) => {
    const response = await api.post(`/bookings/${bookingId}/quotes`, quote);
    return response.data;
};

export const acceptQuote = async (bookingId, quoteId) => {
    const response = await api.put(`/bookings/${bookingId}/quotes/${quoteId}/accept`);
    return response.data;
};

export const rejectQuote = async (bookingId, quoteId) => {
    const response = await api.put(`/bookings/${bookingId}/quotes/${quoteId}/reject`);
    return response.data;
};

export const getPayments = async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}/payments`);
    return response.data;
};

export const recordCashPayment = async (bookingId, amount) => {
    const response = await api.post(`/bookings/${bookingId}/payments/cash`, { amount });
    return response.data;
};

export const cancelBooking = async (id) => {
    const response = await api.put(`/bookings/${id}/cancel`);
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
