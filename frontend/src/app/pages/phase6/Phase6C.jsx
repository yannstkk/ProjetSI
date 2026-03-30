import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    FileDown,
    ArrowRight,
    Sparkles,
    Workflow,
    Users,
    Briefcase
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { authFetch } from "../../../services/authFetch";
import { getProjetCourant } from "../../../services/projetCourant";
import { loadBpmn } from "./helpers/bpmnStorage";
import { loadBacklog } from "../phase4/components/usStorage";

export function Phase6C() {
    const saved = loadBpmn();
    const backlog = loadBacklog();
    const projet = getProjetCourant();

    const selected = saved?.selected || null;
    const iaResult = saved?.iaResult || null;

    const [coverageDb, setCoverageDb] = useState(null);
    const [dbLoading, setDbLoading] = useState(false);
    const [dbError, setDbError] = useState("");

    useEffect(() => {
        if (!selected?.dbId || !projet?.id) return;

        setDbLoading(true);
        setDbError("");

        authFetch(`/api/bpmn/${selected.dbId}/couverture`)
            .then((res) => {
                if (!res.ok) throw new Error(`Erreur ${res.status}`);
                return res.json();
            })
            .then((data) => setCoverageDb(data))
            .catch((err) =>
                setDbError(err.message || "Impossible de charger la couverture depuis la BDD.")
            )
            .finally(() => setDbLoading(false));
    }, [selected?.dbId, projet?.id]);

    const acteursBpmn = useMemo(() => {
        if (!selected?.contenu) return [];
        const matches = [...selected.contenu.matchAll(/<bpmn:lane\b[^>]*name="([^"]+)"/g)];
        return [...new Set(matches.map((m) => m[1]).filter(Boolean))];
    }, [selected?.contenu]);

    const activitesBpmn = useMemo(() => {
        if (!selected?.contenu) return [];
        const regex = /<bpmn:(userTask|task|serviceTask)\b[^>]*name="([^"]+)"/g;
        const matches = [...selected.contenu.matchAll(regex)];
        return [...new Set(matches.map((m) => m[2]).filter(Boolean))];
    }, [selected?.contenu]);

    const idsUsCouvertes = useMemo(() => {
        return new Set((iaResult?.liens || []).map((l) => l.userStoryId).filter(Boolean));
    }, [iaResult]);

    const idsUsNonCouvertes = useMemo(() => {
        return new Set(
            (iaResult?.userStoriesNonCouvertes || []).map((us) => us.id).filter(Boolean)
        );
    }, [iaResult]);

    const usLiees = useMemo(() => {
        return backlog.filter((us) => idsUsCouvertes.has(us.id));
    }, [backlog, idsUsCouvertes]);

    const usNonLiees = useMemo(() => {
        return backlog.filter((us) => idsUsNonCouvertes.has(us.id));
    }, [backlog, idsUsNonCouvertes]);

    const tauxCouverture =
        backlog.length > 0 ? Math.round((usLiees.length / backlog.length) * 100) : 0;

    const acteursCouverts = useMemo(() => {
        return acteursBpmn.filter((acteurBpmn) =>
            usLiees.some(
                (us) =>
                    us.acteur &&
                    us.acteur.toLowerCase().trim() === acteurBpmn.toLowerCase().trim()
            )
        );
    }, [acteursBpmn, usLiees]);

    const acteursNonCouverts = useMemo(() => {
        return acteursBpmn.filter(
            (acteurBpmn) =>
                !acteursCouverts.some(
                    (a) => a.toLowerCase().trim() === acteurBpmn.toLowerCase().trim()
                )
        );
    }, [acteursBpmn, acteursCouverts]);

    function exporterRapport() {
        const lignes = [
            "Rapport de couverture BPMN",
            `Fichier : ${selected?.nom || "N/A"}`,
            `Date : ${new Date().toLocaleDateString("fr-FR")}`,
            "",
            `US totales : ${backlog.length}`,
            `US couvertes : ${usLiees.length}`,
            `US non couvertes : ${usNonLiees.length}`,
            `Taux de couverture : ${tauxCouverture}%`,
            "",
            `Acteurs BPMN : ${acteursBpmn.join(", ") || "Aucun"}`,
            `Activités BPMN : ${activitesBpmn.join(", ") || "Aucune"}`,
            "",
            iaResult?.resumeGlobal ? `Résumé global : ${iaResult.resumeGlobal}` : "",
            "",
            "=== US couvertes ===",
            ...usLiees.map((us) => `[${us.id}] ${us.acteur} — ${us.veux}`),
            "",
            "=== US non couvertes ===",
            ...usNonLiees.map((us) => `[${us.id}] ${us.acteur} — ${us.veux}`),
            "",
            "=== Alertes IA ===",
            ...((iaResult?.alertes || []).map(
                (a) =>
                    `[${a.type}] ${a.titre} | ${a.description || ""} | BPMN=${a.elementBpmn || ""} | US=${a.userStoryId || ""}`
            ))
        ].filter(Boolean);

        const blob = new Blob([lignes.join("\n")], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `rapport-couverture-bpmn-${new Date().toISOString().slice(0, 10)}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Contrôle couverture BPMN</h1>
                    <p className="text-gray-600">
                        Phase 6 — Vérification de la cohérence processus ↔ User Stories
                    </p>
                </div>

                {iaResult?.resumeGlobal && (
                    <Card className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Sparkles className="w-5 h-5 text-blue-600" />
                                Synthèse métier
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {iaResult.resumeGlobal}
                            </p>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-4 gap-4">
                    {[
                        {
                            label: "US totales",
                            value: backlog.length,
                            color: "text-gray-900",
                            bg: "bg-gray-50",
                        },
                        {
                            label: "Acteurs BPMN",
                            value: acteursBpmn.length,
                            color: "text-blue-700",
                            bg: "bg-blue-50",
                        },
                        {
                            label: "Activités BPMN",
                            value: activitesBpmn.length,
                            color: "text-violet-700",
                            bg: "bg-violet-50",
                        },
                        {
                            label: "Taux de couverture",
                            value: `${tauxCouverture}%`,
                            color:
                                tauxCouverture >= 80
                                    ? "text-emerald-700"
                                    : tauxCouverture >= 50
                                        ? "text-yellow-700"
                                        : "text-red-700",
                            bg:
                                tauxCouverture >= 80
                                    ? "bg-emerald-50"
                                    : tauxCouverture >= 50
                                        ? "bg-yellow-50"
                                        : "bg-red-50",
                        }
                    ].map((stat, i) => (
                        <Card key={i} className={stat.bg}>
                            <CardContent className="p-5">
                                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                                <p className={`text-3xl font-semibold ${stat.color}`}>{stat.value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Card className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Users className="w-5 h-5 text-blue-600" />
                                Acteurs du processus
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-800 mb-2">
                                    Acteurs détectés dans le BPMN
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {acteursBpmn.length > 0 ? (
                                        acteursBpmn.map((a, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs border border-blue-200"
                                            >
                                                {a}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">Aucun acteur détecté.</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-800 mb-2">
                                    Acteurs couverts par les US couvertes
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {acteursCouverts.length > 0 ? (
                                        acteursCouverts.map((a, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs border border-emerald-200"
                                            >
                                                {a}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">Aucun acteur couvert.</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-800 mb-2">
                                    Acteurs non couverts
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {acteursNonCouverts.length > 0 ? (
                                        acteursNonCouverts.map((a, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs border border-red-200"
                                            >
                                                {a}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">Tous les acteurs sont couverts.</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-violet-500">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Workflow className="w-5 h-5 text-violet-600" />
                                Activités du processus
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-800 mb-2">
                                    Activités détectées dans le BPMN
                                </p>
                                <div className="space-y-2">
                                    {activitesBpmn.length > 0 ? (
                                        activitesBpmn.map((a, i) => (
                                            <div
                                                key={i}
                                                className="p-2 rounded-lg bg-violet-50 border border-violet-100 text-sm text-violet-800"
                                            >
                                                {a}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">Aucune activité détectée.</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                                    Aucune User Story couverte après l’analyse.
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {usLiees.map((us) => {
                                        const lienAssocie = (iaResult?.liens || []).find(
                                            (l) => l.userStoryId === us.id
                                        );

                                        return (
                                            <div
                                                key={us.id}
                                                className="p-3 bg-emerald-50 rounded-lg border border-emerald-100"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                                    <div className="min-w-0">
                                                        <span className="font-mono text-xs text-gray-400 mr-2">
                                                            {us.id}
                                                        </span>
                                                        <span className="text-sm font-medium text-blue-700">
                                                            {us.acteur}
                                                        </span>
                                                        {us.veux && (
                                                            <span className="text-sm text-gray-600">
                                                                {" "}— {us.veux}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {lienAssocie?.tacheBpmn && (
                                                    <p className="text-xs text-emerald-700 mt-2 ml-7">
                                                        Tâche BPMN : {lienAssocie.tacheBpmn}
                                                    </p>
                                                )}

                                                {lienAssocie?.justification && (
                                                    <p className="text-xs text-gray-600 mt-1 ml-7">
                                                        {lienAssocie.justification}
                                                    </p>
                                                )}

                                                {lienAssocie?.score !== undefined &&
                                                    lienAssocie?.score !== null && (
                                                        <p className="text-xs text-emerald-700 mt-1 ml-7">
                                                            Score de confiance : {lienAssocie.score}%
                                                        </p>
                                                    )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

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
                                    {usNonLiees.map((us) => {
                                        const usNonCouverte = (iaResult?.userStoriesNonCouvertes || []).find(
                                            (item) => item.id === us.id
                                        );

                                        return (
                                            <div
                                                key={us.id}
                                                className="p-3 bg-red-50 rounded-lg border border-red-100"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                                                    <div className="min-w-0">
                                                        <span className="font-mono text-xs text-gray-400 mr-2">
                                                            {us.id}
                                                        </span>
                                                        <span className="text-sm font-medium text-blue-700">
                                                            {us.acteur}
                                                        </span>
                                                        {us.veux && (
                                                            <span className="text-sm text-gray-600">
                                                                {" "}— {us.veux}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {usNonCouverte?.raison && (
                                                    <p className="text-xs text-red-700 mt-2 ml-7">
                                                        {usNonCouverte.raison}
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {((iaResult?.alertes || []).length > 0 ||
                    (iaResult?.tachesBpmnNonCouvertes || []).length > 0) && (
                    <Card className="border-l-4 border-l-orange-500">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Briefcase className="w-5 h-5 text-orange-600" />
                                Analyse métier détaillée
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {(iaResult?.alertes || []).map((a, i) => (
                                <div
                                    key={i}
                                    className={`p-4 rounded-lg border text-sm ${
                                        a.type === "erreur"
                                            ? "bg-red-50 border-red-200 text-red-800"
                                            : "bg-yellow-50 border-yellow-200 text-yellow-800"
                                    }`}
                                >
                                    <p className="font-medium">{a.titre}</p>
                                    {a.description && <p className="text-sm mt-1">{a.description}</p>}
                                    {a.elementBpmn && (
                                        <p className="text-xs mt-2">
                                            <span className="font-semibold">Activité / élément BPMN :</span>{" "}
                                            {a.elementBpmn}
                                        </p>
                                    )}
                                    {a.userStoryId && (
                                        <p className="text-xs mt-1">
                                            <span className="font-semibold">User Story concernée :</span>{" "}
                                            {a.userStoryId}
                                        </p>
                                    )}
                                    {a.justification && (
                                        <p className="text-xs mt-1">
                                            <span className="font-semibold">Justification :</span>{" "}
                                            {a.justification}
                                        </p>
                                    )}
                                    {a.recommandation && (
                                        <p className="text-xs mt-1">
                                            <span className="font-semibold">Recommandation BA :</span>{" "}
                                            {a.recommandation}
                                        </p>
                                    )}
                                </div>
                            ))}

                            {(iaResult?.tachesBpmnNonCouvertes || []).map((t, i) => (
                                <div
                                    key={`task-${i}`}
                                    className="p-4 rounded-lg border bg-orange-50 border-orange-200 text-orange-900 text-sm"
                                >
                                    <p className="font-medium">Activité BPMN non couverte</p>
                                    <p className="mt-1">
                                        <span className="font-semibold">{t.nom}</span>
                                    </p>
                                    {t.raison && <p className="text-xs mt-2">{t.raison}</p>}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                <div className="flex gap-3">
                    <Link
                        to="/dashboard/phase6/viewer"
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour au viewer
                    </Link>

                    <button
                        onClick={exporterRapport}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                        <FileDown className="w-4 h-4" />
                        Exporter rapport
                    </button>

                    <Link
                        to="/dashboard/phase7/import"
                        className="ml-auto flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Passer à Phase 7
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}