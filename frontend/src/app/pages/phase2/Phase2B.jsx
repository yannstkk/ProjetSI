import { useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeft, ArrowRight, RefreshCw,
    Database, Loader2, CheckCircle, Upload
} from "lucide-react";

import { authFetch }        from "../../../services/authFetch";
import { getProjetCourant } from "../../../services/projetCourant";
import { buildPlantUMLUrl } from "./components/helpers/plantuml";
import { loadMFC, saveMFC, clearMFC } from "./components/helpers/mfcStorage";

import { ZoneUpload }       from "./components/ZoneUpload";
import { DiagrammePreview } from "./components/DiagrammePreview";
import { PanneauResultats } from "./components/PanneauResultats";

export function Phase2B() {
    const saved = loadMFC();

    const [plantUmlCode, setPlantUmlCode] = useState(saved?.code       || "");
    const [diagramUrl,   setDiagramUrl]   = useState(saved?.diagramUrl || "");
    const [flux,         setFlux]         = useState(saved?.flux        || []);
    const [acteurs,      setActeurs]      = useState(saved?.acteurs     || []);
    const [fileName,     setFileName]     = useState(saved?.fileName    || "");
    const [mfcDbId,      setMfcDbId]      = useState(saved?.mfcDbId    || null);

    const [diagramError, setDiagramError] = useState(false);
    const [iaLoading,    setIaLoading]    = useState(false);
    const [iaError,      setIaError]      = useState("");

    const [dbLoading,    setDbLoading]    = useState(false);
    const [dbError,      setDbError]      = useState("");
    const [dbSuccess,    setDbSuccess]    = useState(false);

    const [showUpload,   setShowUpload]   = useState(false);

    const hasData    = flux.length > 0 || acteurs.length > 0;
    const hasDiagram = !!plantUmlCode;


    function handleFileProcessed(code, name) {
        const url = buildPlantUMLUrl(code);
        setPlantUmlCode(code);
        setFileName(name);
        setDiagramUrl(url);
        setDiagramError(false);
        setFlux([]);
        setActeurs([]);
        setIaError("");
        setShowUpload(false);
        saveMFC({ code, diagramUrl: url, flux: [], acteurs: [], fileName: name, mfcDbId });
    }


    async function lancerAnalyseIA() {
        if (!plantUmlCode.trim()) return;
        setIaLoading(true);
        setIaError("");
        try {
            const response = await authFetch("/api/modelisation/mfc/analyser", {
                method: "POST",
                body: plantUmlCode,
                headers: { "Content-Type": "text/plain" },
            });
            if (!response.ok) throw new Error(`Erreur serveur : ${response.status}`);
            const data = await response.json();
            const fluxData = data?.flux || [];

            const acteursSet = new Set();
            fluxData.forEach((f) => {
                if (f.emetteur)  acteursSet.add(f.emetteur);
                if (f.recepteur) acteursSet.add(f.recepteur);
            });
            const acteursListe = Array.from(acteursSet).map((nom) => ({ nom }));

            setFlux(fluxData);
            setActeurs(acteursListe);

            saveMFC({ code: plantUmlCode, diagramUrl, flux: fluxData, acteurs: acteursListe, fileName, mfcDbId });
        } catch (err) {
            setIaError("Erreur lors de l'analyse : " + err.message);
        } finally {
            setIaLoading(false);
        }
    }


    async function handleSauvegarderBdd() {
        if (!plantUmlCode.trim() || flux.length === 0) {
            setDbError("Analysez d'abord le diagramme avec l'IA avant de sauvegarder.");
            return;
        }
        const projet = getProjetCourant();
        if (!projet?.id) { setDbError("Aucun projet sélectionné."); return; }

        setDbLoading(true);
        setDbError("");
        setDbSuccess(false);

        try {
            const res = await authFetch("/api/modelisation/mfc/analyser-importer", {
                method: "POST",
                body: JSON.stringify({
                    plantUmlContent: plantUmlCode,
                    projetId:        projet.id,
                    nom:             fileName || "MFC sans nom",
                }),
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Erreur serveur ${res.status} : ${text}`);
            }
            const data = await res.json();
            const newDbId = data.idMfc || data.id || null;

            setMfcDbId(newDbId);
            setDbSuccess(true);
            saveMFC({ code: plantUmlCode, diagramUrl, flux, acteurs, fileName, mfcDbId: newDbId });
            setTimeout(() => setDbSuccess(false), 3000);
        } catch (err) {
            setDbError("Erreur lors de la sauvegarde : " + err.message);
        } finally {
            setDbLoading(false);
        }
    }


    function handleReset() {
        setPlantUmlCode(""); setDiagramUrl(""); setFlux([]); setActeurs([]);
        setFileName(""); setMfcDbId(null); setIaError(""); setDbError("");
        setDbSuccess(false); setDiagramError(false); setShowUpload(false);
        clearMFC();
    }


    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Flux MFC</h1>
                        <p className="text-gray-600">Phase 2B — Modèle de Flux de Communication</p>
                    </div>
                    {(hasDiagram || hasData) && (
                        <button onClick={handleReset}
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-red-200 transition-colors">
                            <RefreshCw className="w-3.5 h-3.5" /> Réinitialiser
                        </button>
                    )}
                </div>

                {dbSuccess && (
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm">
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        MFC sauvegardé en base de données avec succès.
                    </div>
                )}
                {dbError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {dbError}
                    </div>
                )}

                {!hasDiagram && !hasData && (
                    <ZoneUpload onFileProcessed={handleFileProcessed} />
                )}

                {!hasDiagram && hasData && (
                    <div className="space-y-4">

                        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                            <Database className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-blue-900">
                                    MFC chargé depuis la base de données
                                    {mfcDbId ? ` (ID : ${mfcDbId})` : ""}
                                </p>
                                <p className="text-xs text-blue-600 mt-0.5">
                                    Le fichier PlantUML n'est pas conservé en base. Importez-le pour visualiser le diagramme et resauvegarder.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowUpload((v) => !v)}
                                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                            >
                                <Upload className="w-3.5 h-3.5" />
                                {showUpload ? "Masquer" : "Importer le fichier .puml"}
                            </button>
                        </div>

                        {showUpload && (
                            <ZoneUpload onFileProcessed={handleFileProcessed} compact />
                        )}

                        <PanneauResultats acteurs={acteurs} flux={flux} />
                    </div>
                )}

                {hasDiagram && (
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-5 space-y-4">
                            <DiagrammePreview
                                fileName={fileName}
                                diagramUrl={diagramUrl}
                                diagramError={diagramError}
                                iaLoading={iaLoading}
                                iaError={iaError}
                                onChangerFichier={handleFileProcessed}
                                onAnalyserIA={lancerAnalyseIA}
                                onDiagramError={() => setDiagramError(true)}
                            />

                            <button
                                onClick={handleSauvegarderBdd}
                                disabled={dbLoading || flux.length === 0}
                                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                                    flux.length === 0
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : mfcDbId
                                            ? "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300"
                                            : "bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-emerald-300"
                                }`}
                            >
                                {dbLoading
                                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Sauvegarde...</>
                                    : <><Database className="w-4 h-4" />
                                      {mfcDbId ? "Resauvegarder en BDD" : "Sauvegarder en BDD"}</>
                                }
                            </button>
                        </div>

                        <div className="col-span-7">
                            <PanneauResultats acteurs={acteurs} flux={flux} />
                        </div>
                    </div>
                )}

                <div className="flex gap-3 pt-2">
                    <Link to="/dashboard/phase2/actors"
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                        <ArrowLeft className="w-4 h-4" /> Retour aux acteurs
                    </Link>
                    <Link to="/dashboard/phase2/coherence"
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium ml-auto">
                        Vérifier la cohérence <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

            </div>
        </div>
    );
}