import React from "react";

export default function DashboardStats({
  title,
  value,
  icon,
  color = "text-blue-600",
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-slate-500">{title}</p>

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
