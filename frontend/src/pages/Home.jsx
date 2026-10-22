import PublicLayout from "../layouts/PublicLayout";
import Hero from "../components/landing/Hero";
import Services from "../components/landing/Services";
import TopWorkers from "../components/landing/TopWorkers";
import HowItWorks from "../components/landing/HowItWorks";
import WhyWease from "../components/landing/WhyWease";
import CallToAction from "../components/landing/CallToAction";

export default function Home() {
  return (
    <PublicLayout>
      <Hero />
      <Services />
      <TopWorkers />
      <HowItWorks />
      <WhyWease />
      <CallToAction />
    </PublicLayout>
  );
}
