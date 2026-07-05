import WorkerCard from "./WorkerCard";

export default function WorkerGrid({ workers = [], onBook }) {
  if (workers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
        <span className="text-4xl">🔍</span>
        <h4 className="text-lg font-bold text-slate-800 dark:text-white mt-4">
          No workers found
        </h4>
        <p className="text-sm text-slate-500 mt-1 max-w-xs font-semibold">
          Try adjusting your search keywords or choosing a different category.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white">
        Nearby Workers
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {workers.map((worker) => (
          <WorkerCard
            key={worker.id}
            worker={worker}
            onBook={onBook}
          />
        ))}
      </div>
    </div>
  );
}
