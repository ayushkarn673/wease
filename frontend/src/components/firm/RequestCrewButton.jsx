import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency } from "@/lib/format";
import SignInPrompt from "../shared/SignInPrompt";
import FirmAvatar from "./FirmAvatar";
import CrewRequestDialog from "./CrewRequestDialog";

// "Request crew": visitors are asked to sign in first, customers get the request form.
export default function RequestCrewButton({ firm, profession, className, size = "md", children = "Request crew" }) {
  const { user } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const unavailable = firm.available === false;
  const notCustomer = user && user.role !== "CUSTOMER";
  const returnTo = `/firms/${firm.id}`;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={unavailable || notCustomer}
        title={unavailable ? "Not taking requests right now" : notCustomer ? "Only customer accounts can request crews" : undefined}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full bg-brand-700 font-semibold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500",
          size === "lg" ? "h-12 px-6 text-sm" : size === "sm" ? "h-9 px-4 text-xs" : "h-10 px-4 text-sm",
          className
        )}
      >
        <Users className="size-4" />
        {unavailable ? "Unavailable" : notCustomer ? "Customers only" : children}
      </button>
      {user?.role === "CUSTOMER" && <CrewRequestDialog firm={firm} profession={profession} open={open} onOpenChange={setOpen} />}
      {!user && (
        <SignInPrompt
          open={open}
          onOpenChange={setOpen}
          title={`Request a crew from ${firm.companyName}`}
          returnTo={returnTo}
          media={<FirmAvatar name={firm.companyName} />}
          note={location.pathname === returnTo ? null : "You'll come back to this firm's page to finish your request."}
        >
          From <span className="font-semibold text-neutral-900">{formatCurrency(firm.lowestDailyRate)}</span> per worker per day · you see
          the full estimate before sending
        </SignInPrompt>
      )}
    </>
  );
}