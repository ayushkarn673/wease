export default function DashboardStats({
  title,
  value,
  icon,
  color = "text-blue-600",
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-lg transition">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {value}
          </h2>

        </div>

        <div className={`text-4xl ${color}`}>
          {icon}
        </div>

      </div>

    </div>
  );
}
