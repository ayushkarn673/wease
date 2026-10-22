import { useCallback } from "react";
import { useAsync } from "../../hooks/useAsync";
import { useCity } from "../../context/city";
import { getAvailableWorkers } from "../../services/workerService";
import WorkerCard from "../customer/WorkerCard";
import SectionHeader from "../shared/SectionHeader";
import { CardGridSkeleton } from "../shared/States";
import Reveal from "../shared/Reveal";

async function loadPopular(city, location) {
  const data = await getAvailableWorkers(location ? { lat: location.lat, lng: location.lng } : { city: city || undefined });
  return [...data]
    .sort((a, b) => Number(b.verified) - Number(a.verified) || (b.experience ?? 0) - (a.experience ?? 0))
    .slice(0, 6);
}

// Real professionals from the API, in the visitor's chosen city. The section hides itself if there is
// nothing to show.
export default function TopWorkers() {
  const { city, location } = useCity();
  const loader = useCallback(() => loadPopular(city, location), [city, location]);
  const { status, data: workers = [] } = useAsync(loader);

  if (status === "error" || (status === "ready" && workers.length === 0)) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
      <SectionHeader
        title={city ? `Professionals available in ${city}` : "Professionals available now"}
        subtitle="Accepting new bookings"
        to="/workers"
      />
      {status === "loading" ? (
        <CardGridSkeleton count={4} />
      ) : (
        <div className="grid border-t border-neutral-200/80 lg:grid-cols-2 lg:gap-x-12">
          {workers.map((worker, i) => (
            <Reveal key={worker.id} index={i} className="min-w-0">
              <WorkerCard worker={worker} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
