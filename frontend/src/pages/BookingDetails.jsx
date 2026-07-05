import { useParams } from "react-router-dom";

export default function BookingDetails() {
  const { id } = useParams();
  
  return (
    <div className="min-h-screen p-8 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900">Booking Details</h1>
        <p className="mt-2 text-slate-600">Viewing information for Booking ID: <span className="font-semibold text-slate-900">{id}</span></p>
      </div>
    </div>
  );
}
