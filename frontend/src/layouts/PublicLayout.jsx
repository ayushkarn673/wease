import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";

export default function PublicLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-neutral-900">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
