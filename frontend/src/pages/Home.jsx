import PublicLayout from "../layouts/PublicLayout";
import Hero from "../components/landing/Hero";
import SearchCard from "../components/landing/SearchCard";
import Services from "../components/landing/Services";
import WhyWease from "../components/landing/WhyWease";
import HowItWorks from "../components/landing/HowItWorks";
import TopWorkers from "../components/landing/TopWorkers";
import Testimonials from "../components/landing/Testimonials";
import CallToAction from "../components/landing/CallToAction";

export default function Home() {
  return (
    <PublicLayout>
      <Hero />
      <SearchCard />
      <Services />
      <WhyWease />
      <HowItWorks />
      <TopWorkers />
      <Testimonials />
      <CallToAction />
    </PublicLayout>
  );
}
