import { Link, useNavigate } from "react-router-dom";
import { BadgeIndianRupee, MapPin, UsersRound } from "lucide-react";
import { PARTNER_TYPES } from "@/lib/accountTypes";
import AuthLayout from "../../layouts/AuthLayout";
import AccountTypeChooser from "../../components/auth/AccountTypeChooser";

const PANEL = {
  heading: "Grow your work with Wease.",
  text: "Customers near you book professionals and hire crews on Wease every day.",
  points: [
    { icon: MapPin, title: "Local jobs", text: "Professionals get requests within 10 km; firms cover their city." },
    { icon: BadgeIndianRupee, title: "Your prices", text: "Set your visiting charge or daily rates and quote each job." },
    { icon: UsersRound, title: "Free to join", text: "A small fee applies to labour only, never to materials." },
  ],
};

// Sign-up for professionals and labour firms. Customer pages don't link here; the link is shared
// with workers and firms directly (e.g. wease-web.onrender.com/join).
export default function Join() {
  const navigate = useNavigate();

  return (
    <AuthLayout panel={PANEL}>
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Work with Wease</h1>
      <p className="mt-2 text-sm text-neutral-500">Get jobs from customers near you. How do you work?</p>
      <div className="mt-8">
        <AccountTypeChooser types={PARTNER_TYPES} onChoose={(key) => navigate(`/register?role=${key}`)} />
      </div>
      <p className="mt-8 text-center text-sm text-neutral-500">
        Already working with Wease?{" "}
        <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
