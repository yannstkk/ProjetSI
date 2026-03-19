import { Link } from "react-router";
import { ArrowRight, CheckCircle, AlertTriangle } from "lucide-react";

export function BandeauValidation({ classification }) {
    const total = Object.values(classification).flat().length;
    const valides = Object.values(classification).flat().filter((i) => i.valide).length;
    const doublons = Object.values(classification).flat().filter((i) => i.doublonSuspecte).length;

    const peutValider = total > 0 && doublons === 0;
    const progression = total > 0 ? Math.round((valides / total) * 100) : 0;

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-6">

                {/* Progression */}
                <div className="flex-1">
                    <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="text-gray-600 font-medium">
                            Éléments validés
                        </span>
                        <span className="font-semibold text-gray-900">
                            {valides} / {total}
                        </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progression}%` }}
                        />
                    </div>
                </div>

                {/* Doublons */}
                {doublons > 0 && (
                    <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 border border-orange-200 px-3 py-2 rounded-lg">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        {doublons} doublon{doublons > 1 ? "s" : ""} à résoudre
                    </div>
                )}

                {/* Bouton vers Phase 4 */}
                <Link
                    to="/dashboard/phase4/backlog"
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                        peutValider
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"
                    }`}
                >
                    {valides === total && total > 0 ? (
                        <>
                            <CheckCircle className="w-4 h-4" />
                            Envoyer vers Phase 4
                        </>
                    ) : (
                        <>
                            Passer à Phase 4
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </Link>

            </div>
        </div>
    );
}