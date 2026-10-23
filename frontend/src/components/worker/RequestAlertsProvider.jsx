import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { PendingRequestsContext } from "../../context/requests";
import { getWorkerBookings } from "../../services/bookingService";
import { usePolling } from "../../hooks/usePolling";
import { formatDate, formatTime } from "@/lib/format";

const POLL_MS = 20000;

// While a professional has Wease open, checks for new booking requests: shows a pop-up for each new one
// and keeps the count for the badge on "Dashboard". (When Wease is closed, push notifications do this.)
export default function RequestAlertsProvider({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isWorker = user?.role === "WORKER";
  const [count, setCount] = useState(0);
  const seen = useRef(null);

  const apply = useCallback((bookings) => {
    const pending = bookings.filter((b) => b.status === "PENDING");
    setCount(pending.length);
    if (seen.current) {
      for (const b of pending.filter((p) => !seen.current.has(p.bookingId))) {
        toast.info(`New request from ${b.customerName}`, {
          description: `${formatDate(b.bookingDate)}, ${formatTime(b.bookingTime)}`,
          action: { label: "View", onClick: () => navigate(`/booking/${b.bookingId}`) },
          duration: 15000,
        });
      }
    }
    seen.current = new Set(pending.map((b) => b.bookingId));
  }, [navigate]);

  // First check when a professional signs in; it sets what counts as "already seen".
  useEffect(() => {
    seen.current = null;
    if (!isWorker) return undefined;
    let active = true;
    getWorkerBookings().then((bookings) => active && apply(bookings), () => {});
    return () => {
      active = false;
    };
  }, [isWorker, apply]);

  const check = useCallback(() => getWorkerBookings().then(apply), [apply]);
  usePolling(check, POLL_MS, isWorker);

  // "(2) Wease — …" in the browser tab while requests are waiting.
  useEffect(() => {
    if (!isWorker || count === 0) return undefined;
    const title = document.title;
    document.title = `(${count}) ${title}`;
    return () => {
      document.title = title;
    };
  }, [isWorker, count]);

  return <PendingRequestsContext.Provider value={isWorker ? count : 0}>{children}</PendingRequestsContext.Provider>;
}
