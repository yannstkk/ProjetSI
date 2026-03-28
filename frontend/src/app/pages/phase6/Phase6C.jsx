import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, FileDown, ArrowRight, Database, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { authFetch } from "../../../services/authFetch";
import { getProjetCourant } from "../../../services/projetCourant";
import { loadBpmn } from "./helpers/bpmnStorage";
import { loadBacklog } from "../phase4/components/usStorage";

export function Phase6C() {
    const saved   = loadBpmn();
    const backlog = loadBacklog();
    const projet  = getProjetCourant();

    const liens      = saved?.liens     || [];
    const selected   = saved?.selected  || null;

    // ── Stats de couverture calculées localement ──────────────────────────────

    const usLiees    = backlog.filter((us) => liens.some((l) => l.id === us.id));
    const usNonLiees = backlog.filter((us) => !liens.some((l) => l.id === us.id));

    const tauxCouverture = backlog.length > 0
        ? Math.round((usLiees.length / backlog.length) * 100)
        : 0;

    // ── Chargement couverture depuis BDD (si BPMN sauvegardé) ────────────────

    const [coverageDb, setCoverageDb]   = useState(null);
    const [dbLoading, setDbLoading]     = useState(false);
    const [dbError, setDbError]         = useState("");

    useEffect(() => {
        if (!selected?.dbId || !projet?.id) return;

        setDbLoading(true);
        authFetch(`/api/bpmn/${selected.dbId}/couverture`)
            .then((res) => {
                if (!res.ok) return null;
                return res.json();
            })
            .then((data) => { if (data) setCoverageDb(data); })
            .catch(() => { /* non bloquant */ })
            .finally(() => setDbLoading(false));
    }, [selected?.dbId, projet?.id]);

    // ── Export rapport ────────────────────────────────────────────────────────

    function exporterRapport() {
        const lignes = [
            "Rapport de couverture BPMN",
            `Fichier : ${selected?.nom || "N/A"}`,
            `Date : ${new Date().toLocaleDateString("fr-FR")}`,
            "",
            `US totales : ${backlog.length}`,
            `US liées au BPMN : ${usLiees.length}`,
            `US non liées : ${usNonLiees.length}`,
            `Taux de couverture : ${tauxCouverture}%`,
            "",
            "=== US liées ===",
            ...usLiees.map((us) => `[${us.id}] ${us.acteur} — ${us.veux}`),
            "",
            "=== US non liées ===",
            ...usNonLiees.map((us) => `[${us.id}] ${us.acteur} — ${us.veux}`),
        ];

        const blob = new Blob([lignes.join("\n")], { type: "text/plain;charset=utf-8" });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement("a");
        a.href     = url;
        a.download = `rapport-couverture-bpmn-${new Date().toISOString().slice(0,10)}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // ─────────────────────────────────────────────────────────────────────────

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto space-y-6">

                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Contrôle couverture BPMN</h1>
                    <p className="text-gray-600">Phase 6 — Vérification de la cohérence processus ↔ User Stories</p>
                </div>

                {!selected && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        Aucun BPMN importé. <Link to="/dashboard/phase6/import" className="underline ml-1">Importer un BPMN</Link>
                    </div>
                )}

                {/* Stats rapides */}
                <div className="grid grid-cols-4 gap-4">
                    {[
                        {
                            label: "US totales",
                            value: backlog.length,
                            color: "text-gray-900",
                            bg: "bg-gray-50",
                            icon: null,
                        },
                        {
                            label: "US liées au BPMN",
                            value: usLiees.length,
                            color: "text-emerald-700",
                            bg: "bg-emerald-50",
                            icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
                        },
                        {
                            label: "US non liées",
                            value: usNonLiees.length,
                            color: "text-red-700",
                            bg: "bg-red-50",
                            icon: <XCircle className="w-5 h-5 text-red-600" />,
                        },
                        {
                            label: "Taux de couverture",
                            value: `${tauxCouverture}%`,
                            color: tauxCouverture >= 80 ? "text-emerald-700" : tauxCouverture >= 50 ? "text-yellow-700" : "text-red-700",
                            bg:    tauxCouverture >= 80 ? "bg-emerald-50"   : tauxCouverture >= 50 ? "bg-yellow-50"   : "bg-red-50",
                            icon: null,
                        },
                    ].map((stat, i) => (
                        <Card key={i} className={stat.bg}>
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                                        <p className={`text-3xl font-semibold ${stat.color}`}>{stat.value}</p>
                                    </div>
                                    {stat.icon && <div>{stat.icon}</div>}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Barre de progression */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Taux de couverture global</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm text-gray-600 mb-1.5">
                                <span>User Stories liées au BPMN</span>
                                <span className="font-semibold">{usLiees.length} / {backlog.length}</span>
                            </div>
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ${
                                        tauxCouverture >= 80 ? "bg-emerald-500"
                                        : tauxCouverture >= 50 ? "bg-yellow-500"
                                        : "bg-red-500"
                                    }`}
                                    style={{ width: `${tauxCouverture}%` }}
                                />
                            </div>
                        </div>

                        {tauxCouverture < 80 && backlog.length > 0 && (
                            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
                                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                {tauxCouverture < 50
                                    ? "Couverture insuffisante — la majorité des User Stories ne sont pas représentées dans le processus."
                                    : "Couverture partielle — certaines User Stories ne sont pas encore liées au BPMN."
                                }
                            </div>
                        )}

                        {tauxCouverture >= 80 && backlog.length > 0 && (
                            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm">
                                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                Bonne couverture — la plupart des User Stories sont représentées dans le processus BPMN.
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* US couvertes */}
                <Card className="border-l-4 border-l-emerald-500">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                            User Stories couvertes ({usLiees.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {usLiees.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">
                                Aucune US liée — rendez-vous dans le Viewer pour créer des liens.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {usLiees.map((us) => (
                                    <div key={us.id} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                        <div className="min-w-0">
                                            <span className="font-mono text-xs text-gray-400 mr-2">{us.id}</span>
                                            <span className="text-sm font-medium text-blue-700">{us.acteur}</span>
                                            {us.veux && (
                                                <span className="text-sm text-gray-600"> — {us.veux.slice(0, 80)}{us.veux.length > 80 ? "…" : ""}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* US non couvertes */}
                <Card className="border-l-4 border-l-red-500">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <XCircle className="w-5 h-5 text-red-600" />
                            User Stories non couvertes ({usNonLiees.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {usNonLiees.length === 0 ? (
                            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm">
                                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                Toutes les User Stories sont couvertes par le BPMN.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {usNonLiees.map((us) => (
                                    <div key={us.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                                        <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                                        <div className="min-w-0">
                                            <span className="font-mono text-xs text-gray-400 mr-2">{us.id}</span>
                                            <span className="text-sm font-medium text-blue-700">{us.acteur}</span>
                                            {us.veux && (
                                                <span className="text-sm text-gray-600"> — {us.veux.slice(0, 80)}{us.veux.length > 80 ? "…" : ""}</span>
                                            )}
                                        </div>
                                        <Link
                                            to="/dashboard/phase6/viewer"
                                            className="ml-auto text-xs text-blue-600 hover:text-blue-700 flex-shrink-0"
                                        >
                                            Lier →
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3">
                    <Link to="/dashboard/phase6/viewer"
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                        <ArrowLeft className="w-4 h-4" /> Retour au viewer
                    </Link>

                    <button
                        onClick={exporterRapport}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                        <FileDown className="w-4 h-4" /> Exporter rapport
                    </button>

                    <Link to="/dashboard/phase7/import"
                        className="ml-auto flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        Passer à Phase 7 <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

            </div>
        </div>
    );
}