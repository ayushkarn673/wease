import { useEffect, useState } from "react";
import { getAvailableWorkers } from "../../services/workerService";
import WorkerCard from "./WorkerCard";

export default function WorkerGrid() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkers();
  }, []);

  async function loadWorkers() {
    try {
      const data = await getAvailableWorkers();
      setWorkers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p>Loading workers...</p>;
  }

  if (workers.length === 0) {
    return <p>No workers available.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {workers.map((worker) => (
        <WorkerCard
          key={worker.id}
          worker={worker}
        />
      ))}
    </div>
  );
}
