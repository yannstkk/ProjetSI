import { useState } from "react";
import { ArrowRight, ChevronRight, Database } from "lucide-react";

export function FluxCard({ flux, index }) {
    const [open, setOpen] = useState(false);

    return (
        <div
            className="group border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-md transition-all duration-200"
            style={{ animationDelay: `${index * 60}ms` }}
        >
            <button
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center gap-3 p-4 text-left bg-white hover:bg-gray-50 transition-colors"
            >
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                </span>

                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-sm font-semibold text-gray-800 truncate">
                        {flux.emetteur || "?"}
                    </span>
                    <ArrowRight className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span className="text-sm font-semibold text-gray-800 truncate">
                        {flux.recepteur || "?"}
                    </span>
                </div>

                {/* Nom du flux */}
                <span className="hidden sm:block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full truncate max-w-[180px]">
                    {flux.nom}
                </span>

                <ChevronRight
                    className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                        open ? "rotate-90" : ""
                    }`}
                />
            </button>

            {/* Détails dépliables */}
            {open && (
                <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-3">

                    {flux.description && (
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                Description
                            </p>
                            <p className="text-sm text-gray-700">{flux.description}</p>
                        </div>
                    )}

                    {flux.data && (
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                                <Database className="w-3 h-3" /> Données échangées
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {flux.data.split(",").map((d, i) => (
                                    <span
                                        key={i}
                                        className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium"
                                    >
                                        {d.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}