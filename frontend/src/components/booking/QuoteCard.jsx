import { useState } from "react";
import { toast } from "sonner";
import { Check, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { acceptQuote, rejectQuote } from "../../services/bookingService";
import { QUOTE_ITEM_TYPES, formatCurrency, getErrorMessage, totalIfApproved } from "@/lib/format";

const STATUS = {
  PENDING: { label: "Waiting for approval", className: "bg-amber-50 text-amber-800 ring-amber-200" },
  ACCEPTED: { label: "Approved", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  REJECTED: { label: "Declined", className: "bg-red-50 text-red-700 ring-red-200" },
  SUPERSEDED: { label: "Replaced", className: "bg-neutral-100 text-neutral-600 ring-neutral-200" },
};

const TYPE_LABEL = Object.fromEntries(QUOTE_ITEM_TYPES.map((t) => [t.value, t.label]));

function formatStamp(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}

// An itemised quote. The customer can approve or decline it while it's pending.
export default function QuoteCard({ quote, booking, canRespond, onResponded, compact = false }) {
  const [busy, setBusy] = useState(null);
  const status = STATUS[quote.status] ?? STATUS.PENDING;

  async function respond(action) {
    setBusy(action);
    try {
      if (action === "accept") {
        await acceptQuote(booking.bookingId, quote.id);
        toast.success(quote.extraWork ? "Extra work approved" : "Quote approved", {
          description: quote.extraWork ? "It has been added to your bill." : `${booking.workerName} can start the work.`,
        });
      } else {
        await rejectQuote(booking.bookingId, quote.id);
        toast.success("Quote declined", {
          description: quote.extraWork
            ? "Your earlier approved quote still applies."
            : Number(booking.bill?.visitingCharge) > 0 ? "Only the visiting charge applies unless you approve a new quote." : undefined,
        });
      }
      onResponded();
    } catch (err) {
      toast.error("Couldn't update the quote", { description: getErrorMessage(err) });
    } finally {
      setBusy(null);
    }
  }

  return (
    <article className={cn("rounded-2xl border bg-white", quote.status === "PENDING" ? "border-amber-200" : "border-neutral-200/80", compact ? "p-4" : "p-5")}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-semibold text-neutral-900">{quote.extraWork ? "Extra work" : "Quote"} #{quote.id}</p>
          <p className="text-xs text-neutral-500">
            Sent {formatStamp(quote.createdAt)}
            {quote.respondedAt && ` · answered ${formatStamp(quote.respondedAt)}`}
          </p>
        </div>
        <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset", status.className)}>{status.label}</span>
      </div>

      {!compact && (
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 text-left text-xs text-neutral-500">
              <th className="pb-2 font-medium">Item</th>
              <th className="hidden pb-2 text-right font-medium sm:table-cell">Qty × price</th>
              <th className="pb-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {quote.items.map((item) => (
              <tr key={item.id}>
                <td className="py-2.5 pr-3">
                  <span className="block font-medium text-neutral-900 [overflow-wrap:anywhere]">{item.description}</span>
                  <span className="text-xs text-neutral-500">
                    {TYPE_LABEL[item.type]}
                    <span className="sm:hidden"> · {item.quantity} × {formatCurrency(item.unitPrice)}</span>
                  </span>
                </td>
                <td className="hidden py-2.5 text-right text-neutral-600 sm:table-cell">
                  {item.quantity} × {formatCurrency(item.unitPrice)}
                </td>
                <td className="py-2.5 text-right font-medium text-neutral-900">{formatCurrency(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className={cn("flex items-center justify-between", compact ? "mt-2" : "mt-3 border-t border-neutral-100 pt-3")}>
        <span className="text-sm text-neutral-500">
          {compact ? `${quote.items.length} ${quote.items.length === 1 ? "item" : "items"}` : quote.extraWork ? "Extra amount" : "Quote total"}
        </span>
        <span className={cn("font-bold text-neutral-900", compact ? "text-base" : "text-lg")}>{formatCurrency(quote.total)}</span>
      </div>

      {quote.note && !compact && (
        <p className="mt-3 rounded-xl bg-neutral-50 p-3 text-sm text-neutral-600 [overflow-wrap:anywhere]">“{quote.note}”</p>
      )}

      {quote.status === "PENDING" && !compact && booking.bill && (
        <div className="mt-3 flex items-center justify-between rounded-xl bg-brand-50 px-3.5 py-2.5 text-sm">
          <span className="text-brand-900">
            {quote.extraWork ? `Booking total after approval (${formatCurrency(booking.bill.total)} + extra)` : "Booking total after approval"}
          </span>
          <span className="font-bold text-brand-900">{formatCurrency(totalIfApproved(booking.bill, quote))}</span>
        </div>
      )}

      {canRespond && quote.status === "PENDING" && (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => respond("reject")}
            disabled={busy !== null}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-neutral-300 text-sm font-semibold text-neutral-700 hover:border-red-300 hover:text-red-600 disabled:opacity-60"
          >
            {busy === "reject" ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
            Decline
          </button>
          <button
            type="button"
            onClick={() => respond("accept")}
            disabled={busy !== null}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-brand-700 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60"
          >
            {busy === "accept" ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
            Approve {quote.extraWork ? "extra " : ""}{formatCurrency(quote.total)}
          </button>
        </div>
      )}
    </article>
  );
}
