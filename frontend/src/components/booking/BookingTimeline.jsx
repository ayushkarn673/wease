import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { status: "PENDING", label: "Requested", hint: "Waiting for the professional to respond" },
  { status: "ACCEPTED", label: "Confirmed", hint: "The professional accepted and will inspect the job" },
  { status: "IN_PROGRESS", label: "Price agreed", hint: "The quote was approved and work can begin" },
  { status: "COMPLETED", label: "Completed", hint: "The job has been marked as done" },
];

const ORDER = { PENDING: 0, ACCEPTED: 1, IN_PROGRESS: 2, COMPLETED: 3 };

export default function BookingTimeline({ status }) {
  // Declined or cancelled bookings end after the request step.
  if (status === "REJECTED" || status === "CANCELLED") {
    return (
      <ol className="space-y-5">
        <Step state="done" label="Requested" hint="Your request was sent" />
        <Step
          state="stopped"
          label={status === "REJECTED" ? "Declined" : "Cancelled"}
          hint={
            status === "REJECTED"
              ? "The professional couldn't take this job. You can book someone else."
              : "This booking was cancelled."
          }
          last
        />
      </ol>
    );
  }

  const current = ORDER[status] ?? 0;
  return (
    <ol className="space-y-5">
      {STEPS.map((step, index) => {
        const state = index < current || status === "COMPLETED" ? "done" : index === current ? "current" : "upcoming";
        return <Step key={step.status} state={state} label={step.label} hint={step.hint} last={index === STEPS.length - 1} />;
      })}
    </ol>
  );
}

function Step({ state, label, hint, last }) {
  return (
    <li className="relative flex gap-4">
      {!last && (
        <span
          aria-hidden="true"
          className={cn("absolute left-[13px] top-8 h-[calc(100%-4px)] w-0.5", state === "done" ? "bg-brand-600" : "bg-neutral-200")}
        />
      )}
      <span
        className={cn(
          "relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full ring-4 ring-white",
          state === "done" && "bg-brand-600 text-white",
          state === "current" && "border-2 border-brand-600 bg-white",
          state === "upcoming" && "border-2 border-neutral-200 bg-white",
          state === "stopped" && "bg-red-500 text-white"
        )}
      >
        {state === "done" && <Check className="size-4" />}
        {state === "current" && <span className="size-2.5 rounded-full bg-brand-600" />}
        {state === "stopped" && <X className="size-4" />}
      </span>
      <div className="pb-1">
        <p className={cn("text-sm font-medium", state === "upcoming" ? "text-neutral-400" : "text-neutral-900")}>{label}</p>
        <p className={cn("text-sm", state === "upcoming" ? "text-neutral-400" : "text-neutral-500")}>{hint}</p>
      </div>
    </li>
  );
}
