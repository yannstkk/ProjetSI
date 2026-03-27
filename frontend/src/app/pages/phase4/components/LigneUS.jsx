import { Link } from "react-router-dom";
import { Edit, Trash2, ExternalLink, CheckCircle } from "lucide-react";

const PRIORITE_CONFIG = {
    haute:   { label: "Haute",   className: "bg-red-100 text-red-700" },
    moyenne: { label: "Moyenne", className: "bg-yellow-100 text-yellow-700" },
    basse:   { label: "Basse",   className: "bg-green-100 text-green-700" },
};

export function LigneUS({ us, isLast, taigaConnecte, onExporter, onSupprimer }) {
    const tdClass = `px-4 py-3 ${isLast ? "" : "border-b border-gray-100"} align-middle`;
    const prioriteCfg = PRIORITE_CONFIG[us.priorite] || PRIORITE_CONFIG.moyenne;

    return (
        <tr className="hover:bg-gray-50 transition-colors">

            {/* ID */}
            <td className={tdClass}>
                <span className="font-mono text-xs font-medium text-gray-700">
                    {us.id}
                </span>
            </td>

            {/* User Story */}
            <td className={`${tdClass} max-w-xs`}>
                <div className="text-sm font-medium text-gray-900">
                    En tant que <span className="text-blue-600">{us.acteur || "—"}</span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">
                    {us.veux
                        ? `je veux ${us.veux}`
                        : <em>non renseigné</em>
                    }
                </div>
            </td>

            {/* Priorité */}
            <td className={tdClass}>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${prioriteCfg.className}`}>
                    {prioriteCfg.label}
                </span>
            </td>

            {/* Critères */}
            <td className={tdClass}>
                <span className={`text-xs ${us.criteres?.length > 0 ? "text-green-600 font-medium" : "text-gray-400"}`}>
                    {us.criteres?.length > 0
                        ? `${us.criteres.length} critère${us.criteres.length > 1 ? "s" : ""}`
                        : "Aucun"
                    }
                </span>
            </td>

            {/* Actions */}
            <td className={tdClass}>
                <div className="flex items-center gap-2">

                    {/* Exporter vers Taiga */}
                    <button
                        onClick={onExporter}
                        title={taigaConnecte ? "Exporter vers Taiga" : "Connectez-vous d'abord à Taiga"}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                            us.taigaId
                                ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                : taigaConnecte
                                    ? "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"
                                    : "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                        }`}
                    >
                        {us.taigaId
                            ? <><CheckCircle className="w-3 h-3" /> {us.taigaRef || "Exportée"}</>
                            : <><ExternalLink className="w-3 h-3" /> Taiga</>
                        }
                    </button>

                    {/* Éditer */}
                    <Link
                        to={`/dashboard/phase4/form?id=${us.id}`}
                        className="flex items-center p-1.5 border border-gray-200 rounded-lg text-gray-400 hover:text-blue-600 hover:border-blue-300 transition-colors"
                    >
                        <Edit className="w-3.5 h-3.5" />
                    </Link>

                    {/* Supprimer */}
                    <button
                        onClick={onSupprimer}
                        className="flex items-center p-1.5 border border-gray-200 rounded-lg text-gray-400 hover:text-red-600 hover:border-red-300 transition-colors"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>

                </div>
            </td>
        </tr>
    );
}