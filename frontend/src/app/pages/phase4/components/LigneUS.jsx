import { useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2, ExternalLink, CheckCircle, Database, Loader2, RefreshCw } from "lucide-react";

const PRIORITE_CONFIG = {
    haute:   { label: "Haute",   className: "bg-red-100 text-red-700" },
    moyenne: { label: "Moyenne", className: "bg-yellow-100 text-yellow-700" },
    basse:   { label: "Basse",   className: "bg-green-100 text-green-700" },
};

export function LigneUS({ us, isLast, taigaConnecte, onExporter, onSupprimer, onStockerBdd }) {
    const [dbLoading, setDbLoading] = useState(false);
    const [dbError, setDbError]     = useState("");

    const tdClass = `px-4 py-3 ${isLast ? "" : "border-b border-gray-100"} align-middle`;
    const prioriteCfg = PRIORITE_CONFIG[us.priorite] || PRIORITE_CONFIG.moyenne;

    async function handleStockerBdd() {
        setDbLoading(true);
        setDbError("");
        try {
            await onStockerBdd(us);
        } catch (err) {
            setDbError(err.message);
        } finally {
            setDbLoading(false);
        }
    }

    function renderBddButton() {
        if (dbLoading) {
            return (
                <button
                    disabled
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                >
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Stockage...
                </button>
            );
        }

        if (us.dbId) {
            return (
                <button
                    onClick={handleStockerBdd}
                    title="Mettre à jour en base de données"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors"
                >
                    <RefreshCw className="w-3 h-3" />
                    Sync BDD
                </button>
            );
        }

        return (
            <button
                onClick={handleStockerBdd}
                title="Enregistrer en base de données"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium bg-gray-50 border-gray-200 text-gray-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-colors"
            >
                <Database className="w-3 h-3" />
                Stocker BDD
            </button>
        );
    }

    return (
        <>
            <tr className="hover:bg-gray-50 transition-colors">

                <td className={tdClass}>
                    <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-medium text-gray-700">
                            {us.id}
                        </span>
                        {us.dbId && (
                            <span
                                title={`ID BDD : ${us.dbId}`}
                                className="inline-flex items-center gap-0.5 text-xs text-emerald-600"
                            >
                                <Database className="w-2.5 h-2.5" />
                            </span>
                        )}
                    </div>
                </td>

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

                <td className={tdClass}>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${prioriteCfg.className}`}>
                        {prioriteCfg.label}
                    </span>
                </td>

                <td className={tdClass}>
                    <span className={`text-xs ${us.criteres?.length > 0 ? "text-green-600 font-medium" : "text-gray-400"}`}>
                        {us.criteres?.length > 0
                            ? `${us.criteres.length} critère${us.criteres.length > 1 ? "s" : ""}`
                            : "Aucun"
                        }
                    </span>
                </td>

                <td className={tdClass}>
                    <div className="flex items-center gap-2 flex-wrap">

                        {renderBddButton()}

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

                        <Link
                            to={`/dashboard/phase4/form?id=${us.id}`}
                            className="flex items-center p-1.5 border border-gray-200 rounded-lg text-gray-400 hover:text-blue-600 hover:border-blue-300 transition-colors"
                        >
                            <Edit className="w-3.5 h-3.5" />
                        </Link>

                        <button
                            onClick={onSupprimer}
                            className="flex items-center p-1.5 border border-gray-200 rounded-lg text-gray-400 hover:text-red-600 hover:border-red-300 transition-colors"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>

                    </div>

                    {dbError && (
                        <p className="text-xs text-red-600 mt-1 max-w-[260px]">
                            {dbError}
                        </p>
                    )}
                </td>
            </tr>
        </>
    );
}