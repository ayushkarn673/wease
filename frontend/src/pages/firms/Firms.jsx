import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Building2, LayoutGrid, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { PROFESSIONS, professionLabel } from "@/lib/format";
import { MARKETING_PHOTOS, unsplashUrl } from "@/lib/media";
import { searchFirms } from "../../services/firmService";
import { useAsync } from "../../hooks/useAsync";
import { useCity } from "../../context/city";
import HeroPanel from "../../components/shared/HeroPanel";
import Reveal from "../../components/shared/Reveal";
import FirmRow from "../../components/firm/FirmRow";
import { CardGridSkeleton, EmptyState, ErrorState } from "../../components/shared/States";

// Directory of labour firms that supply crews, open to everyone.
export default function Firms() {
  const [params, setParams] = useSearchParams();
  const profession = params.get("profession") || "";
  const { city, setCity } = useCity();

  const loader = useCallback(
    () => searchFirms({ profession: profession || undefined, city: city || undefined }),
    [profession, city]
  );
  const { status, data, reload } = useAsync(loader);
  const firms = useMemo(() => data ?? [], [data]);

  function setProfession(value) {
    const next = new URLSearchParams(params);
    if (value) next.set("profession", value);
    else next.delete("profession");
    setParams(next, { replace: true });
  }

  return (
    <div className="space-y-8">
      <HeroPanel image={unsplashUrl(MARKETING_PHOTOS.carpentry, 1200)}>
        <p className="text-sm font-medium text-white/70">Labour firms</p>
        <h1 className="mt-1 max-w-lg text-3xl font-bold tracking-tight sm:text-4xl">Need several workers? Hire a crew.</h1>
        <p className="mt-2 max-w-md text-white/75">
          Firms supply teams for shifting, construction and site work. See daily rates and your full estimate before you send a request.
        </p>
      </HeroPanel>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
        <Chip active={!profession} onClick={() => setProfession("")} icon={LayoutGrid}>
          All skills
        </Chip>
        {PROFESSIONS.map(({ value, label, icon }) => (
          <Chip key={value} active={profession === value} onClick={() => setProfession(value)} icon={icon}>
            {label}
          </Chip>
        ))}
      </div>

      <section>
        <h2 className="text-lg font-semibold text-neutral-900 sm:text-xl">
          {status === "ready" ? `${firms.length} ${firms.length === 1 ? "firm" : "firms"}${city ? ` in ${city}` : ""}` : "Firms"}
        </h2>
        <p className="mb-4 text-sm text-neutral-500">{profession ? `Supplying ${professionLabel(profession).toLowerCase()}s` : "All skills"}</p>

        {status === "loading" && <CardGridSkeleton count={3} className="" />}
        {status === "error" && <ErrorState message="We couldn't load firms right now." onRetry={reload} />}
        {status === "ready" && firms.length === 0 && (
          <EmptyState
            icon={city ? MapPin : Building2}
            title={city ? `No labour firms in ${city} yet` : "No labour firms yet"}
            description="Firms are joining city by city. Check back soon, or book an individual professional."
            action={
              city && (
                <button type="button" onClick={() => setCity(null)} className="rounded-full bg-brand-700 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-800">
                  Show all cities
                </button>
              )
            }
          />
        )}
        {status === "ready" && firms.length > 0 && (
          <div className="border-t border-neutral-200/80">
            {firms.map((firm, i) => (
              <Reveal key={firm.id} index={i} className="min-w-0">
                <FirmRow firm={firm} profession={profession} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Chip({ active, onClick, icon: Icon, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition",
        active ? "border-brand-700 bg-brand-700 text-white" : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
      )}
    >
      <Icon className="size-4" />
      {children}
    </button>
  );
}