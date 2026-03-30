
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    Sparkles,
    Loader2,
    CheckCircle,
    AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { authFetch } from "../../../services/authFetch";
import { loadBpmn, saveBpmn } from "./helpers/bpmnStorage";
import { loadBacklog } from "../phase4/components/usStorage";

export function Phase6B() {
    const saved = loadBpmn();
    const backlog = loadBacklog();

    const [selected] = useState(saved?.selected || null);
    const [liens] = useState(saved?.liens || []);
    const [iaLoading, setIaLoading] = useState(false);
    const [iaResult, setIaResult] = useState(saved?.iaResult || null);
    const [iaError, setIaError] = useState("");

    const viewerRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!selected?.contenu || !containerRef.current) return;

        let viewer = null;

        async function renderBpmn() {
            try {
                const imported = await import(
                    "https://unpkg.com/bpmn-js@17.11.1/dist/bpmn-viewer.development.js"
                    ).catch(() => null);

                const BpmnViewer = imported?.default;
                if (!BpmnViewer) return;

                viewer = new BpmnViewer({ container: containerRef.current });
                viewerRef.current = viewer;

                await viewer.importXML(selected.contenu);
                viewer.get("canvas").zoom("fit-viewport");
                viewer.get("canvas").resized();
            } catch (err) {
                console.warn("bpmn-js non disponible, fallback XML :", err?.message);
            }
        }

        renderBpmn();

        return () => {
            if (viewerRef.current) {
                try {
                    viewerRef.current.destroy();
                } catch {
                    //
                }
                viewerRef.current = null;
            }
        };
    }, [selected]);

    function persistBpmnData(updatedIaResult) {
        saveBpmn({
            ...saved,
            selected,
            liens,
            iaResult: updatedIaResult
        });
    }

    async function analyserCoherence() {
        if (!selected?.contenu) {
            setIaError("Aucun BPMN chargé.");
            return;
        }

        if (!backlog.length) {
            setIaError("Aucune User Story disponible.");
            return;
        }

        setIaLoading(true);
        setIaError("");
        setIaResult(null);

        try {
            const usResume = backlog
                .map((us) => {
                    const acteur = us.acteur || "acteur non défini";
                    const veux = us.veux || "besoin non défini";
                    const afinDe = us.afinDe ? ` afin de ${us.afinDe}` : "";
                    return `${us.id}: En tant que ${acteur}, je veux ${veux}${afinDe}`;
                })
                .join("\n");

            const res = await authFetch("/api/bpmn/analyser-coherence", {
                method: "POST",
                body: JSON.stringify({
                    contenuBpmn: selected.contenu,
                    userStories: usResume
                })
            });

            if (!res.ok) {
                const errorText = await res.text().catch(() => "");
                throw new Error(errorText || `Erreur serveur : ${res.status}`);
            }

            const data = await res.json();
            setIaResult(data);
            persistBpmnData(data);
        } catch (err) {
            setIaError("Erreur lors de l'analyse : " + (err?.message || "erreur inconnue"));
        } finally {
            setIaLoading(false);
        }
    }

    if (!selected) {
        return (
            <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ArrowLeft className="w-8 h-8 text-gray-400" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Aucun BPMN importé</h2>
                <p className="text-gray-500 text-sm mb-4">
                    Importez d&apos;abord un fichier BPMN en Phase 6A.
                </p>
                <Link
                    to="/dashboard/phase6/import"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    Aller à l&apos;import
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto space-y-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Viewer BPMN</h1>
                    <p className="text-gray-600">Phase 6 — Visualisation et traçabilité</p>
                </div>

                <Card className="overflow-hidden">
                    <CardHeader className="pb-3 border-b border-gray-100">
                        <CardTitle className="flex items-center justify-between text-base">
                            <span className="truncate">{selected.nom}</span>
                            <div className="flex gap-2 flex-shrink-0">
                                <button
                                    onClick={() => viewerRef.current?.get("canvas")?.zoom("fit-viewport")}
                                    className="px-2.5 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50"
                                >
                                    Recadrer
                                </button>
                                <button
                                    onClick={() => viewerRef.current?.get("canvas")?.zoom(1.2)}
                                    className="px-2.5 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50"
                                >
                                    +
                                </button>
                                <button
                                    onClick={() => viewerRef.current?.get("canvas")?.zoom(0.8)}
                                    className="px-2.5 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50"
                                >
                                    −
                                </button>
                            </div>
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="relative w-full h-[520px] overflow-hidden rounded-b-lg bg-gray-50 border-t">
                            <div ref={containerRef} className="w-full h-full" />

                            {!viewerRef.current && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 p-6">
                                    <p className="text-sm text-gray-500 mb-3">
                                        Chargement du viewer...
                                    </p>

                                    <pre className="text-xs text-gray-400 bg-white border border-gray-200 rounded p-4 overflow-auto max-h-80 w-full font-mono">
                                        {selected.contenu.slice(0, 1000)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between text-base">
                            <span className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-purple-600" />
                                Analyse cohérence BPMN ↔ User Stories
                            </span>

                            <button
                                onClick={analyserCoherence}
                                disabled={iaLoading}
                                className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-300 text-sm font-medium transition-colors"
                            >
                                {iaLoading ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        Analyse...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-3.5 h-3.5" />
                                        Analyser
                                    </>
                                )}
                            </button>
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        {iaError && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                {iaError}
                            </div>
                        )}

                        {!iaResult && !iaError && (
                            <p className="text-sm text-gray-500 text-center py-4">
                                Cliquez sur &quot;Analyser&quot; pour détecter les incohérences entre le BPMN et les User Stories.
                            </p>
                        )}

                        {iaResult && (
                            <div className="space-y-4">
                                {iaResult.resumeGlobal && (
                                    <div className="p-4 rounded-lg border bg-blue-50 border-blue-200 text-blue-900">
                                        <p className="text-sm font-medium mb-1">Résumé global</p>
                                        <p className="text-sm">{iaResult.resumeGlobal}</p>
                                    </div>
                                )}

                                {(iaResult.liens || []).length > 0 && (
                                    <div className="p-4 rounded-lg border bg-emerald-50 border-emerald-200">
                                        <p className="text-sm font-medium text-emerald-800 mb-3">
                                            Correspondances détectées ({iaResult.liens.length})
                                        </p>

                                        <div className="space-y-2">
                                            {iaResult.liens.map((l, i) => (
                                                <div
                                                    key={i}
                                                    className="p-3 rounded-lg bg-white border border-emerald-100 text-sm"
                                                >
                                                    <p className="font-medium text-gray-800">
                                                        {l.tacheBpmn} ↔ {l.userStoryId}
                                                    </p>

                                                    {l.justification && (
                                                        <p className="text-xs text-gray-600 mt-1">
                                                            {l.justification}
                                                        </p>
                                                    )}

                                                    {l.score !== undefined && l.score !== null && (
                                                        <p className="text-xs text-emerald-700 mt-1">
                                                            Score de confiance : {l.score}%
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {(iaResult.alertes || []).map((a, i) => (
                                    <div
                                        key={i}
                                        className={`p-4 rounded-lg border text-sm ${
    a.type === "erreur"
        ? "bg-red-50 border-red-200 text-red-800"
        : "bg-yellow-50 border-yellow-200 text-yellow-800"
}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />

                                            <div className="space-y-2">
                                                <p className="font-medium">{a.titre}</p>

                                                {a.description && (
                                                    <p className="text-sm opacity-90">{a.description}</p>
                                                )}

                                                {a.elementBpmn && (
                                                    <p className="text-xs">
                                                        <span className="font-semibold">Élément BPMN :</span>{" "}
                                                        {a.elementBpmn}
                                                    </p>
                                                )}

                                                {a.userStoryId && (
                                                    <p className="text-xs">
                                                        <span className="font-semibold">User Story :</span>{" "}
                                                        {a.userStoryId}
                                                    </p>
                                                )}

                                                {a.justification && (
                                                    <p className="text-xs">
                                                        <span className="font-semibold">Justification :</span>{" "}
                                                        {a.justification}
                                                    </p>
                                                )}

                                                {a.recommandation && (
                                                    <p className="text-xs">
                                                        <span className="font-semibold">Recommandation :</span>{" "}
                                                        {a.recommandation}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {(iaResult.userStoriesNonCouvertes || []).length > 0 && (
                                    <div className="p-4 rounded-lg border bg-red-50 border-red-200">
                                        <p className="text-sm font-medium text-red-800 mb-3">
                                            User Stories non couvertes ({iaResult.userStoriesNonCouvertes.length})
                                        </p>

                                        <div className="space-y-2">
                                            {iaResult.userStoriesNonCouvertes.map((us, i) => (
                                                <div
                                                    key={i}
                                                    className="p-3 rounded-lg bg-white border border-red-100 text-sm"
                                                >
                                                    <p className="font-medium text-gray-800">{us.id}</p>
                                                    {us.raison && (
                                                        <p className="text-xs text-gray-600 mt-1">
                                                            {us.raison}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {(iaResult.tachesBpmnNonCouvertes || []).length > 0 && (
                                    <div className="p-4 rounded-lg border bg-orange-50 border-orange-200">
                                        <p className="text-sm font-medium text-orange-800 mb-3">
                                            Tâches BPMN non couvertes ({iaResult.tachesBpmnNonCouvertes.length})
                                        </p>

                                        <div className="space-y-2">
                                            {iaResult.tachesBpmnNonCouvertes.map((t, i) => (
                                                <div
                                                    key={i}
                                                    className="p-3 rounded-lg bg-white border border-orange-100 text-sm"
                                                >
                                                    <p className="font-medium text-gray-800">{t.nom}</p>
                                                    {t.raison && (
                                                        <p className="text-xs text-gray-600 mt-1">
                                                            {t.raison}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {(iaResult.alertes || []).length === 0 &&
                                    (iaResult.userStoriesNonCouvertes || []).length === 0 &&
                                    (iaResult.tachesBpmnNonCouvertes || []).length === 0 && (
                                        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm">
                                            <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                            Aucune incohérence détectée — BPMN et User Stories sont alignés.
                                        </div>
                                    )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="flex gap-3">
                    <Link
                        to="/dashboard/phase6/import"
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour à l&apos;import
                    </Link>

                    <Link
                        to="/dashboard/phase6/coverage"
                        className="ml-auto flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Contrôle couverture
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}