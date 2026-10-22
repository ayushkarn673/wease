// Shared Tailwind class strings for form controls.
export const inputClassName =
  "h-11 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-500";

export const textareaClassName = inputClassName.replace("h-11", "min-h-28 py-2.5 resize-y");
