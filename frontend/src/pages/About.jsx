import PublicLayout from "../layouts/PublicLayout";
import { Container } from "@/components/ui/Container";

export default function About() {
  return (
    <PublicLayout>
      <Container className="py-20">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">About Wease</h1>
        <p className="mt-4 text-slate-650 dark:text-slate-400">
          Wease is a modern marketplace connecting homeowners with top-tier, background-checked local service workers.
        </p>
      </Container>
    </PublicLayout>
  );
}
