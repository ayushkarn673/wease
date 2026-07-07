export default function StatusBadge({ status }) {
  const getColors = () => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200/50";
      case "ACCEPTED":
        return "bg-blue-50 text-blue-700 border-blue-200/50";
      case "REJECTED":
        return "bg-rose-50 text-rose-700 border-rose-200/50";
      case "IN_PROGRESS":
        return "bg-violet-50 text-violet-700 border-violet-200/50";
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/50";
      case "CANCELLED":
        return "bg-gray-50 text-gray-600 border-gray-200/50";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200/50";
    }
  };

  return (
    <span className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold border ${getColors()}`}>
      {status}
    </span>
  );
}
