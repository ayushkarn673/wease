import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { submitQuote } from "../../services/bookingService";
import { QUOTE_ITEM_TYPES, formatCurrency, getErrorMessage } from "@/lib/format";
import { inputClassName } from "@/lib/styles";

const newItem = (type = "LABOUR") => ({ key: crypto.randomUUID(), type, description: "", quantity: "1", unitPrice: "" });

function lineTotal(item) {
  const qty = Number(item.quantity);
  const price = Number(item.unitPrice);
  return Number.isFinite(qty) && Number.isFinite(price) ? qty * price : 0;
}

// The worker itemises labour and materials after inspecting the job. The customer approves it before
// any repair work is charged.
export default function QuoteForm({ booking, revision, onSubmitted, onCancel }) {
  const [items, setItems] = useState(() => (revision ? [newItem("LABOUR")] : [newItem("LABOUR"), newItem("MATERIAL")]));
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const total = items.reduce((sum, item) => sum + lineTotal(item), 0);

  function update(key, field, value) {
    setItems((list) => list.map((item) => (item.key === key ? { ...item, [field]: value } : item)));
    setErrors((e) => ({ ...e, [key]: undefined, form: undefined }));
  }

  function validate() {
    const next = {};
    for (const item of items) {
      const qty = Number(item.quantity);
      const price = Number(item.unitPrice);
      if (!item.description.trim()) next[item.key] = "Describe this item";
      else if (!Number.isInteger(qty) || qty < 1 || qty > 100) next[item.key] = "Quantity must be 1–100";
      else if (item.unitPrice === "" || !Number.isFinite(price) || price < 0) next[item.key] = "Enter a price";
    }
    if (items.length === 0) next.form = "Add at least one item";
    else if (total <= 0) next.form = "The quote total must be more than ₹0";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await submitQuote(booking.bookingId, {
        items: items.map(({ type, description, quantity, unitPrice }) => ({
          type,
          description: description.trim(),
          quantity: Number(quantity),
          unitPrice: Number(unitPrice),
        })),
        note: note.trim() || undefined,
      });
      toast.success(revision ? "Extra work sent" : "Quote sent", {
        description: `${booking.customerName} will be asked to approve ${revision ? "an extra " : ""}${formatCurrency(total)}.`,
      });
      onSubmitted();
    } catch (err) {
      toast.error("Couldn't send the quote", { description: getErrorMessage(err) });
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-brand-200 bg-white p-5">
      <p className="font-semibold text-neutral-900">{revision ? "Extra work" : "New quote"}</p>
      <p className="mt-0.5 text-sm text-neutral-500">
        {revision
          ? "List only the additional work and materials. Once the customer approves, it is added to the current bill."
          : "List labour and materials separately so the customer can see what they're paying for."}
      </p>

      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.key} className="rounded-xl bg-neutral-50 p-3">
            <div className="grid gap-2 sm:grid-cols-[120px_minmax(0,1fr)]">
              <select
                value={item.type}
                onChange={(e) => update(item.key, "type", e.target.value)}
                aria-label="Item type"
                className={inputClassName}
              >
                {QUOTE_ITEM_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                maxLength={150}
                value={item.description}
                onChange={(e) => update(item.key, "description", e.target.value)}
                placeholder={item.type === "MATERIAL" ? "e.g. 6A modular switch" : "e.g. Replace switchboard"}
                aria-label="Description"
                className={inputClassName}
              />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <label className="flex items-center gap-1.5 whitespace-nowrap text-xs text-neutral-500">
                Qty
                <input
                  type="number"
                  min="1"
                  max="100"
                  inputMode="numeric"
                  value={item.quantity}
                  onChange={(e) => update(item.key, "quantity", e.target.value)}
                  className={cn(inputClassName, "h-10 w-16 px-2")}
                />
              </label>
              <label className="flex min-w-0 flex-1 items-center gap-1.5 whitespace-nowrap text-xs text-neutral-500">
                Price ₹
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  value={item.unitPrice}
                  onChange={(e) => update(item.key, "unitPrice", e.target.value)}
                  placeholder="0"
                  className={cn(inputClassName, "h-10 px-2")}
                />
              </label>
              <span className="w-20 text-right text-sm font-semibold text-neutral-900">{formatCurrency(lineTotal(item))}</span>
              <button
                type="button"
                onClick={() => setItems((list) => list.filter((i) => i.key !== item.key))}
                aria-label="Remove item"
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-neutral-400 hover:bg-white hover:text-red-600"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
            {errors[item.key] && <p className="mt-1.5 text-xs font-medium text-red-600">{errors[item.key]}</p>}
          </li>
        ))}
      </ul>

      {items.length < 20 && (
        <button
          type="button"
          onClick={() => setItems((list) => [...list, newItem()])}
          className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-brand-700 hover:bg-brand-50"
        >
          <Plus className="size-4" />
          Add item
        </button>
      )}

      <label className="mt-3 block">
        <span className="text-sm font-medium text-neutral-700">Note for the customer (optional)</span>
        <textarea
          rows={2}
          maxLength={500}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. The board is burnt and needs replacing for safety."
          className={cn(inputClassName, "mt-1.5 h-auto resize-none py-2.5")}
        />
      </label>

      <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
        <span className="text-sm text-neutral-500">{revision ? "Extra amount" : "Quote total"}</span>
        <span className="text-xl font-bold text-neutral-900">{formatCurrency(total)}</span>
      </div>
      {errors.form && <p className="mt-2 text-sm font-medium text-red-600">{errors.form}</p>}

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="h-10 rounded-full px-4 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60"
        >
          {saving && <Loader2 className="size-4 animate-spin" />}
          {revision ? "Send extra work" : "Send quote"}
        </button>
      </div>
    </form>
  );
}
