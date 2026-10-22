import PublicLayout from "../layouts/PublicLayout";
import PublicHeader from "../components/shared/PublicHeader";
import ServicesSection from "../components/landing/Services";
import HowItWorks from "../components/landing/HowItWorks";
import CallToAction from "../components/landing/CallToAction";

export default function Services() {
  return (
    <PublicLayout>
      <PublicHeader
        eyebrow="Services"
        title="What do you need help with?"
        description="Choose a category to see professionals who are available to take your booking."
      />
      <ServicesSection />
      <HowItWorks />
      <CallToAction />
    </PublicLayout>
  );
}
