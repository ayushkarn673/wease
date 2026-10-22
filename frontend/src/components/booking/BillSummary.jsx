import { cn } from "@/lib/utils";
import { formatCurrency, formatVisitCharge, visitPolicy } from "@/lib/format";

const PAYMENT_STATUS = {
  UNPAID: { label: "Unpaid", className: "bg-amber-50 text-amber-800" },
  PARTIALLY_PAID: { label: "Partly paid", className: "bg-sky-50 text-sky-700" },
  PAID: { label: "Paid", className: "bg-emerald-50 text-emerald-700" },
};

// Price breakdown for a booking. Workers also see Wease's commission and what they take home.
export default function BillSummary({ booking, showEarnings }) {
  const bill = booking.bill;
  if (!bill) return null;

  const hasQuote = Number(bill.quoteTotal) > 0;
  const finished = booking.status === "COMPLETED";
  const payment = PAYMENT_STATUS[booking.paymentStatus];
  const visitNote = !hasQuote
    ? finished ? "Visit and inspection only" : visitPolicy(bill.visitingChargePolicy).short
    : bill.visitingChargeAdjusted ? "Counted towards the repair bill" : "Paid in addition to the repair";

  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold text-neutral-900">{finished ? "Final bill" : "Bill so far"}</p>
        {finished && payment && (
          <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", payment.className)}>{payment.label}</span>
        )}
      </div>

      <dl className="mt-4 space-y-2.5 text-sm">
        <Row label="Visiting charge" hint={visitNote} value={formatVisitCharge(bill.visitingCharge)} muted={bill.visitingChargeAdjusted} />
        {hasQuote && (
          <>
            <Row label="Labour" value={formatCurrency(bill.labour)} />
            {Number(bill.materials) > 0 && <Row label="Materials" value={formatCurrency(bill.materials)} />}
            {Number(bill.other) > 0 && <Row label="Other charges" value={formatCurrency(bill.other)} />}
          </>
        )}
      </dl>

      <div className="mt-4 flex items-baseline justify-between border-t border-neutral-100 pt-4">
        <span className="font-semibold text-neutral-900">Total</span>
        <span className="text-2xl font-bold tracking-tight text-neutral-900">{formatCurrency(bill.total)}</span>
      </div>
      {!finished && (
        <p className="mt-1 text-xs text-neutral-500">
          {hasQuote ? "Based on the approved quotes." : "Repair charges are added only if you approve a quote."} Final once the job is completed.
        </p>
      )}

      {finished && (
        <dl className="mt-3 space-y-2 text-sm">
          <Row label="Paid" value={formatCurrency(bill.amountPaid)} />
          <Row label="Balance due" value={formatCurrency(bill.balanceDue)} strong={Number(bill.balanceDue) > 0} />
        </dl>
      )}

      {showEarnings && (
        <dl className="mt-4 space-y-2 rounded-xl bg-neutral-50 p-3.5 text-sm">
          <Row label="Wease commission (on labour)" value={`− ${formatCurrency(bill.platformCommission)}`} />
          <Row label="You earn" value={formatCurrency(bill.workerEarning)} strong />
        </dl>
      )}

      <p className="mt-4 text-xs text-neutral-500">Payment: {booking.paymentMethod === "ONLINE" ? "Online" : "Cash after the job"}</p>
    </div>
  );
}

function Row({ label, hint, value, muted, strong }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-neutral-600">
        {label}
        {hint && <span className="block text-xs text-neutral-400">{hint}</span>}
      </dt>
      <dd className={cn("shrink-0 text-right", strong ? "font-bold text-neutral-900" : "font-medium text-neutral-900", muted && "text-neutral-500")}>
        {value}
      </dd>
    </div>
  );
}
