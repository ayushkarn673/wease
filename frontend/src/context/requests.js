import { createContext, useContext } from "react";

// Number of booking requests waiting for the signed-in professional's reply (0 for everyone else).
export const PendingRequestsContext = createContext(0);

export const usePendingRequests = () => useContext(PendingRequestsContext);
