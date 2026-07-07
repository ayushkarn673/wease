export default function DashboardStats({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between transition hover:shadow-md">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {title}
        </p>
        <h3 className="text-2xl font-black text-gray-800 mt-1">
          {value}
        </h3>
      </div>
      {icon && (
        <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
          {icon}
        </div>
      )}
    </div>
  );
}
