import { Star, Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Testimonials() {
  const reviews = [
    {
      name: "Daniel Carter",
      role: "Homeowner",
      avatar: "",
      initials: "DC",
      rating: 5,
      text: "Wease has completely changed how I book helpers. I needed an emergency electrician and found a verified professional in 10 minutes. The pricing was transparent and the service was outstanding!",
    },
    {
      name: "Marcus Miller",
      role: "Certified Plumber",
      avatar: "",
      initials: "MM",
      rating: 5,
      text: "As a worker, Wease makes it incredibly easy to find verified local clients and get paid securely. The calendar scheduling and automatic payouts have saved me hours of administration.",
    },
    {
      name: "Sophia Martinez",
      role: "Property Manager",
      avatar: "",
      initials: "SM",
      rating: 5,
      text: "I manage over 20 rental properties, and Wease is my go-to for repairs. From cleaners to carpenters, every professional is highly skilled, verified, and punctual. Highly recommended!",
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-white dark:bg-slate-950">
      <Container>
        {/* Section Header */}
        <SectionTitle
          title="What Our Community Says"
          subtitle="Read verified reviews from clients and service professionals using Wease."
          align="center"
        />

        {/* Reviews Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <Card
              key={index}
              className="relative bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-8 flex flex-col justify-between hover:shadow-md transition-shadow duration-300"
            >
              {/* Quote Icon Background */}
              <Quote className="absolute top-6 right-8 size-10 text-slate-200/80 dark:text-slate-800/80 pointer-events-none" />

              <div>
                {/* Rating stars */}
                <div className="flex gap-1 text-amber-500 mb-5">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-500" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 italic leading-relaxed">
                  "{review.text}"
                </p>
              </div>

              {/* User details */}
              <div className="mt-8 flex items-center gap-4">
                <Avatar className="h-10 w-10 border border-slate-200/60 dark:border-slate-800/60">
                  <AvatarImage src={review.avatar} alt={review.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold">
                    {review.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {review.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {review.role}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
