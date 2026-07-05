import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function WorkerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
      <div>
        <Navbar />
        <main className="py-12">
          <Container className="max-w-3xl">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 shadow-sm">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Worker Profile</h1>
              <p className="mt-2 text-slate-500">Viewing profile details for Worker ID: <span className="font-semibold text-slate-900 dark:text-white">{id}</span></p>
              
              <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6">
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Services Offered</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["Plumbing", "Leaks Repair", "Installation"].map((s) => (
                    <span key={s} className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <Button
                  onClick={() => navigate(`/booking?worker=${id}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  Book Worker
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="border-slate-200 dark:border-slate-800"
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </Container>
        </main>
      </div>
      <Footer />
    </div>
  );
}
