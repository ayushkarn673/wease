import { Link } from "react-router-dom";
import { CalendarCheck2, ChevronRight, Mail, UserCog } from "lucide-react";
import PublicLayout from "../layouts/PublicLayout";
import PublicHeader from "../components/shared/PublicHeader";
import SectionHeader from "../components/shared/SectionHeader";

// TODO: replace with the real support inbox before launch.
const SUPPORT_EMAIL = "support@wease.com";

const TOPICS = [
  { icon: CalendarCheck2, title: "Help with a booking", text: "Include your booking number so we can find it quickly." },
  { icon: UserCog, title: "Account access", text: "Write from the email address registered on your account." },
];

export default function Contact() {
  return (
    <PublicLayout>
      <PublicHeader
        eyebrow="Contact"
        title="How can we help?"
        description="Questions about a booking, your account, or joining as a professional? Email us and we'll get back to you."
      />
      <section className="mx-auto max-w-3xl space-y-8 px-4 pb-16 pt-10 sm:px-6">
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="group flex items-center gap-4 rounded-2xl border border-neutral-200/80 bg-white p-4 transition hover:ring-2 hover:ring-brand-200"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Mail className="size-6" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm text-neutral-500">Email us</span>
            <span className="block truncate text-lg font-semibold text-neutral-900">{SUPPORT_EMAIL}</span>
          </span>
          <ChevronRight className="size-5 text-neutral-400 group-hover:text-brand-600" />
        </a>

        <div>
          <SectionHeader title="Before you write" />
          <div className="grid gap-3 sm:grid-cols-2">
            {TOPICS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-neutral-200/80 bg-white p-5">
                <span className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon className="size-5" />
                </span>
                <p className="mt-3 font-semibold text-neutral-900">{title}</p>
                <p className="mt-1 text-sm text-neutral-500">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-neutral-500">
          Looking to offer your services?{" "}
          <Link to="/register?role=worker" className="font-semibold text-brand-600 hover:text-brand-700">Create a professional account</Link>.
        </p>
      </section>
    </PublicLayout>
  );
}
