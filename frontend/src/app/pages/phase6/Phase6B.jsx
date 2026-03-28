import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Search, Plus, X, Sparkles, Loader2, CheckCircle, AlertTriangle, Link as LinkIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { authFetch } from "../../../services/authFetch";
import { getProjetCourant } from "../../../services/projetCourant";
import { loadBpmn, saveBpmn } from "./helpers/bpmnStorage";
import { loadBacklog } from "../phase4/components/usStorage";

export function Phase6B() {
    const saved    = loadBpmn();
    const backlog  = loadBacklog();
    const projet   = getProjetCourant();

    const [selected]                    = useState(saved?.selected || null);
    const [recherche, setRecherche]     = useState("");
    const [liens, setLiens]             = useState(saved?.liens || []);
    const [panneauOuvert, setPanneau]   = useState("us"); // "us" | "exigences"
    const [iaLoading, setIaLoading]     = useState(false);
    const [iaResult, setIaResult]       = useState(saved?.iaResult || null);
    const [iaError, setIaError]         = useState("");
    const viewerRef                     = useRef(null);
    const containerRef                  = useRef(null);

    // ── Rendu BPMN via bpmn-js ────────────────────────────────────────────────
    useEffect(() => {
        if (!selected?.contenu || !containerRef.current) return;

        let viewer = null;

        async function renderBpmn() {
            try {
                const { default: BpmnViewer } = await import(
                    "https://unpkg.com/bpmn-js@17.11.1/dist/bpmn-viewer.development.js"
                ).catch(() => null);

                if (!BpmnViewer) {
                    // Fallback : afficher le XML formaté si bpmn-js n'est pas dispo
                    return;
                }

                viewer = new BpmnViewer({ container: containerRef.current });
                viewerRef.current = viewer;

                await viewer.importXML(selected.contenu);
                viewer.get("canvas").zoom("fit-viewport");
            } catch (err) {
                console.warn("bpmn-js non disponible, fallback XML :", err.message);
            }
        }

        renderBpmn();

        return () => {
            if (viewerRef.current) {
                try { viewerRef.current.destroy(); } catch { /* ignore */ }
                viewerRef.current = null;
            }
        };
    }, [selected]);

    // ── Liens US ──────────────────────────────────────────────────────────────

    function ajouterLien(us) {
        if (liens.find((l) => l.id === us.id)) return;
        const updated = [...liens, { id: us.id, acteur: us.acteur, veux: us.veux }];
        setLiens(updated);
        saveBpmn({ ...saved, liens: updated });
    }

    function retirerLien(id) {
        const updated = liens.filter((l) => l.id !== id);
        setLiens(updated);
        saveBpmn({ ...saved, liens: updated });
    }

    // ── Analyse IA cohérence BPMN ↔ US ───────────────────────────────────────
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
            const usResume = backlog.map((us) =>
                `${us.id}: En tant que ${us.acteur}, je veux ${us.veux}`
            ).join("\n");

            const res = await authFetch("/api/bpmn/analyser-coherence", {
                method: "POST",
                body: JSON.stringify({
                    contenuBpmn: selected.contenu,
                    userStories: usResume,
                }),
            });

            if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
            const data = await res.json();
            setIaResult(data);
            saveBpmn({ ...saved, iaResult: data });
        } catch (err) {
            setIaError("Erreur lors de l'analyse : " + err.message);
        } finally {
            setIaLoading(false);
        }
    }

    // ── Filtrage US ───────────────────────────────────────────────────────────

    const usFiltrees = backlog.filter((us) => {
        const q = recherche.toLowerCase();
        return !q
            || us.id?.toLowerCase().includes(q)
            || us.acteur?.toLowerCase().includes(q)
            || us.veux?.toLowerCase().includes(q);
    });

    // ─────────────────────────────────────────────────────────────────────────

    if (!selected) {
        return (
            <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ArrowLeft className="w-8 h-8 text-gray-400" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Aucun BPMN importé</h2>
                <p className="text-gray-500 text-sm mb-4">
                    Importez d'abord un fichier BPMN en Phase 6A.
                </p>
                <Link
                    to="/dashboard/phase6/import"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    Aller à l'import
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto space-y-4">

                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Viewer BPMN</h1>
                    <p className="text-gray-600">Phase 6 — Visualisation et traçabilité</p>
                </div>

                <div className="grid grid-cols-12 gap-4">

                    {/* ── Viewer BPMN ── */}
                    <div className="col-span-8 space-y-4">
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
                                {/* Container bpmn-js */}
                                <div
                                    ref={containerRef}
                                    style={{ height: "520px", background: "#fafafa" }}
                                    className="w-full"
                                />
                                {/* Fallback si bpmn-js ne charge pas */}
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
                            </CardContent>
                        </Card>

                        {/* Analyse IA */}
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
                                            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyse...</>
                                        ) : (
                                            <><Sparkles className="w-3.5 h-3.5" /> Analyser</>
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
                                        Cliquez sur "Analyser" pour détecter les incohérences entre le BPMN et les User Stories.
                                    </p>
                                )}
                                {iaResult && (
                                    <div className="space-y-3">
                                        {(iaResult.alertes || []).map((a, i) => (
                                            <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border text-sm ${
                                                a.type === "erreur"
                                                    ? "bg-red-50 border-red-200 text-red-800"
                                                    : "bg-yellow-50 border-yellow-200 text-yellow-800"
                                            }`}>
                                                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-medium">{a.titre}</p>
                                                    <p className="text-xs mt-0.5 opacity-80">{a.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {(iaResult.alertes || []).length === 0 && (
                                            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm">
                                                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                                Aucune incohérence détectée — BPMN et User Stories sont alignés.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* ── Panneau droit ── */}
                    <div className="col-span-4 space-y-4">

                        {/* Tabs */}
                        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setPanneau("us")}
                                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                                    panneauOuvert === "us"
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                User Stories
                            </button>
                            <button
                                onClick={() => setPanneau("liens")}
                                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                                    panneauOuvert === "liens"
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                Liées ({liens.length})
                            </button>
                        </div>

                        {/* US à lier */}
                        {panneauOuvert === "us" && (
                            <Card>
                                <CardContent className="p-3 space-y-3">
                                    <div className="relative">
                                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            placeholder="Rechercher une US..."
                                            value={recherche}
                                            onChange={(e) => setRecherche(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="space-y-2 max-h-[520px] overflow-y-auto">
                                        {usFiltrees.length === 0 && (
                                            <p className="text-sm text-gray-500 text-center py-4">
                                                {backlog.length === 0
                                                    ? "Aucune US disponible — créez-en en Phase 4."
                                                    : "Aucun résultat."
                                                }
                                            </p>
                                        )}
                                        {usFiltrees.map((us) => {
                                            const dejalie = liens.some((l) => l.id === us.id);
                                            return (
                                                <div
                                                    key={us.id}
                                                    className={`p-3 rounded-lg border text-sm transition-colors ${
                                                        dejalie
                                                            ? "bg-emerald-50 border-emerald-200"
                                                            : "bg-gray-50 border-gray-200 hover:border-gray-300"
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="min-w-0">
                                                            <span className="font-mono text-xs text-gray-500">{us.id}</span>
                                                            <p className="text-gray-700 text-xs mt-0.5 leading-snug">
                                                                <span className="font-medium text-blue-700">{us.acteur}</span>
                                                                {us.veux && <> — {us.veux.slice(0, 60)}{us.veux.length > 60 ? "…" : ""}</>}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => dejalie ? retirerLien(us.id) : ajouterLien(us)}
                                                            className={`flex-shrink-0 p-1 rounded transition-colors ${
                                                                dejalie
                                                                    ? "text-emerald-600 hover:text-red-500"
                                                                    : "text-gray-400 hover:text-blue-600"
                                                            }`}
                                                        >
                                                            {dejalie ? <CheckCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* US liées */}
                        {panneauOuvert === "liens" && (
                            <Card>
                                <CardContent className="p-3 space-y-2">
                                    {liens.length === 0 && (
                                        <div className="text-center py-8">
                                            <LinkIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                            <p className="text-sm text-gray-500">
                                                Aucune US liée à ce BPMN.
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Utilisez l'onglet "User Stories" pour lier des US.
                                            </p>
                                        </div>
                                    )}
                                    {liens.map((l) => (
                                        <div key={l.id} className="flex items-start justify-between gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                                            <div className="min-w-0">
                                                <span className="font-mono text-xs text-gray-500">{l.id}</span>
                                                <p className="text-xs text-gray-700 mt-0.5 leading-snug">
                                                    <span className="font-medium text-blue-700">{l.acteur}</span>
                                                    {l.veux && <> — {l.veux.slice(0, 60)}{l.veux.length > 60 ? "…" : ""}</>}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => retirerLien(l.id)}
                                                className="flex-shrink-0 text-gray-300 hover:text-red-500 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                    </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-3">
                    <Link to="/dashboard/phase6/import"
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                        <ArrowLeft className="w-4 h-4" /> Retour à l'import
                    </Link>
                    <Link to="/dashboard/phase6/coverage"
                        className="ml-auto flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        Contrôle couverture <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

            </div>
        </div>
    );
}