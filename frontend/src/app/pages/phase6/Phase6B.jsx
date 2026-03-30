import { useRef, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { authFetch } from "../../../services/authFetch";
import { loadBpmn, saveBpmn } from "./helpers/bpmnStorage";
import { loadBacklog } from "../phase4/components/usStorage";
import { BoutonIA } from "../../components/BoutonIA";

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
            <div className="p-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center py-12">
                        <p className="text-gray-500">Aucun BPMN chargé. Importez un fichier en Phase 6 d'abord.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Visualisation BPMN</h1>
                    <p className="text-gray-600">Phase 6 — Analyse et cohérence des processus</p>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">{selected.nom}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div
                                    ref={containerRef}
                                    className="bg-gray-50 rounded border border-gray-200 min-h-[500px]"
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Analyse de cohérence</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <BoutonIA
                                    onClick={analyserCoherence}
                                    loading={iaLoading}
                                    loadingText="Analyse..."
                                    disabled={!selected?.contenu}
                                    className="w-full justify-center"
                                >
                                    Analyser la cohérence
                                </BoutonIA>

                                {iaError && (
                                    <div className="p-2 bg-red-50 border border-red-300 rounded text-red-700 text-xs">
                                        {iaError}
                                    </div>
                                )}

                                {iaResult && (
                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs space-y-2">
                                        <p className="font-medium text-blue-900">Résultats :</p>
                                        <p className="text-blue-700">{iaResult.resume || "Analyse complétée"}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}