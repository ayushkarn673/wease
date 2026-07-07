import { MapPin, Calendar, Clock, DollarSign, User, ShieldCheck, FileText } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function BookingDetailsCard({ booking }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      
      {/* Title / Status Header */}
      <div className="p-6 border-b border-gray-100 bg-slate-50 flex flex-wrap justify-between items-center gap-4">
        <div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Booking ID</span>
          <span className="font-black text-gray-800 text-lg">#WEASE-{booking.bookingId}</span>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="p-6 space-y-6">
        
        {/* Users Details Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <User size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</p>
              <h4 className="font-bold text-gray-800 mt-1">{booking.customerName}</h4>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Worker Assigned</p>
              <h4 className="font-bold text-gray-800 mt-1">{booking.workerName}</h4>
              <p className="text-xs text-indigo-600 font-semibold uppercase mt-0.5">{booking.profession}</p>
            </div>
          </div>
        </div>

        {/* Schedule & Address Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-6 border-b border-gray-100 text-sm text-gray-600">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar size={14} /> Date
            </p>
            <p className="font-semibold text-gray-800 mt-1">{booking.bookingDate}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={14} /> Preferred Time
            </p>
            <p className="font-semibold text-gray-800 mt-1">{booking.bookingTime}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin size={14} /> Service Address
            </p>
            <p className="font-semibold text-gray-800 mt-1 truncate">{booking.serviceAddress}</p>
          </div>
        </div>

        {/* Problem Description */}
        {booking.description && (
          <div className="pb-6 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <FileText size={14} /> Problem Statement
            </p>
            <div className="p-4 bg-slate-50 border border-gray-100 rounded-2xl text-sm text-gray-600 leading-relaxed">
              {booking.description}
            </div>
          </div>
        )}

        {/* Price Breakdown */}
        <div className="flex justify-between items-center pt-2">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Estimated Price</p>
            <h4 className="text-lg font-bold text-gray-800 mt-1">₹{booking.estimatedPrice}</h4>
          </div>

          {booking.status === "COMPLETED" && (
            <div className="text-right">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Final Price Paid</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">₹{booking.finalPrice || booking.estimatedPrice}</h3>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
