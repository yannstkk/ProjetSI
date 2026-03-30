import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, AlertTriangle, CheckCircle, XCircle, Info, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { BoutonIA } from "../../components/BoutonIA";
import { authFetch } from "../../../services/authFetch";
import { loadBacklog } from "./components/usStorage";

const STORAGE_KEY = "phase4_controle_resultat";
function loadResultat() { try { const raw = sessionStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; } }
function saveResultat(data) { try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {} }
function clearResultat() { sessionStorage.removeItem(STORAGE_KEY); }

const TYPE_CONFIG = {
    erreur:        { label: "Erreur",         icon: XCircle,       rowClass: "bg-red-50 border-red-200",       iconClass: "text-red-600",    badgeClass: "bg-red-100 text-red-700" },
    avertissement: { label: "Avertissement",  icon: AlertTriangle, rowClass: "bg-yellow-50 border-yellow-200", iconClass: "text-yellow-600", badgeClass: "bg-yellow-100 text-yellow-700" },
    suggestion:    { label: "Suggestion",     icon: Info,          rowClass: "bg-blue-50 border-blue-200",     iconClass: "text-blue-600",   badgeClass: "bg-blue-100 text-blue-700" },
};

export function Phase4C() {
    const backlog = loadBacklog();
    const [iaLoading, setIaLoading]   = useState(false);
    const [iaError, setIaError]       = useState("");
    const [resultat, setResultat]     = useState(loadResultat);
    const [filtreType, setFiltreType] = useState("tous");

    async function lancerAnalyse() {
        if (backlog.length === 0) { setIaError("Le backlog est vide — créez des User Stories en Phase 4 d'abord."); return; }
        setIaLoading(true); setIaError(""); setResultat(null); clearResultat();
        try {
            const backlogTexte = backlog.map((us) => [`ID: ${us.id}`, `Acteur: ${us.acteur || "(non défini)"}`, `Je veux: ${us.veux || "(vide)"}`, `Afin de: ${us.afin || "(vide)"}`, `Priorité: ${us.priorite || "(non définie)"}`, `Critères: ${us.criteres?.length ? us.criteres.join(" | ") : "(aucun)"}`].join("\n")).join("\n\n---\n\n");
            const res = await authFetch("/api/mistral/analyser-backlog", { method: "POST", body: JSON.stringify({ contenu: backlogTexte }) });
            if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
            const data = await res.json();
            setResultat(data); saveResultat(data);
        } catch (err) {
            setIaError("Erreur lors de l'analyse : " + err.message);
        } finally {
            setIaLoading(false);
        }
    }

    function reinitialiser() { setResultat(null); setFiltreType("tous"); setIaError(""); clearResultat(); }

    const stats = useMemo(() => {
        if (!resultat) return null;
        const alertes = resultat.alertes || [];
        return { total: alertes.length, erreurs: alertes.filter((a) => a.type === "erreur").length, avertissements: alertes.filter((a) => a.type === "avertissement").length, suggestions: alertes.filter((a) => a.type === "suggestion").length };
    }, [resultat]);

    const alertesFiltrees = useMemo(() => {
        if (!resultat) return [];
        const alertes = resultat.alertes || [];
        if (filtreType === "tous") return alertes;
        return alertes.filter((a) => a.type === filtreType);
    }, [resultat, filtreType]);

    return (
        <div className="p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Contrôle cohérence</h1>
                    <p className="text-gray-600">Phase 4 — Analyse IA du backlog</p>
                </div>

                {backlog.length === 0 && (
                    <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        Le backlog est vide. <Link to="/dashboard/phase4/backlog" className="underline font-medium">Créez des User Stories</Link> avant de lancer l'analyse.
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">Analyse IA du backlog complet</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600">L'IA analyse l'ensemble de vos <strong>{backlog.length}</strong> User{backlog.length > 1 ? " Stories" : " Story"} et détecte :</p>
                        <ul className="text-sm text-gray-600 space-y-1 ml-4">
                            <li className="flex items-center gap-2"><XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />Les US mal formulées ou incomplètes</li>
                            <li className="flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />Les doublons et redondances</li>
                            <li className="flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />Les incohérences entre US</li>
                            <li className="flex items-center gap-2"><Info className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />Les suggestions d'amélioration</li>
                        </ul>

                        <div className="flex items-center gap-3 pt-2">
                            <BoutonIA onClick={lancerAnalyse} loading={iaLoading} loadingText="Analyse en cours..." disabled={backlog.length === 0}>
                                {resultat ? "Relancer l'analyse" : "Lancer l'analyse IA"}
                            </BoutonIA>

                            {resultat && (
                                <button onClick={reinitialiser} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-2 rounded-lg hover:border-gray-300 transition-colors">
                                    <RefreshCw className="w-3.5 h-3.5" /> Effacer les résultats
                                </button>
                            )}
                        </div>

                        {iaError && <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"><AlertTriangle className="w-4 h-4 flex-shrink-0" />{iaError}</div>}
                        {resultat && !iaLoading && <p className="text-xs text-gray-400 flex items-center gap-1"><CheckCircle className="w-3 h-3 text-gray-300" />Résultats chargés depuis la session — relancez l'analyse si le backlog a changé.</p>}
                    </CardContent>
                </Card>

                {resultat && stats && (
                    <>
                        <div className="grid grid-cols-4 gap-4">
                            {[
                                { label: "Total alertes",   value: stats.total,           color: "text-gray-900",   bg: "bg-gray-50",    icon: null },
                                { label: "Erreurs",         value: stats.erreurs,         color: "text-red-700",    bg: "bg-red-50",     icon: <XCircle className="w-5 h-5 text-red-500" /> },
                                { label: "Avertissements",  value: stats.avertissements,  color: "text-yellow-700", bg: "bg-yellow-50",  icon: <AlertTriangle className="w-5 h-5 text-yellow-500" /> },
                                { label: "Suggestions",     value: stats.suggestions,     color: "text-blue-700",   bg: "bg-blue-50",    icon: <Info className="w-5 h-5 text-blue-500" /> },
                            ].map((s, i) => (
                                <Card key={i} className={s.bg}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div><p className="text-xs text-gray-500 mb-1">{s.label}</p><p className={`text-3xl font-semibold ${s.color}`}>{s.value}</p></div>
                                            {s.icon}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {resultat.resume && (
                            <Card className="border-l-4 border-l-gray-400">
                                <CardContent className="p-4">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Synthèse de l'IA</p>
                                    <p className="text-sm text-gray-700">{resultat.resume}</p>
                                </CardContent>
                            </Card>
                        )}

                        {stats.total === 0 && (
                            <Card><CardContent className="p-8 text-center"><CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" /><p className="font-semibold text-gray-900 mb-1">Backlog validé</p><p className="text-sm text-gray-500">Aucune incohérence détectée.</p></CardContent></Card>
                        )}

                        {stats.total > 0 && (
                            <>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">Filtrer :</span>
                                    {["tous", "erreur", "avertissement", "suggestion"].map((f) => (
                                        <button key={f} onClick={() => setFiltreType(f)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${filtreType === f ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                                            {f === "tous" ? `Tous (${stats.total})` : f === "erreur" ? `Erreurs (${stats.erreurs})` : f === "avertissement" ? `Avertissements (${stats.avertissements})` : `Suggestions (${stats.suggestions})`}
                                        </button>
                                    ))}
                                </div>
                                <div className="space-y-3">
                                    {alertesFiltrees.map((alerte, i) => {
                                        const config = TYPE_CONFIG[alerte.type] || TYPE_CONFIG.avertissement;
                                        const Icon = config.icon;
                                        return (
                                            <Card key={i} className={`border ${config.rowClass}`}>
                                                <CardContent className="p-4">
                                                    <div className="flex items-start gap-3">
                                                        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconClass}`} />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.badgeClass}`}>{config.label}</span>
                                                                {alerte.usId && <span className="font-mono text-xs text-gray-500">{alerte.usId}</span>}
                                                                <span className="text-sm font-medium text-gray-900">{alerte.titre}</span>
                                                            </div>
                                                            <p className="text-sm text-gray-600">{alerte.description}</p>
                                                            {alerte.usId && <Link to={`/dashboard/phase4/form?id=${alerte.usId}`} className="inline-flex items-center gap-1 mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium">Corriger cette US →</Link>}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </>
                )}

                <div className="flex gap-3">
                    <Link to="/dashboard/phase4/backlog" className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"><ArrowLeft className="w-4 h-4" /> Retour au backlog</Link>
                    <Link to="/dashboard/phase5/generate" className={`ml-auto flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${!resultat || stats?.erreurs > 0 ? "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
                        Passer à Phase 5 <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                {resultat && stats?.erreurs > 0 && <p className="text-xs text-gray-400 text-right -mt-4">Résolvez les erreurs avant de passer à la Phase 5.</p>}
            </div>
        </div>
    );
}