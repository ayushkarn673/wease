import PublicLayout from "../layouts/PublicLayout";
import { Container } from "@/components/ui/Container";

export default function Contact() {
  return (
    <PublicLayout>
      <Container className="py-20">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Contact Us</h1>
        <p className="mt-4 text-slate-655 dark:text-slate-400">
          Have questions or need assistance? Reach out to our 24/7 support team at support@wease.com.
        </p>
      </Container>
    </PublicLayout>
  );
}
