import BrandLogo from "../components/shared/BrandLogo";
import { ACCOUNT_TYPES } from "@/lib/accountTypes";

// `accountType` (customer, worker or firm) picks what the side panel says to that person.
export default function AuthLayout({ children, accountType = "customer" }) {
  const { heading, text, points } = (ACCOUNT_TYPES[accountType] ?? ACCOUNT_TYPES.customer).panel;
  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[1fr_1.1fr]">
      <aside className="hidden bg-brand-600 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <BrandLogo inverted />
        </div>

        <div className="max-w-md">
          <h2 className="text-5xl font-black leading-[1.05] tracking-tight">{heading}</h2>
          <p className="mt-5 text-lg text-brand-100">{text}</p>
          <ul className="mt-10 space-y-6">
            {points.map(({ icon: Icon, title, text: detail }) => (
              <li key={title} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="text-sm text-brand-200">{detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-brand-200">© {new Date().getFullYear()} Wease</p>
      </aside>

      <main className="flex flex-col px-4 py-8 sm:px-8">
        <div className="lg:hidden">
          <BrandLogo />
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </main>
    </div>
  );
}
