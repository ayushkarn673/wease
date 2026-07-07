export default function AvailabilityToggle({ available, onToggle, disabled }) {
  return (
    <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2">
        <span className={`h-3.5 w-3.5 rounded-full ${available ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}></span>
        <span className="font-bold text-sm text-gray-700">
          {available ? "🟢 Online & Available" : "🔴 Offline & Unavailable"}
        </span>
      </div>

      <button
        onClick={() => onToggle(!available)}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
          available ? "bg-indigo-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            available ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
