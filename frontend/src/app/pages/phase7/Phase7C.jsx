import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeft, CheckCircle, XCircle, AlertTriangle,
    FileDown, ArrowRight, Database, FileText, Workflow,
} from "lucide-react";
import { loadMCD } from "./helpers/mcdStorage";
import { loadBacklog } from "../phase4/components/usStorage";
import { loadMFC } from "../phase2/components/helpers/mfcStorage";

export function Phase7C() {
    const mcd     = loadMCD();
    const backlog = loadBacklog();
    const mfc     = loadMFC();

    const iaResult    = mcd?.iaResult || null;
    const entites     = iaResult?.entites     || [];
    const assocs      = iaResult?.associations|| [];

    /* ── Calculs de cohérence ── */
    const coherence = useMemo(() => {
        const alerts = [];
        const ok     = [];

        if (!iaResult) return { alerts, ok, score: 0 };

        /* 1. Entités sans attributs */
        entites.forEach(e => {
            if (!e.attributs?.length) {
                alerts.push({ type:"avertissement", titre:`Entité "${e.nom}" sans attribut`, description:"Cette entité ne possède aucun attribut défini dans le MCD." });
            } else {
                ok.push(`Entité "${e.nom}" — ${e.attributs.length} attribut(s)`);
            }
        });

        /* 2. Données MFC non couvertes par une entité */
        const nomsEntites = new Set(entites.map(e => e.nom?.toLowerCase()));
        const donnesMFC   = new Set();
        (mfc?.flux || []).forEach(f => {
            (f.data || "").split(",").forEach(d => {
                const trimmed = d.trim().toLowerCase();
                if (trimmed) donnesMFC.add(trimmed);
            });
        });
        donnesMFC.forEach(d => {
            if (!nomsEntites.has(d)) {
                alerts.push({ type:"suggestion", titre:`Donnée MFC "${d}" absente du MCD`, description:"Cette donnée circulant dans les flux n'a pas d'entité correspondante dans le MCD." });
            }
        });

        /* 3. Acteurs référencés par US sans entité dans le MCD */
        const acteursUS = new Set(backlog.map(us => us.acteur?.toLowerCase()).filter(Boolean));
        acteursUS.forEach(a => {
            if (!nomsEntites.has(a)) {
                alerts.push({ type:"suggestion", titre:`Acteur "${a}" non modélisé`, description:"Cet acteur présent dans les User Stories n'a pas d'entité dans le MCD." });
            }
        });

        /* 4. Associations sans cardinalité */
        assocs.forEach(a => {
            if (!a.cardinalite) {
                alerts.push({ type:"avertissement", titre:`Association "${a.nom}" sans cardinalité`, description:"La cardinalité de cette association n'a pas été définie." });
            }
        });

        /* 5. Cohérence globale */
        if (entites.length > 0) ok.push(`${entites.length} entité(s) identifiée(s) dans le MCD`);
        if (assocs.length  > 0) ok.push(`${assocs.length} association(s) définie(s)`);
        if (backlog.length > 0) ok.push(`${backlog.length} User Stories disponibles pour la traçabilité`);

        const score = Math.round((ok.length / Math.max(ok.length + alerts.filter(a => a.type === "erreur").length, 1)) * 100);
        return { alerts, ok, score };
    }, [mcd, backlog, mfc]);

    const nbErreurs   = coherence.alerts.filter(a => a.type === "erreur").length;
    const nbAvert     = coherence.alerts.filter(a => a.type === "avertissement").length;
    const nbSugg      = coherence.alerts.filter(a => a.type === "suggestion").length;

    /* ── Export rapport ── */
    function exporterRapport() {
        const lignes = [
            "Rapport de contrôle MCD — Analyse Checker",
            `Date : ${new Date().toLocaleDateString("fr-FR")}`,
            `Projet : ${JSON.parse(sessionStorage.getItem("projet_courant") || "{}").nom || "N/A"}`,
            "",
            `Entités : ${entites.length}`,
            `Associations : ${assocs.length}`,
            `User Stories : ${backlog.length}`,
            "",
            "=== Points validés ===",
            ...coherence.ok.map(o => `✓ ${o}`),
            "",
            "=== Alertes ===",
            ...coherence.alerts.map(a => `[${a.type.toUpperCase()}] ${a.titre} — ${a.description}`),
        ];
        const blob = new Blob([lignes.join("\n")], { type:"text/plain;charset=utf-8" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `rapport-mcd-${new Date().toISOString().slice(0,10)}.txt`;
        a.click();
        URL.revokeObjectURL(a.href);
    }

    const typeConfig = {
        erreur:        { icon:XCircle,       row:"bg-red-50 border-red-200",       badge:"bg-red-100 text-red-700",       label:"Erreur"        },
        avertissement: { icon:AlertTriangle,  row:"bg-yellow-50 border-yellow-200", badge:"bg-yellow-100 text-yellow-700", label:"Avertissement" },
        suggestion:    { icon:AlertTriangle,  row:"bg-blue-50 border-blue-200",     badge:"bg-blue-100 text-blue-700",     label:"Suggestion"    },
    };

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto space-y-6">

                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Contrôle cohérence MCD</h1>
                    <p className="text-gray-600">Phase 7 — Vérification Données ↔ Flux MFC ↔ User Stories</p>
                </div>

                {!iaResult && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-sm flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0"/>
                        Aucune analyse IA disponible. Retournez en Phase 7A et lancez l'analyse pour obtenir les contrôles de cohérence.
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { label:"Entités MCD",   value:entites.length,   icon:Database,    color:"text-indigo-700", bg:"bg-indigo-50", border:"border-indigo-100" },
                        { label:"Associations",  value:assocs.length,    icon:Database,    color:"text-purple-700", bg:"bg-purple-50", border:"border-purple-100" },
                        { label:"User Stories",  value:backlog.length,   icon:FileText,    color:"text-blue-700",   bg:"bg-blue-50",   border:"border-blue-100"   },
                        { label:"Alertes",       value:coherence.alerts.length, icon:AlertTriangle, color:coherence.alerts.length > 0 ? "text-orange-700" : "text-gray-500", bg:coherence.alerts.length > 0 ? "bg-orange-50" : "bg-gray-50", border:coherence.alerts.length > 0 ? "border-orange-100" : "border-gray-100" },
                    ].map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <div key={i} className={`rounded-xl border p-5 flex items-center gap-4 ${s.bg} ${s.border}`}>
                                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                                    <Icon className={`w-5 h-5 ${s.color}`}/>
                                </div>
                                <div>
                                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                                    <p className="text-xs text-gray-500">{s.label}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Barre de score */}
                {iaResult && (
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-gray-700">Score de cohérence globale</span>
                            <span className={`font-bold ${coherence.score >= 80 ? "text-emerald-600" : coherence.score >= 50 ? "text-amber-600" : "text-red-600"}`}>
                                {coherence.score}%
                            </span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-700 ${
                                coherence.score >= 80 ? "bg-emerald-500" : coherence.score >= 50 ? "bg-amber-500" : "bg-red-500"
                            }`} style={{ width:`${coherence.score}%` }}/>
                        </div>
                        <div className="flex gap-4 mt-3 text-xs text-gray-500">
                            <span className="text-red-600 font-medium">{nbErreurs} erreur{nbErreurs !== 1 ? "s" : ""}</span>
                            <span className="text-amber-600 font-medium">{nbAvert} avertissement{nbAvert !== 1 ? "s" : ""}</span>
                            <span className="text-blue-600 font-medium">{nbSugg} suggestion{nbSugg !== 1 ? "s" : ""}</span>
                        </div>
                    </div>
                )}

                {/* Points validés */}
                {coherence.ok.length > 0 && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-emerald-800 mb-3">
                            <CheckCircle className="w-4 h-4"/> Points validés ({coherence.ok.length})
                        </h3>
                        <div className="space-y-1.5">
                            {coherence.ok.map((o, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-emerald-700">
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0"/>
                                    {o}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Alertes */}
                {coherence.alerts.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-700">
                            Alertes détectées ({coherence.alerts.length})
                        </h3>
                        {coherence.alerts.map((alert, i) => {
                            const cfg  = typeConfig[alert.type] || typeConfig.suggestion;
                            const Icon = cfg.icon;
                            return (
                                <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border ${cfg.row}`}>
                                    <Icon className="w-4 h-4 flex-shrink-0 mt-0.5 text-current opacity-70"/>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}>
                                                {cfg.label}
                                            </span>
                                            <span className="text-sm font-medium text-gray-900">{alert.titre}</span>
                                        </div>
                                        <p className="text-sm text-gray-600">{alert.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Aucune alerte */}
                {iaResult && coherence.alerts.length === 0 && (
                    <div className="text-center py-10">
                        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3"/>
                        <p className="font-semibold text-gray-900 mb-1">MCD validé</p>
                        <p className="text-sm text-gray-500">Aucune incohérence détectée.</p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    <Link to="/dashboard/phase7/viewer"
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <ArrowLeft className="w-4 h-4"/> Retour au viewer
                    </Link>
                    {iaResult && (
                        <button onClick={exporterRapport}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                            <FileDown className="w-4 h-4"/> Exporter rapport
                        </button>
                    )}
                    <Link to="/dashboard"
                        className="ml-auto flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                        <CheckCircle className="w-4 h-4"/> Projet terminé
                    </Link>
                </div>
            </div>
        </div>
    );
}