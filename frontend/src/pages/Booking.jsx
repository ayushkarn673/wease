import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function Booking() {
  const [searchParams] = useSearchParams();
  const workerId = searchParams.get("worker");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
      <div>
        <Navbar />
        <main className="py-12">
          <Container className="max-w-xl">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 shadow-sm">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Book a Service</h1>
              <p className="mt-2 text-sm text-slate-500">
                {workerId ? `You are booking Worker ID: ${workerId}` : "Please select a worker to continue."}
              </p>

              <div className="mt-8 flex flex-col gap-4">
                <Button
                  onClick={() => {
                    alert("Booking submitted successfully!");
                    navigate("/");
                  }}
                  disabled={!workerId}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm w-full py-6 rounded-xl"
                >
                  Confirm Booking
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="border-slate-200 dark:border-slate-800 w-full"
                >
                  Cancel
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
