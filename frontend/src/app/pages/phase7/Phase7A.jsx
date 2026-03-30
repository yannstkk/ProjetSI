import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Upload, FileText, X, ArrowRight, Database, Loader2, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { authFetch } from "../../../services/authFetch";
import { getProjetCourant } from "../../../services/projetCourant";
import { loadMCD, saveMCD, clearMCD } from "./helpers/mcdStorage";
import { buildPlantUMLUrl } from "../phase2/components/helpers/plantuml";
import { BoutonIA } from "../../components/BoutonIA";

export function Phase7A() {
    const saved = loadMCD();
    const [plantUmlCode, setPlantUmlCode] = useState(saved?.code       || "");
    const [diagramUrl,   setDiagramUrl]   = useState(saved?.diagramUrl || "");
    const [fileName,     setFileName]     = useState(saved?.fileName    || "");
    const [nom,          setNom]          = useState(saved?.nom         || "");
    const [mcdDbId,      setMcdDbId]      = useState(saved?.mcdDbId     || null);
    const [dragging,     setDragging]     = useState(false);
    const [diagramError, setDiagramError] = useState(false);
    const [dbLoading,    setDbLoading]    = useState(false);
    const [dbError,      setDbError]      = useState("");
    const [dbSuccess,    setDbSuccess]    = useState(false);
    const [iaLoading,    setIaLoading]    = useState(false);
    const [iaError,      setIaError]      = useState("");
    const [iaResult,     setIaResult]     = useState(saved?.iaResult || null);
    const fileInputRef = useRef(null);

    function handleFile(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const code = e.target.result;
            const url = buildPlantUMLUrl(code);
            setPlantUmlCode(code); setDiagramUrl(url); setFileName(file.name);
            setNom(file.name.replace(/\.(puml|plantuml|iuml|txt)$/, ""));
            setDiagramError(false); setIaResult(null);
            saveMCD({ code, diagramUrl: url, fileName: file.name, nom: file.name.replace(/\.(puml|plantuml|iuml|txt)$/, ""), mcdDbId, iaResult: null });
        };
        reader.readAsText(file, "UTF-8");
    }

    function handleDrop(e) { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }
    function handleFileChange(e) { handleFile(e.target.files[0]); e.target.value = ""; }

    async function analyserAvecIA() {
        if (!plantUmlCode.trim()) return;
        setIaLoading(true); setIaError("");
        try {
            const res = await authFetch("/api/mcd/analyser", { method: "POST", body: JSON.stringify({ contenuPlantuml: plantUmlCode }) });
            if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
            const data = await res.json();
            setIaResult(data);
            saveMCD({ code: plantUmlCode, diagramUrl, fileName, nom, mcdDbId, iaResult: data });
        } catch (err) {
            setIaError("Erreur lors de l'analyse : " + err.message);
        } finally {
            setIaLoading(false);
        }
    }

    async function sauvegarderBdd() {
        if (!plantUmlCode.trim() || !nom.trim()) { setDbError("Importez un fichier et donnez un nom avant de sauvegarder."); return; }
        const projet = getProjetCourant();
        if (!projet?.id) { setDbError("Aucun projet sélectionné."); return; }
        setDbLoading(true); setDbError(""); setDbSuccess(false);
        try {
            const res = await authFetch("/api/mcd", { method: "POST", body: JSON.stringify({ idProjet: projet.id, nom: nom.trim(), contenu: plantUmlCode, reponseMistral: iaResult ? JSON.stringify(iaResult) : null }) });
            if (!res.ok) throw new Error(`Erreur serveur ${res.status}`);
            const created = await res.json();
            setMcdDbId(created.idMcd);
            saveMCD({ code: plantUmlCode, diagramUrl, fileName, nom, mcdDbId: created.idMcd, iaResult });
            setDbSuccess(true); setTimeout(() => setDbSuccess(false), 3000);
        } catch (err) {
            setDbError("Erreur : " + err.message);
        } finally {
            setDbLoading(false);
        }
    }

    function handleReset() {
        setPlantUmlCode(""); setDiagramUrl(""); setFileName(""); setNom("");
        setMcdDbId(null); setIaResult(null); setIaError(""); setDbError(""); setDiagramError(false);
        clearMCD();
    }

    const hasDiagram = !!plantUmlCode;

    return (
        <div className="p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Import MCD</h1>
                        <p className="text-gray-600">Phase 7 — Importation du Modèle Conceptuel de Données</p>
                    </div>
                    {hasDiagram && (
                        <button onClick={handleReset} className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-red-200 transition-colors">
                            <RefreshCw className="w-3.5 h-3.5"/> Réinitialiser
                        </button>
                    )}
                </div>

                {dbSuccess && <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm"><CheckCircle className="w-4 h-4 flex-shrink-0"/>MCD sauvegardé en base de données avec succès.</div>}
                {dbError && <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"><AlertTriangle className="w-4 h-4 flex-shrink-0"/> {dbError}</div>}

                {!hasDiagram && (
                    <div className={`border-2 border-dashed rounded-2xl p-14 text-center transition-all cursor-pointer ${dragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"}`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}>
                        <input ref={fileInputRef} type="file" accept=".puml,.plantuml,.txt,.iuml" className="hidden" onChange={handleFileChange}/>
                        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><Upload className="w-8 h-8 text-indigo-600"/></div>
                        <h3 className="font-semibold text-gray-900 text-lg mb-2">Importer votre MCD PlantUML</h3>
                        <p className="text-gray-500 text-sm mb-1">Glissez-déposez votre fichier ici</p>
                        <p className="text-gray-400 text-xs">Formats : .puml · .plantuml · .iuml · .txt</p>
                    </div>
                )}

                {hasDiagram && (
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-5 space-y-4">
                            <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                                <FileText className="w-5 h-5 text-emerald-600 flex-shrink-0"/>
                                <span className="text-sm font-medium text-emerald-800 flex-1 truncate">{fileName}</span>
                                <button onClick={() => fileInputRef.current?.click()} className="text-xs text-emerald-600 hover:text-emerald-700 underline flex-shrink-0">Changer</button>
                                <input ref={fileInputRef} type="file" accept=".puml,.plantuml,.txt,.iuml" className="hidden" onChange={handleFileChange}/>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">Aperçu MCD</span>
                                    {diagramError && <span className="text-xs text-orange-600 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Erreur de rendu</span>}
                                    {mcdDbId && <span className="text-xs text-emerald-600 flex items-center gap-1"><Database className="w-3 h-3"/> Sauvegardé (ID {mcdDbId})</span>}
                                </div>
                                <div className="p-4 min-h-[320px] flex items-center justify-center bg-gray-50">
                                    {diagramUrl && !diagramError ? (
                                        <img src={diagramUrl} alt="MCD" className="max-w-full max-h-[400px] object-contain" onError={() => setDiagramError(true)}/>
                                    ) : (
                                        <div className="text-center text-gray-500">
                                            <AlertTriangle className="w-10 h-10 text-orange-400 mx-auto mb-3"/>
                                            <p className="text-sm">Impossible de rendre le diagramme</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Nom du MCD</label>
                                    <input type="text" value={nom} onChange={e => { setNom(e.target.value); saveMCD({ code: plantUmlCode, diagramUrl, fileName, nom: e.target.value, mcdDbId, iaResult }); }} placeholder="Ex: MCD Facturation v1" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"/>
                                </div>
                                <button onClick={sauvegarderBdd} disabled={dbLoading || !nom.trim()} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-emerald-300 transition-colors font-medium text-sm">
                                    {dbLoading ? <><Loader2 className="w-4 h-4 animate-spin"/> Sauvegarde...</> : <><Database className="w-4 h-4"/>{mcdDbId ? "Mettre à jour en BDD" : "Sauvegarder en BDD"}</>}
                                </button>
                            </div>

                            <BoutonIA onClick={analyserAvecIA} loading={iaLoading} loadingText="Analyse en cours..." className="w-full justify-center">
                                Analyser avec l'IA
                            </BoutonIA>
                            {iaError && <p className="text-sm text-red-600 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5"/> {iaError}</p>}
                        </div>

                        <div className="col-span-7">
                            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm h-full">
                                <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-700">Analyse IA du MCD</span>
                                </div>
                                <div className="p-4">
                                    {!iaResult && !iaLoading && (
                                        <div className="text-center py-12 text-gray-400">
                                            <p className="text-sm">Cliquez sur "Analyser avec l'IA" pour extraire les entités, associations et données du MCD.</p>
                                        </div>
                                    )}
                                    {iaResult && <IaResultPanel result={iaResult}/>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex gap-3">
                    <Link to="/dashboard/phase7/viewer" className={`ml-auto flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${hasDiagram ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"}`}>
                        Visualiser le MCD <ArrowRight className="w-4 h-4"/>
                    </Link>
                </div>
            </div>
        </div>
    );
}

function IaResultPanel({ result }) {
    const entites      = result?.entites      || [];
    const associations = result?.associations || [];
    const alertes      = result?.alertes      || [];
    return (
        <div className="space-y-4">
            {result.resume && (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Synthèse</p>
                    <p className="text-sm text-gray-700">{result.resume}</p>
                </div>
            )}
            {entites.length > 0 && (
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Entités ({entites.length})</p>
                    <div className="flex flex-wrap gap-2">
                        {entites.map((e, i) => (
                            <span key={i} className="px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-lg text-xs font-medium text-blue-700">
                                {e.nom}{e.attributs?.length > 0 && <span className="ml-1 text-blue-400">({e.attributs.length} attr.)</span>}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            {associations.length > 0 && (
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Associations ({associations.length})</p>
                    <div className="space-y-1.5">
                        {associations.map((a, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-gray-600 px-3 py-1.5 bg-gray-50 rounded-lg">
                                <span className="font-medium text-gray-800">{a.nom}</span>
                                <span className="text-gray-400 text-xs">{a.cardinalite}</span>
                                <span className="text-gray-500 text-xs">{a.entites?.join(" ↔ ")}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {alertes.length > 0 && (
                <div>
                    <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-2">Alertes ({alertes.length})</p>
                    {alertes.map((a, i) => (
                        <div key={i} className="flex items-start gap-2 p-2.5 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-800 mb-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"/>{a}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}