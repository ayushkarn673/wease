import { ShieldCheck, Clock3, BadgeCheck } from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">

      {/* Left Side */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 text-white p-12">

        <div>
          <div className="flex items-center gap-3">

            <div className="h-12 w-12 rounded-xl bg-white text-blue-600 flex items-center justify-center text-2xl font-bold">
              W
            </div>

            <h1 className="text-3xl font-bold">
              Wease
            </h1>

          </div>

          <h2 className="mt-16 text-5xl font-bold leading-tight">
            Work Made Easy.
          </h2>

          <p className="mt-6 text-lg text-blue-100 max-w-md">
            Book trusted professionals for every home service in just a few clicks.
          </p>
        </div>

        <div className="space-y-8">

          <div className="flex gap-4">
            <ShieldCheck size={28} />
            <div>
              <h3 className="font-semibold">Verified Workers</h3>
              <p className="text-blue-100">
                Every professional is verified before joining.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Clock3 size={28} />
            <div>
              <h3 className="font-semibold">Quick Booking</h3>
              <p className="text-blue-100">
                Hire skilled workers within minutes.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <BadgeCheck size={28} />
            <div>
              <h3 className="font-semibold">Trusted Platform</h3>
              <p className="text-blue-100">
                Secure booking and transparent reviews.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Right Side */}

      <div className="flex items-center justify-center p-6 lg:p-12">

        <div className="w-full max-w-md">
          {children}
        </div>

      </div>

    </div>
  );
}
