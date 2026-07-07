import { Check, X } from "lucide-react";

export default function BookingTimeline({ status }) {
  const steps = [
    { label: "Request Placed", key: "PENDING" },
    { label: "Worker Accepted", key: "ACCEPTED" },
    { label: "Service Completed", key: "COMPLETED" },
  ];

  const getStepStatus = (index) => {
    if (status === "REJECTED" || status === "CANCELLED") {
      if (index === 0) return "completed";
      if (index === 1) return "failed";
      return "upcoming";
    }

    if (status === "PENDING") {
      if (index === 0) return "active";
      return "upcoming";
    }

    if (status === "ACCEPTED" || status === "IN_PROGRESS") {
      if (index === 0) return "completed";
      if (index === 1) return "active";
      return "upcoming";
    }

    if (status === "COMPLETED") {
      return "completed";
    }

    return "upcoming";
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
      <h3 className="font-bold text-gray-800 mb-6 text-sm">Service Progress Tracker</h3>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-4 relative">
        {steps.map((step, idx) => {
          const stepState = getStepStatus(idx);
          
          return (
            <div key={idx} className="flex flex-row md:flex-col items-center gap-4 md:gap-3 flex-1 w-full last:flex-none">
              
              <div className="flex items-center w-full md:w-auto">
                {/* Circle step indicator */}
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center border-2 font-bold text-sm transition-all duration-300 ${
                    stepState === "completed"
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : stepState === "active"
                      ? "border-indigo-600 text-indigo-600 bg-indigo-50/50"
                      : stepState === "failed"
                      ? "bg-rose-600 border-rose-600 text-white"
                      : "border-gray-200 text-gray-400 bg-white"
                  }`}
                >
                  {stepState === "completed" ? (
                    <Check size={16} strokeWidth={3} />
                  ) : stepState === "failed" ? (
                    <X size={16} strokeWidth={3} />
                  ) : (
                    idx + 1
                  )}
                </div>

                {/* Progress bar line connecting to next step */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block flex-1 h-0.5 w-24 mx-4 bg-gray-100 relative overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 h-full bg-indigo-600 transition-all duration-500 ${
                        stepState === "completed" ? "w-full" : "w-0"
                      }`}
                    />
                  </div>
                )}
              </div>

              {/* Label details */}
              <div className="text-left md:text-center">
                <p
                  className={`font-semibold text-sm ${
                    stepState === "completed" || stepState === "active"
                      ? "text-gray-800"
                      : stepState === "failed"
                      ? "text-rose-600 font-bold"
                      : "text-gray-400"
                  }`}
                >
                  {stepState === "failed" ? (status === "REJECTED" ? "Request Rejected" : "Request Cancelled") : step.label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {stepState === "completed"
                    ? "Done"
                    : stepState === "active"
                    ? "In Progress"
                    : stepState === "failed"
                    ? "Cancelled"
                    : "Upcoming"}
                </p>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
