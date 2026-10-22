import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { getErrorMessage } from "@/lib/format";
import { textareaClassName } from "@/lib/styles";
import StarInput from "./StarInput";
import StarRating from "./StarRating";

// After a completed job, the customer rates the professional or firm once.
// `submit({ rating, comment })` saves the rating; `existingRating` shows what they already gave.
export default function RateCard({ name, existingRating, submit, onRated }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (existingRating) {
    return (
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-5">
        <p className="text-sm text-neutral-500">You rated {name}</p>
        <StarRating value={existingRating} size="size-5" className="mt-1.5" />
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!rating) return setError("Choose 1 to 5 stars");
    setSaving(true);
    try {
      await submit({ rating, comment: comment.trim() || undefined });
      toast.success("Thanks for your rating", { description: `It helps others choose ${name}.` });
      onRated(rating);
    } catch (err) {
      toast.error("Couldn't save your rating", { description: getErrorMessage(err) });
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
      <p className="font-semibold text-neutral-900">How was {name}?</p>
      <p className="text-sm text-neutral-500">Your rating appears on their page.</p>
      <div className="mt-3">
        <StarInput value={rating} onChange={(n) => { setRating(n); setError(""); }} disabled={saving} />
      </div>
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
      <textarea
        rows={3}
        maxLength={1000}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Tell others about the work (optional)"
        aria-label="Review (optional)"
        className={`${textareaClassName} mt-3 bg-white`}
      />
      <button type="submit" disabled={saving} className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-brand-700 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60">
        {saving && <Loader2 className="size-4 animate-spin" />}
        Submit rating
      </button>
    </form>
  );
}