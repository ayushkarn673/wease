const steps = [
  "PENDING",
  "ACCEPTED",
  "IN_PROGRESS",
  "COMPLETED",
];

export default function BookingTimeline({ status }) {
  const current = steps.indexOf(status);

  return (
    <div className="mt-8 flex justify-between">

      {steps.map((step, index) => (

        <div
          key={step}
          className="flex flex-col items-center flex-1"
        >

          <div
            className={`w-5 h-5 rounded-full ${
              index <= current
                ? "bg-green-500"
                : "bg-gray-300"
            }`}
          />

          <p className="text-xs mt-2 text-center">
            {step.replace("_", " ")}
          </p>

        </div>

      ))}

    </div>
  );
}
