import { PROFESSIONS } from "@/lib/format";
import SectionHeader from "../shared/SectionHeader";
import ServiceCard from "../shared/ServiceCard";
import Reveal from "../shared/Reveal";

// Photo-led category grid.
export default function Services() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
      <SectionHeader title="Browse services" subtitle="Pick a category to see who's available" to="/workers" />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {PROFESSIONS.map(({ value, label, description }, i) => (
          <Reveal key={value} index={i}>
            <ServiceCard to={`/workers?profession=${value}`} label={label} profession={value} description={description} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
