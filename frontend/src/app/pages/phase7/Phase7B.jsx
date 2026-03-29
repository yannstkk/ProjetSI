import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeft, ArrowRight, Database, Search, ZoomIn, ZoomOut,
    Maximize2, RefreshCw, Layers, GitBranch, AlertTriangle, Loader2,
} from "lucide-react";
import { authFetch } from "../../../services/authFetch";
import { getProjetCourant } from "../../../services/projetCourant";
import { loadMCD, saveMCD } from "./helpers/mcdStorage";

export function Phase7B() {
    const saved  = loadMCD();
    const projet = getProjetCourant();

    const [mcdData,   setMcdData]   = useState(saved || null);
    const [search,    setSearch]    = useState("");
    const [zoom,      setZoom]      = useState(1);
    const [imgError,  setImgError]  = useState(false);
    const [activeTab, setActiveTab] = useState("entites");
    const [dbLoading, setDbLoading] = useState(false);

    /* Charger depuis BDD si pas en session */
    useEffect(() => {
        if (mcdData?.code || !projet?.id) return;
        setDbLoading(true);
        authFetch(`/api/mcd/projet/${projet.id}`)
            .then(res => res.ok ? res.json() : [])
            .then(liste => {
                if (!liste.length) return;
                const last = liste[liste.length - 1];
                const { buildPlantUMLUrl } = require("../phase2/components/helpers/plantuml");
                const url = last.contenu ? buildPlantUMLUrl(last.contenu) : "";
                const data = {
                    code:       last.contenu || "",
                    diagramUrl: url,
                    fileName:   last.nom || "MCD",
                    nom:        last.nom || "MCD",
                    mcdDbId:    last.idMcd,
                    iaResult:   last.reponseMistral ? JSON.parse(last.reponseMistral) : null,
                };
                setMcdData(data);
                saveMCD(data);
            })
            .catch(() => {})
            .finally(() => setDbLoading(false));
    }, []);

    if (dbLoading) {
        return (
            <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600"/>
                <p className="text-gray-500 text-sm">Chargement du MCD depuis la base de données…</p>
            </div>
        );
    }

    if (!mcdData?.code) {
        return (
            <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Database className="w-8 h-8 text-gray-400"/>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Aucun MCD importé</h2>
                <p className="text-gray-500 text-sm mb-4">Importez d'abord un fichier PlantUML en Phase 7A.</p>
                <Link to="/dashboard/phase7/import"
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
                    Aller à l'import
                </Link>
            </div>
        );
    }

    const iaResult   = mcdData.iaResult;
    const entites    = iaResult?.entites     || [];
    const assocs     = iaResult?.associations|| [];
    const donnees    = iaResult?.donnees     || [];

    const entitesFiltrees = entites.filter(e =>
        !search || e.nom?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto space-y-4">

                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Viewer MCD</h1>
                    <p className="text-gray-600">Phase 7 — Visualisation du Modèle Conceptuel de Données</p>
                </div>

                <div className="grid grid-cols-12 gap-6">

                    {/* ── Diagramme ── */}
                    <div className="col-span-8 space-y-4">
                        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700 truncate">
                                    {mcdData.nom || mcdData.fileName}
                                    {mcdData.mcdDbId && (
                                        <span className="ml-2 text-xs text-emerald-600 inline-flex items-center gap-1">
                                            <Database className="w-3 h-3"/> ID {mcdData.mcdDbId}
                                        </span>
                                    )}
                                </span>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <button onClick={() => setZoom(v => Math.max(0.4, v - 0.15))}
                                        className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                                        <ZoomOut className="w-3.5 h-3.5"/>
                                    </button>
                                    <span className="px-2 text-xs text-gray-500 w-12 text-center">
                                        {Math.round(zoom * 100)}%
                                    </span>
                                    <button onClick={() => setZoom(v => Math.min(2.5, v + 0.15))}
                                        className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                                        <ZoomIn className="w-3.5 h-3.5"/>
                                    </button>
                                    <button onClick={() => setZoom(1)}
                                        className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 ml-1">
                                        <Maximize2 className="w-3.5 h-3.5"/>
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-auto bg-gray-50" style={{ height: "520px" }}>
                                {mcdData.diagramUrl && !imgError ? (
                                    <div className="flex items-center justify-center min-h-full p-6"
                                        style={{ transform: `scale(${zoom})`, transformOrigin: "center top", transition: "transform 200ms ease" }}>
                                        <img src={mcdData.diagramUrl} alt="MCD"
                                            className="max-w-none"
                                            onError={() => setImgError(true)}/>
                                    </div>
                                ) : imgError ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                        <AlertTriangle className="w-10 h-10 text-orange-400 mb-3"/>
                                        <p className="text-sm font-medium">Impossible de rendre le diagramme</p>
                                        <p className="text-xs text-gray-400 mt-1">Vérifiez la syntaxe PlantUML</p>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <Loader2 className="w-6 h-6 animate-spin text-gray-400"/>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Code source PlantUML */}
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                            <div className="px-4 py-2 border-b border-gray-100">
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Code source PlantUML
                                </span>
                            </div>
                            <pre className="text-xs text-gray-600 bg-gray-50 p-4 overflow-auto max-h-48 font-mono leading-relaxed">
                                {mcdData.code.slice(0, 2500)}{mcdData.code.length > 2500 ? "\n… (tronqué)" : ""}
                            </pre>
                        </div>
                    </div>

                    {/* ── Panneau droit ── */}
                    <div className="col-span-4 space-y-4">

                        {/* Tabs */}
                        <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-gray-50 p-1 gap-1">
                            {[
                                { id:"entites",     label:`Entités (${entites.length})`,        icon:Layers     },
                                { id:"assocs",      label:`Assoc. (${assocs.length})`,           icon:GitBranch  },
                                { id:"donnees",     label:`Données (${donnees.length})`,         icon:Database   },
                            ].map(tab => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                        activeTab === tab.id
                                            ? "bg-white text-indigo-700 shadow-sm"
                                            : "text-gray-500 hover:text-gray-700"
                                    }`}>
                                    <tab.icon className="w-3 h-3"/>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Recherche */}
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                            <input
                                placeholder="Rechercher…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-400 transition-colors"
                            />
                        </div>

                        {/* Contenu tab */}
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden" style={{ maxHeight: "520px", overflowY: "auto" }}>
                            {activeTab === "entites" && (
                                <div className="divide-y divide-gray-50">
                                    {entitesFiltrees.length === 0 ? (
                                        <p className="text-sm text-gray-400 text-center py-8">
                                            {iaResult ? "Aucune entité trouvée" : "Lancez l'analyse IA en Phase 7A"}
                                        </p>
                                    ) : entitesFiltrees.map((entite, i) => (
                                        <div key={i} className="p-3 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <div className="w-6 h-6 rounded bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                                    <Layers className="w-3 h-3 text-indigo-600"/>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-800">{entite.nom}</span>
                                            </div>
                                            {entite.attributs?.length > 0 && (
                                                <div className="ml-8 space-y-0.5">
                                                    {entite.attributs.map((attr, j) => (
                                                        <div key={j} className="flex items-center gap-2 text-xs text-gray-500">
                                                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${attr.estCle ? "bg-amber-500" : "bg-gray-300"}`}/>
                                                            <span className={attr.estCle ? "font-medium text-amber-700" : ""}>{attr.nom}</span>
                                                            {attr.type && <span className="text-gray-400 font-mono">{attr.type}</span>}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === "assocs" && (
                                <div className="divide-y divide-gray-50">
                                    {assocs.length === 0 ? (
                                        <p className="text-sm text-gray-400 text-center py-8">
                                            {iaResult ? "Aucune association" : "Lancez l'analyse IA en Phase 7A"}
                                        </p>
                                    ) : assocs.filter(a => !search || a.nom?.toLowerCase().includes(search.toLowerCase())).map((a, i) => (
                                        <div key={i} className="p-3 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-2 mb-1">
                                                <GitBranch className="w-3.5 h-3.5 text-purple-600 flex-shrink-0"/>
                                                <span className="text-sm font-semibold text-gray-800">{a.nom}</span>
                                            </div>
                                            <div className="ml-5 text-xs text-gray-500">
                                                {a.entites?.join(" ↔ ")}
                                                {a.cardinalite && (
                                                    <span className="ml-2 px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded font-mono">
                                                        {a.cardinalite}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === "donnees" && (
                                <div className="divide-y divide-gray-50">
                                    {donnees.length === 0 ? (
                                        <p className="text-sm text-gray-400 text-center py-8">
                                            {iaResult ? "Aucune donnée" : "Lancez l'analyse IA en Phase 7A"}
                                        </p>
                                    ) : donnees.filter(d => !search || d.nom?.toLowerCase().includes(search.toLowerCase())).map((d, i) => (
                                        <div key={i} className="p-3 hover:bg-gray-50 transition-colors flex items-center gap-3">
                                            <Database className="w-3.5 h-3.5 text-blue-500 flex-shrink-0"/>
                                            <div>
                                                <span className="text-sm text-gray-800">{d.nom}</span>
                                                {d.type && <span className="ml-2 text-xs text-gray-400 font-mono">{d.type}</span>}
                                                {d.entite && <p className="text-xs text-gray-400">→ {d.entite}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Stats rapides */}
                        {iaResult && (
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { label:"Entités",      value:entites.length,  color:"bg-indigo-50 text-indigo-700 border-indigo-100" },
                                    { label:"Assoc.",       value:assocs.length,   color:"bg-purple-50 text-purple-700 border-purple-100" },
                                    { label:"Attributs",    value:entites.reduce((s,e)=>s+(e.attributs?.length||0),0), color:"bg-blue-50 text-blue-700 border-blue-100" },
                                ].map(s => (
                                    <div key={s.label} className={`text-center p-2.5 rounded-lg border ${s.color}`}>
                                        <p className="text-xl font-bold">{s.value}</p>
                                        <p className="text-xs font-medium">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-3">
                    <Link to="/dashboard/phase7/import"
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <ArrowLeft className="w-4 h-4"/> Retour à l'import
                    </Link>
                    <Link to="/dashboard/phase7/control"
                        className="ml-auto flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                        Contrôle cohérence <ArrowRight className="w-4 h-4"/>
                    </Link>
                </div>
            </div>
        </div>
    );
}