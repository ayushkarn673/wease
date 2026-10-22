import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Search } from "lucide-react";
import { PROFESSIONS } from "@/lib/format";

// Hero search. Sends people to the public directory with filters applied.
export default function SearchCard() {
  const navigate = useNavigate();
  const [profession, setProfession] = useState("");
  const [query, setQuery] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (profession) params.set("profession", profession);
    if (query.trim()) params.set("q", query.trim());
    navigate(`/workers${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl shadow-neutral-900/[0.06] sm:flex-row sm:items-center sm:gap-0 sm:rounded-full"
    >
      <label className="relative sm:w-52">
        <span className="sr-only">Service</span>
        <select
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
          className="h-12 w-full appearance-none rounded-full bg-neutral-50 pl-5 pr-10 text-sm font-semibold text-neutral-900 outline-none sm:bg-transparent"
        >
          <option value="">All services</option>
          {PROFESSIONS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
      </label>
      <span className="hidden h-7 w-px bg-neutral-200 sm:block" />
      <label className="flex flex-1 items-center gap-3 px-4">
        <Search className="size-5 shrink-0 text-neutral-400" />
        <span className="sr-only">Search by name</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Professional's name (optional)"
          className="h-12 min-w-0 flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
        />
      </label>
      <button
        type="submit"
        className="h-12 rounded-full bg-brand-700 px-8 text-sm font-semibold text-white transition hover:bg-brand-800"
      >
        Search
      </button>
    </form>
  );
}
