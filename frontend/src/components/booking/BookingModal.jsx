import { X } from "lucide-react";

export default function BookingModal({
    worker,
    isOpen,
    onClose,
    children
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
            <div className="w-full max-w-xl mx-4 rounded-3xl bg-white shadow-2xl overflow-hidden border border-gray-100 transform scale-100 transition-transform duration-300">
                <div className="flex items-center justify-between border-b border-gray-100 p-6 bg-slate-50">
                    <div className="flex items-center gap-3">
                        {worker.profilePhoto ? (
                            <img
                                src={worker.profilePhoto}
                                alt={worker.fullName}
                                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow">
                                {worker.fullName?.charAt(0)}
                            </div>
                        )}
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                Book {worker.fullName}
                            </h2>
                            <p className="text-xs text-indigo-600 font-semibold tracking-wider uppercase">
                                {worker.profession}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 bg-white">
                    {children}
                </div>
            </div>
        </div>
    );
}
