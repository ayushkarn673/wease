import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
        {children}
      </main>
      <Footer />
    </>
  );
}
