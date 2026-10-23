import { Link } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Shown when a visitor who isn't signed in tries to book. Both buttons bring them back to `returnTo`.
export default function SignInPrompt({ open, onOpenChange, title, description, returnTo, media, note, children }) {
  const state = { from: returnTo };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 sm:max-w-md">
        <DialogHeader className="items-center p-6 pb-2 text-center">
          {media}
          <DialogTitle className="mt-3 text-xl font-semibold text-neutral-900">{title}</DialogTitle>
          <DialogDescription className="text-sm text-neutral-500">
            {description ?? "Log in or create a free account to send your request. It takes less than a minute."}
          </DialogDescription>
        </DialogHeader>

        {children && <div className="mx-6 rounded-xl bg-neutral-50 p-3.5 text-sm text-neutral-600">{children}</div>}

        <div className="space-y-2 p-6">
          <Link
            to="/register?role=customer"
            state={state}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-700 text-sm font-semibold text-white transition hover:bg-brand-800"
          >
            <UserPlus className="size-4" />
            Create an account
          </Link>
          <Link
            to="/login"
            state={state}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-neutral-300 text-sm font-semibold text-neutral-800 transition hover:border-brand-600 hover:text-brand-700"
          >
            <LogIn className="size-4" />
            I already have an account
          </Link>
          {note && <p className="pt-1 text-center text-xs text-neutral-500">{note}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}