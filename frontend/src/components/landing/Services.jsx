import {
  Hammer,
  Paintbrush,
  Wrench,
  Zap,
  Brush,
  Construction,
  AirVent,
  Truck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ServiceCard from "../ui/ServiceCard";

const services = [
  {
    title: "Carpenter",
    description: "Furniture repair, modular work and custom wood projects.",
    workers: 320,
    Icon: Hammer,
  },
  {
    title: "Painter",
    description: "Interior, exterior and texture painting services.",
    workers: 240,
    Icon: Paintbrush,
  },
  {
    title: "Electrician",
    description: "Home wiring, appliances and electrical maintenance.",
    workers: 185,
    Icon: Zap,
  },
  {
    title: "Plumber",
    description: "Leak repair, bathroom fitting and pipe installation.",
    workers: 210,
    Icon: Wrench,
  },
  {
    title: "Cleaner",
    description: "Deep cleaning for homes and offices.",
    workers: 280,
    Icon: Brush,
  },
  {
    title: "Mason",
    description: "Construction and renovation specialists.",
    workers: 130,
    Icon: Construction,
  },
  {
    title: "AC Repair",
    description: "AC installation, servicing and repairs.",
    workers: 155,
    Icon: AirVent,
  },
  {
    title: "Labour",
    description: "Daily labour for residential and commercial work.",
    workers: 400,
    Icon: Truck,
  },
];

export default function Services() {
  const navigate = useNavigate();

  const handleCardClick = (title) => {
    navigate(`/customer/workers?service=${title}`);
  };

  return (
    <section className="bg-slate-50 dark:bg-slate-950/20 py-24 border-b border-slate-200/55 dark:border-slate-900">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <span className="rounded-full bg-blue-100 dark:bg-blue-900/35 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-400">
            Services
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900 dark:text-white">
            Popular Services
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
            Book trusted professionals for every home service with just a few clicks.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => (
            <div key={service.title} onClick={() => handleCardClick(service.title)}>
              <ServiceCard {...service} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
