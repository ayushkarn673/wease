import { ChevronRight } from "lucide-react";
import { ACCOUNT_TYPES, ACCOUNT_TYPE_KEYS } from "@/lib/accountTypes";

// First step of sign-up: one large card per way of using Wease.
export default function AccountTypeChooser({ onChoose }) {
  return (
    <div className="space-y-3">
      {ACCOUNT_TYPE_KEYS.map((key) => {
        const { icon: Icon, choice, choiceText } = ACCOUNT_TYPES[key];
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChoose(key)}
            className="group flex w-full items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4 text-left transition hover:border-brand-500 hover:bg-brand-50/50 hover:shadow-sm focus-visible:border-brand-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15 sm:p-5"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-700 group-hover:text-white">
              <Icon className="size-6" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-neutral-900">{choice}</span>
              <span className="mt-0.5 block text-sm leading-snug text-neutral-500">{choiceText}</span>
            </span>
            <ChevronRight className="size-5 shrink-0 text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-brand-700" />
          </button>
        );
      })}
    </div>
  );
}
