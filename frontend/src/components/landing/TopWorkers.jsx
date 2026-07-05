import WorkerCard from "../ui/WorkerCard";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";

const workers = [
  {
    name: "Rahul Sharma",
    profession: "Carpenter",
    experience: 8,
    rating: 4.9,
    reviews: 124,
    price: 499,
    distance: "2.3 km",
    image: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=600",
  },
  {
    name: "Aman Gupta",
    profession: "Painter",
    experience: 6,
    rating: 4.8,
    reviews: 98,
    price: 599,
    distance: "1.8 km",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600",
  },
  {
    name: "Sanjay Kumar",
    profession: "Plumber",
    experience: 9,
    rating: 4.9,
    reviews: 154,
    price: 449,
    distance: "3.1 km",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600",
  },
  {
    name: "Neha Verma",
    profession: "Cleaner",
    experience: 4,
    rating: 4.9,
    reviews: 201,
    price: 299,
    distance: "0.8 km",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600",
  },
];

export default function TopWorkers() {
  return (
    <section className="py-24 bg-white dark:bg-slate-950 border-b border-slate-200/55 dark:border-slate-900">
      <Container>
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="rounded-full bg-blue-100 dark:bg-blue-900/35 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-400">
            Top Professionals
          </span>

          <h2 className="mt-6 text-5xl font-bold text-slate-900 dark:text-white">
            Top Rated Professionals
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
            Book verified local experts based on real customer ratings and reviews.
          </p>
        </div>

        {/* Workers Grid */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {workers.map((worker) => (
            <WorkerCard key={worker.name} {...worker} />
          ))}
        </div>
      </Container>
    </section>
  );
}
