import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";

import { authFetch } from "../../../services/authFetch";
import { buildPlantUMLUrl } from "./components/helpers/plantuml";
import { loadMFC, saveMFC, clearMFC } from "./components/helpers/mfcStorage";

import { ZoneUpload } from "./components/ZoneUpload";
import { DiagrammePreview } from "./components/DiagrammePreview";
import { PanneauResultats } from "./components/PanneauResultats";

// ─── Composant principal ──────────────────────────────────────────────────────

export function Phase2B() {
    const saved = loadMFC();

    const [plantUmlCode, setPlantUmlCode]   = useState(saved?.code || "");
    const [diagramUrl, setDiagramUrl]       = useState(saved?.diagramUrl || "");
    const [flux, setFlux]                   = useState(saved?.flux || []);
    const [acteurs, setActeurs]             = useState(saved?.acteurs || []);
    const [fileName, setFileName]           = useState(saved?.fileName || "");
    const [diagramError, setDiagramError]   = useState(false);
    const [iaLoading, setIaLoading]         = useState(false);
    const [iaError, setIaError]             = useState("");

    // ── Traitement fichier ────────────────────────────────────────────────────

    function handleFileProcessed(code, name) {
        const url = buildPlantUMLUrl(code);

        setPlantUmlCode(code);
        setFileName(name);
        setDiagramUrl(url);
        setDiagramError(false);
        setFlux([]);
        setActeurs([]);
        setIaError("");

        saveMFC({ code, diagramUrl: url, flux: [], acteurs: [], fileName: name });
    }

    // ── Analyse IA ────────────────────────────────────────────────────────────

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

            // Extraire les acteurs uniques depuis les flux
            const acteursSet = new Set();
            fluxData.forEach((f) => {
                if (f.emetteur) acteursSet.add(f.emetteur);
                if (f.recepteur) acteursSet.add(f.recepteur);
            });
            const acteursListe = Array.from(acteursSet).map((nom) => ({ nom }));

            setFlux(fluxData);
            setActeurs(acteursListe);

            saveMFC({
                code: plantUmlCode,
                diagramUrl,
                flux: fluxData,
                acteurs: acteursListe,
                fileName,
            });

        } catch (err) {
            setIaError("Erreur lors de l'analyse : " + err.message);
        } finally {
            setIaLoading(false);
        }
    }

    // ── Reset ─────────────────────────────────────────────────────────────────

    function handleReset() {
        setPlantUmlCode("");
        setDiagramUrl("");
        setFlux([]);
        setActeurs([]);
        setFileName("");
        setIaError("");
        setDiagramError(false);
        clearMFC();
    }

    // ─────────────────────────────────────────────────────────────────────────

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Titre */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Flux MFC</h1>
                        <p className="text-gray-600">
                            Phase 2B — Modèle de Flux de Communication
                        </p>
                    </div>

                    {plantUmlCode && (
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-red-200 transition-colors"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Réinitialiser
                        </button>
                    )}
                </div>

                {/* Contenu : zone upload OU layout principal */}
                {!plantUmlCode ? (
                    <ZoneUpload onFileProcessed={handleFileProcessed} />
                ) : (
                    <div className="grid grid-cols-12 gap-6">

                        {/* Colonne gauche : aperçu + actions */}
                        <div className="col-span-5">
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
                        </div>

                        {/* Colonne droite : résultats IA */}
                        <div className="col-span-6">
                            <PanneauResultats acteurs={acteurs} flux={flux} />
                        </div>

                    </div>
                )}

                {/* Navigation */}
                <div className="flex gap-3 pt-2">
                    <Link
                        to="/dashboard/phase2/actors"
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour aux acteurs
                    </Link>

                    <Link
                        to="/dashboard/phase2/coherence"
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium ml-auto"
                    >
                        Vérifier la cohérence
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

            </div>
        </div>
    );
}