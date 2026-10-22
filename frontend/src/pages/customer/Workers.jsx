import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { LayoutGrid, List, Map as MapIcon, MapPin, Search, SearchX, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PROFESSIONS, professionLabel } from "@/lib/format";
import { MARKETING_PHOTOS, serviceImage, unsplashUrl } from "@/lib/media";
import { getAvailableWorkers } from "../../services/workerService";
import { useAsync } from "../../hooks/useAsync";
import { useCity } from "../../context/city";
import WorkerCard from "../../components/customer/WorkerCard";
import WorkersMap from "../../components/map/WorkersMap";
import HeroPanel from "../../components/shared/HeroPanel";
import Reveal from "../../components/shared/Reveal";
import { CardGridSkeleton, EmptyState, ErrorState } from "../../components/shared/States";

const ALL = { value: "", label: "All services", icon: LayoutGrid, tint: { soft: "bg-brand-50 text-brand-700" } };
const OPTIONS = [ALL, ...PROFESSIONS];

// The professionals directory, open to everyone at /workers.
export default function Workers() {
  const [params, setParams] = useSearchParams();
  const profession = params.get("profession") || "";
  const q = params.get("q") || "";

  const [searchText, setSearchText] = useState(q);
  const { city, setCity, location, setLocation } = useCity();
  const [view, setView] = useState("list");

  const setParam = useCallback(
    (key, value) => {
      const next = new URLSearchParams(params);
      if (value) next.set(key, value);
      else next.delete(key);
      setParams(next, { replace: true });
    },
    [params, setParams]
  );

  const loader = useCallback(
    () =>
      getAvailableWorkers({
        profession: profession || undefined,
        q: q || undefined,
        // An exact location finds professionals whose 10 km area covers it; otherwise browse by city.
        ...(location ? { lat: location.lat, lng: location.lng } : { city: city || undefined }),
      }),
    [profession, q, city, location]
  );
  const { status, data, reload } = useAsync(loader);
  const workers = useMemo(() => data ?? [], [data]);

  // Debounce the name search into the URL.
  useEffect(() => {
    const id = setTimeout(() => {
      if (searchText.trim() !== q) setParam("q", searchText.trim());
    }, 350);
    return () => clearTimeout(id);
  }, [searchText, q, setParam]);

  // Nearest first when searching by location (the server sorts); otherwise verified, then most experienced.
  const visible = useMemo(
    () =>
      location
        ? workers
        : [...workers].sort((a, b) => Number(b.verified) - Number(a.verified) || (b.experience ?? 0) - (a.experience ?? 0)),
    [workers, location]
  );

  const hasFilters = profession || q;
  const heroImage = serviceImage(profession, 1200) ?? unsplashUrl(MARKETING_PHOTOS.painting, 1200);

  function clearFilters() {
    setSearchText("");
    setParams(new URLSearchParams(), { replace: true });
  }

  return (
    <div className="space-y-8">
      <HeroPanel image={heroImage}>
        <p className="text-sm font-medium text-white/70">{profession ? "Service" : "Directory"}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
          {profession ? `${professionLabel(profession)}s` : "Find a professional"}
        </h1>
        <p className="mt-2 max-w-md text-white/75">
          Compare experience and visiting charges, then book a time that suits you.
        </p>
        <label className="mt-6 flex max-w-lg items-center gap-3 rounded-full bg-white px-5 shadow-lg shadow-black/10">
          <Search className="size-5 shrink-0 text-neutral-400" />
          <span className="sr-only">Search by name</span>
          <input
            type="search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search professionals by name"
            className="h-13 min-w-0 flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
          />
        </label>
      </HeroPanel>

      <div className="lg:grid lg:grid-cols-[230px_minmax(0,1fr)] lg:items-start lg:gap-8">
        <aside className="hidden lg:sticky lg:top-24 lg:block" aria-label="Services">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">Services</p>
          <nav className="space-y-0.5">
            {OPTIONS.map(({ value, label, icon: Icon, tint }) => (
              <button
                key={value || "all"}
                type="button"
                onClick={() => setParam("profession", value)}
                aria-current={profession === value ? "true" : undefined}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium transition",
                  profession === value ? "bg-white text-brand-700 shadow-sm ring-1 ring-neutral-200" : "text-neutral-600 hover:bg-white/70 hover:text-neutral-900"
                )}
              >
                <span className={cn("flex size-8 items-center justify-center rounded-lg", tint.soft)}>
                  <Icon className="size-4" />
                </span>
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 space-y-5">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0 lg:hidden [&::-webkit-scrollbar]:hidden">
            {OPTIONS.map(({ value, label, icon: Icon }) => (
              <button
                key={value || "all"}
                type="button"
                onClick={() => setParam("profession", value)}
                className={cn(
                  "inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition",
                  profession === value
                    ? "border-brand-700 bg-brand-700 text-white"
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                )}
              >
                <Icon className="size-4" />
                {value ? label : "All"}
              </button>
            ))}
          </div>

          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 sm:text-xl">
                {status === "ready"
                  ? `${visible.length} ${visible.length === 1 ? "professional" : "professionals"} ${
                      location ? `within 10 km of ${location.label}` : `available${city ? ` in ${city}` : ""}`
                    }`
                  : "Professionals"}
              </h2>
              <p className="text-sm text-neutral-500">
                {profession ? professionLabel(profession) : "All services"}
                {q && <> · matching “{q}”</>}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex h-9 items-center gap-1 rounded-full px-3 text-sm font-medium text-brand-700 hover:bg-brand-50"
                >
                  <X className="size-4" />
                  Clear
                </button>
              )}
              <div className="inline-flex rounded-full border border-neutral-200 bg-white p-0.5" role="tablist" aria-label="View">
                {[
                  { key: "list", label: "List", icon: List },
                  { key: "map", label: "Map", icon: MapIcon },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={view === key}
                    onClick={() => setView(key)}
                    className={cn(
                      "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition",
                      view === key ? "bg-brand-700 text-white" : "text-neutral-600 hover:text-neutral-900"
                    )}
                  >
                    <Icon className="size-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {status === "loading" && <CardGridSkeleton count={4} className="" />}
          {status === "error" && <ErrorState message="We couldn't load professionals right now." onRetry={reload} />}
          {status === "ready" && visible.length === 0 && location && (
            <EmptyState
              icon={MapPin}
              title={`No professionals cover ${location.label} yet`}
              description="Professionals serve within 10 km of their base. Try a nearby location, or browse the whole city."
              action={
                <button type="button" onClick={() => setLocation(null)} className="rounded-full bg-brand-700 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-800">
                  Clear my location
                </button>
              }
            />
          )}
          {status === "ready" && visible.length === 0 && !location && city && !hasFilters && (
            <EmptyState
              icon={MapPin}
              title={`No professionals in ${city} yet`}
              description="We're adding professionals city by city. You can browse every city in the meantime."
              action={
                <button type="button" onClick={() => setCity(null)} className="rounded-full bg-brand-700 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-800">
                  Show all cities
                </button>
              }
            />
          )}
          {status === "ready" && visible.length === 0 && !location && !(city && !hasFilters) && (
            <EmptyState
              icon={SearchX}
              title="No professionals match your search"
              description={hasFilters ? "Try a different service or remove some filters." : "Check back soon — new professionals join regularly."}
              action={
                hasFilters && (
                  <button type="button" onClick={clearFilters} className="rounded-full bg-brand-700 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-800">
                    Clear filters
                  </button>
                )
              }
            />
          )}
          {status === "ready" && visible.length > 0 && view === "map" && <WorkersMap workers={visible} location={location} city={city} />}
          {status === "ready" && visible.length > 0 && view === "list" && (
            <div className="border-t border-neutral-200/80">
              {visible.map((worker, i) => (
                <Reveal key={worker.id} index={i} className="min-w-0">
                  <WorkerCard worker={worker} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
