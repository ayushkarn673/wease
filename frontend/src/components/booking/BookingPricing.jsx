import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Banknote, CheckCheck, ClipboardList, FilePlus2, Hourglass, Loader2 } from "lucide-react";
import { useAsync } from "../../hooks/useAsync";
import { completeBooking, getPayments, getQuotes, recordCashPayment } from "../../services/bookingService";
import { formatCurrency, getErrorMessage } from "@/lib/format";
import { inputClassName } from "@/lib/styles";
import SectionHeader from "../shared/SectionHeader";
import BillSummary from "./BillSummary";
import QuoteCard from "./QuoteCard";
import QuoteForm from "./QuoteForm";

const WORKING = ["ACCEPTED", "IN_PROGRESS"];

// Quote, bill and payment section of a booking, for both the customer and the professional.
export default function BookingPricing({ booking, role, onBookingChanged }) {
  const isWorker = role === "WORKER";
  const isCustomer = role === "CUSTOMER";
  const id = booking.bookingId;

  const loadQuotes = useCallback(() => getQuotes(id), [id]);
  const loadPayments = useCallback(() => getPayments(id), [id]);
  const { data: quotes = [], refresh: refreshQuotes } = useAsync(loadQuotes);
  const { data: payments = [], refresh: refreshPayments } = useAsync(loadPayments);
  const [composing, setComposing] = useState(false);

  // When the booking changes (often because the other person acted), fetch its quotes and payments again.
  const signature = JSON.stringify([booking.status, booking.quoteState, booking.paymentStatus, booking.bill]);
  const seen = useRef(signature);
  useEffect(() => {
    if (seen.current === signature) return;
    seen.current = signature;
    refreshQuotes();
    refreshPayments();
  }, [signature, refreshQuotes, refreshPayments]);

  // Before itemised pricing existed, a booking only stored the final amount.
  if (booking.quoteState == null) {
    if (booking.status !== "COMPLETED") return null;
    return (
      <section>
        <SectionHeader title="Price" />
        <div className="flex items-center justify-between rounded-2xl border border-neutral-200/80 bg-white p-5">
          <p className="text-sm text-neutral-500">Final amount</p>
          <p className="text-2xl font-bold text-neutral-900">{formatCurrency(booking.finalPrice ?? booking.estimatedPrice)}</p>
        </div>
      </section>
    );
  }

  // Quotes arrive newest first. Show the one waiting for an answer, then everything approved (the
  // original quote and any extra work, oldest first); declined and replaced quotes go in the history.
  const latest = quotes[0];
  const pending = latest?.status === "PENDING" ? latest : null;
  const approvedList = quotes.filter((q) => q.status === "ACCEPTED").reverse();
  const approved = approvedList.length > 0;
  const current = pending || approvedList.length > 0 ? [pending, ...approvedList].filter(Boolean) : latest ? [latest] : [];
  const history = quotes.filter((q) => !current.includes(q));
  const working = WORKING.includes(booking.status);

  async function afterChange() {
    setComposing(false);
    await Promise.all([refreshQuotes(), refreshPayments(), onBookingChanged()]);
  }

  return (
    <section className="space-y-4">
      <SectionHeader title="Quote & payment" />

      {booking.status === "PENDING" && (
        <Notice icon={Hourglass}>
          {isCustomer
            ? `Once ${booking.workerName} confirms, they'll visit, inspect the job and send you an itemised quote.`
            : "Accept the request first. After inspecting the job you can send an itemised quote."}
        </Notice>
      )}

      {working && current.length === 0 && !composing && (
        <Notice icon={ClipboardList}>
          {isCustomer
            ? `${booking.workerName} will send an itemised quote after inspecting the job. Nothing beyond the visiting charge is charged until you approve it.`
            : "After inspecting the job, send the customer an itemised quote. They must approve it before you start the repair."}
        </Notice>
      )}

      {current.map((q) => (
        <QuoteCard key={q.id} quote={q} booking={booking} canRespond={isCustomer && working} onResponded={afterChange} />
      ))}

      {isWorker && working && pending && (
        <p className="text-sm text-neutral-500">Waiting for {booking.customerName} to approve your quote.</p>
      )}

      {isWorker && working && !pending && !composing && (
        <button
          type="button"
          onClick={() => setComposing(true)}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-brand-200 bg-brand-50 text-sm font-semibold text-brand-800 hover:bg-brand-100"
        >
          <FilePlus2 className="size-4" />
          {approved ? "Add extra work" : latest ? "Send a new quote" : "Send quote"}
        </button>
      )}

      {composing && <QuoteForm booking={booking} revision={approved} onSubmitted={afterChange} onCancel={() => setComposing(false)} />}

      <BillSummary booking={booking} showEarnings={isWorker} />

      {isWorker && working && <CompleteJob booking={booking} hasPendingQuote={Boolean(pending)} onCompleted={afterChange} />}

      {isWorker && booking.status === "COMPLETED" && Number(booking.bill.balanceDue) > 0 && (
        <RecordCash booking={booking} onRecorded={afterChange} />
      )}

      {payments.length > 0 && (
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5">
          <p className="font-semibold text-neutral-900">Payments</p>
          <ul className="mt-3 divide-y divide-neutral-100 text-sm">
            {payments.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-4 py-2.5">
                <span className="text-neutral-600">
                  {p.method === "CASH" ? "Cash" : "Online"} · recorded by {p.recordedBy}
                  <span className="block text-xs text-neutral-400">
                    {new Date(p.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
                  </span>
                </span>
                <span className="font-semibold text-neutral-900">{formatCurrency(p.amount)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {history.length > 0 && (
        <details className="group">
          <summary className="cursor-pointer list-none text-sm font-semibold text-brand-700 hover:text-brand-800">
            Declined and replaced quotes ({history.length})
          </summary>
          <div className="mt-3 space-y-2">
            {history.map((q) => (
              <QuoteCard key={q.id} quote={q} booking={booking} compact />
            ))}
          </div>
        </details>
      )}
    </section>
  );
}

function Notice({ icon: Icon, children }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-neutral-200/80 bg-white p-4 text-sm leading-relaxed text-neutral-600">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
        <Icon className="size-4" />
      </span>
      <p className="pt-1.5">{children}</p>
    </div>
  );
}

function CompleteJob({ booking, hasPendingQuote, onCompleted }) {
  const [confirming, setConfirming] = useState(false);
  const [saving, setSaving] = useState(false);
  const visitOnly = booking.quoteState !== "APPROVED";

  async function handleComplete() {
    setSaving(true);
    try {
      await completeBooking(booking.bookingId);
      toast.success("Job completed", { description: `Final bill ${formatCurrency(booking.bill.total)}` });
      await onCompleted();
    } catch (err) {
      toast.error("Couldn't complete the job", { description: getErrorMessage(err) });
      setSaving(false);
      setConfirming(false);
    }
  }

  if (hasPendingQuote) return null;

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
      {confirming ? (
        <>
          <p className="font-semibold text-neutral-900">
            {visitOnly ? "Close as visit only?" : "Mark the job as completed?"}
          </p>
          <p className="mt-1 text-sm text-neutral-600">
            The final bill will be {formatCurrency(booking.bill.total)}
            {visitOnly ? " (visiting charge only, no repair)." : ", as in the approved quote."} This can't be changed afterwards.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setConfirming(false)} disabled={saving} className="h-10 rounded-full px-4 text-sm font-medium text-neutral-600 hover:bg-white">
              Back
            </button>
            <button
              type="button"
              onClick={handleComplete}
              disabled={saving}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {saving && <Loader2 className="size-4 animate-spin" />}
              Confirm
            </button>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <CheckCheck className="size-4" />
          {visitOnly ? `Close as visit only (${formatCurrency(booking.bill.total)})` : "Mark job as completed"}
        </button>
      )}
    </div>
  );
}

function RecordCash({ booking, onRecorded }) {
  const balance = Number(booking.bill.balanceDue);
  const [amount, setAmount] = useState(String(balance));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value < 1) return setError("Enter the amount you collected");
    if (value > balance) return setError(`That's more than the ${formatCurrency(balance)} due`);
    setError("");
    setSaving(true);
    try {
      await recordCashPayment(booking.bookingId, value);
      toast.success("Cash payment recorded", { description: formatCurrency(value) });
      await onRecorded();
    } catch (err) {
      toast.error("Couldn't record the payment", { description: getErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-neutral-200/80 bg-white p-5">
      <p className="flex items-center gap-2 font-semibold text-neutral-900">
        <Banknote className="size-5 text-emerald-600" />
        Record cash collected
      </p>
      <p className="mt-1 text-sm text-neutral-500">{formatCurrency(balance)} is still due from {booking.customerName}.</p>
      <div className="mt-3 flex gap-2">
        <label className="flex flex-1 items-center gap-1.5">
          <span className="text-sm font-semibold text-neutral-500">₹</span>
          <input
            type="number"
            min="1"
            step="0.01"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            aria-label="Amount collected"
            className={inputClassName}
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60"
        >
          {saving && <Loader2 className="size-4 animate-spin" />}
          Record
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
    </form>
  );
}
