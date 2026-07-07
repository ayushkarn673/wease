import { useState } from "react";
import { Calendar, Clock, MapPin, FileText, Sparkles } from "lucide-react";
import { createBooking } from "../../services/bookingService";

export default function BookingForm({ worker, onClose }) {
    const [bookingDate, setBookingDate] = useState("");
    const [bookingTime, setBookingTime] = useState("");
    const [serviceAddress, setServiceAddress] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        try {
            await createBooking({
                workerProfileId: worker.id,
                bookingDate,
                bookingTime: bookingTime ? `${bookingTime}:00` : "", // Format as HH:mm:ss for backend
                serviceAddress,
                description
            });
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create booking. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 animate-bounce">
                    <Sparkles size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Booking Requested!</h3>
                <p className="text-gray-500">Your request has been sent to {worker.fullName}.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    Preferred Date
                </label>
                <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                    min={new Date().toISOString().split("T")[0]}
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    Preferred Time
                </label>
                <input
                    type="time"
                    required
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" />
                    Service Address
                </label>
                <input
                    type="text"
                    required
                    placeholder="Enter service location address"
                    value={serviceAddress}
                    onChange={(e) => setServiceAddress(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FileText size={16} className="text-gray-400" />
                    Problem Description
                </label>
                <textarea
                    required
                    rows="3"
                    placeholder="Please describe the work required (e.g. wardrobe door hinges are broken, needs replacement)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition resize-none"
                />
            </div>

            <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                <div>
                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Estimated Price</span>
                    <span className="text-2xl font-black text-gray-800">₹{worker.hourlyRate} <span className="text-sm font-normal text-gray-500">/ hr</span></span>
                </div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Confirming..." : "Confirm Booking"}
                    </button>
                </div>
            </div>
        </form>
    );
}
