import { useState } from "react";
import { useLocation } from "react-router-dom";
import { CalendarPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "../../context/AuthContext";
import { formatVisitCharge } from "@/lib/format";
import UserAvatar from "../shared/UserAvatar";
import SignInPrompt from "../shared/SignInPrompt";
import BookingDialog from "./BookingDialog";

// Decides what "Book" means for the current visitor: visitors who aren't signed in are asked to log in
// or sign up (and come back here afterwards), customers get the booking form, workers/admins can't book.
export default function BookWorkerButton({ worker, className, children = "Book now", size = "md" }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const unavailable = worker.available === false;
  const notCustomer = user && user.role !== "CUSTOMER";
  const disabled = unavailable || notCustomer;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={disabled}
        title={unavailable ? "Not taking bookings right now" : notCustomer ? "Only customer accounts can book" : undefined}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full bg-brand-700 font-semibold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500 disabled:shadow-none",
          size === "lg" ? "h-12 px-6 text-sm" : size === "sm" ? "h-9 px-3.5 text-xs" : "h-10 px-4 text-sm",
          className
        )}
      >
        <CalendarPlus className="size-4" />
        {unavailable ? "Unavailable" : notCustomer ? "Customers only" : children}
      </button>
      {user?.role === "CUSTOMER" && <BookingDialog worker={worker} open={open} onOpenChange={setOpen} />}
      {!user && <SignInToBook worker={worker} open={open} onOpenChange={setOpen} />}
    </>
  );
}

function SignInToBook({ worker, open, onOpenChange }) {
  const location = useLocation();
  const returnTo = `/workers/${worker.id}`;
  return (
    <SignInPrompt
      open={open}
      onOpenChange={onOpenChange}
      title={`Book ${worker.fullName}`}
      returnTo={returnTo}
      media={<UserAvatar name={worker.fullName} src={worker.profilePhoto} seed={worker.id} size="lg" />}
      note={location.pathname === returnTo ? null : `You'll come back to ${worker.fullName}'s profile to finish booking.`}
    >
      Visiting charge <span className="font-semibold text-neutral-900">{formatVisitCharge(worker.visitingCharge)}</span> · repair quoted
      after inspection · pay after the job
    </SignInPrompt>
  );
}