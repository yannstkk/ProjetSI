import { CheckCircle } from "lucide-react";
import { FluxCard } from "./FluxCard";

export function PanneauResultats({ acteurs, flux }) {
    return (
        <div className="space-y-4">

            {/* Acteurs détectés */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">
                        Acteurs ({acteurs.length})
                    </span>
                    {acteurs.length > 0 && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                </div>

                <div className="p-4">
                    {acteurs.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-4">
                            Lance l'analyse IA pour détecter les acteurs
                        </p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {acteurs.map((a, i) => (
                                <span
                                    key={i}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                                >
                                    <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                                    {a.nom}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Flux détectés */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">
                        Flux ({flux.length})
                    </span>
                    {flux.length > 0 && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                </div>

                <div className="p-4 space-y-2 max-h-[480px] overflow-y-auto">
                    {flux.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-4">
                            Lance l'analyse IA pour extraire les flux
                        </p>
                    ) : (
                        flux.map((f, i) => (
                            <FluxCard key={i} flux={f} index={i} />
                        ))
                    )}
                </div>
            </div>

        </div>
    );
}