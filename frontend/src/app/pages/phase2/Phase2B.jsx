import { useState, useRef, useCallback } from "react";
import { Link } from "react-router";
import {
    Upload, ArrowRight, ArrowLeft, Sparkles, FileText,
    X, ChevronRight, Database, AlertTriangle, CheckCircle,
    RefreshCw
} from "lucide-react";
import { authFetch } from "../../../services/authFetch";

// ─── Encodage PlantUML pour l'API publique ────────────────────────────────────
// L'API plantuml.com attend un encodage spécifique : deflate raw + base64 custom

function encodePlantUML(text) {
    // Encode UTF-8
    const utf8 = unescape(encodeURIComponent(text));

    // Deflate via pako si disponible, sinon fallback zlib-like maison
    // On utilise l'approche native : btoa + encodage custom PlantUML
    const compressed = deflateRaw(utf8);
    return encode64(compressed);
}

function deflateRaw(str) {
    // Compression minimale compatible PlantUML (sans librairie externe)
    // On utilise le mode "stored" de deflate (pas de compression) pour simplicité
    const bytes = [];
    for (let i = 0; i < str.length; i++) {
        bytes.push(str.charCodeAt(i) & 0xff);
    }

    // Header deflate niveau 0 (stored blocks)
    const result = [];
    const BLOCK_SIZE = 32768;
    let offset = 0;

    while (offset < bytes.length) {
        const blockEnd = Math.min(offset + BLOCK_SIZE, bytes.length);
        const isLast = blockEnd === bytes.length ? 1 : 0;
        const blockLen = blockEnd - offset;
        const nLen = (~blockLen) & 0xffff;

        result.push(isLast); // BFINAL + BTYPE=00
        result.push(blockLen & 0xff);
        result.push((blockLen >> 8) & 0xff);
        result.push(nLen & 0xff);
        result.push((nLen >> 8) & 0xff);

        for (let i = offset; i < blockEnd; i++) {
            result.push(bytes[i]);
        }
        offset = blockEnd;
    }

    return result;
}

const PLANTUML_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";

function encode64(data) {
    let r = "";
    for (let i = 0; i < data.length; i += 3) {
        if (i + 2 === data.length) {
            r += append3bytes(data[i], data[i + 1], 0);
            r = r.slice(0, -1);
        } else if (i + 1 === data.length) {
            r += append3bytes(data[i], 0, 0);
            r = r.slice(0, -2);
        } else {
            r += append3bytes(data[i], data[i + 1], data[i + 2]);
        }
    }
    return r;
}

function append3bytes(b1, b2, b3) {
    const c1 = b1 >> 2;
    const c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
    const c3 = ((b2 & 0xf) << 2) | (b3 >> 6);
    const c4 = b3 & 0x3f;
    return PLANTUML_CHARS[c1] + PLANTUML_CHARS[c2] + PLANTUML_CHARS[c3] + PLANTUML_CHARS[c4];
}

function buildPlantUMLUrl(code) {
    const encoded = encodePlantUML(code);
    return `https://www.plantuml.com/plantuml/svg/${encoded}`;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = "phase2_mfc";

function loadMFC() {
    try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch { return null; }
}

function saveMFC(data) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ─── Composant carte Flux ─────────────────────────────────────────────────────

function FluxCard({ flux, index }) {
    const [open, setOpen] = useState(false);

    return (
        <div
            className="group border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-md transition-all duration-200"
            style={{ animationDelay: `${index * 60}ms` }}
        >
            {/* En-tête toujours visible */}
            <button
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center gap-3 p-4 text-left bg-white hover:bg-gray-50 transition-colors"
            >
                {/* Numéro */}
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                </span>

                {/* Émetteur → Récepteur */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-sm font-semibold text-gray-800 truncate">
                        {flux.emetteur || "?"}
                    </span>
                    <ArrowRight className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span className="text-sm font-semibold text-gray-800 truncate">
                        {flux.recepteur || "?"}
                    </span>
                </div>

                {/* Nom du flux */}
                <span className="hidden sm:block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full truncate max-w-[180px]">
                    {flux.nom}
                </span>

                <ChevronRight className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
            </button>

            {/* Détails dépliables */}
            {open && (
                <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-3">

                    {flux.description && (
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Description</p>
                            <p className="text-sm text-gray-700">{flux.description}</p>
                        </div>
                    )}

                    {flux.data && (
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                                <Database className="w-3 h-3" /> Données échangées
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {flux.data.split(",").map((d, i) => (
                                    <span
                                        key={i}
                                        className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium"
                                    >
                                        {d.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Composant principal ───────────────────────────────────────────────────────

export function Phase2B() {

    const saved = loadMFC();
    const [plantUmlCode, setPlantUmlCode] = useState(saved?.code || "");
    const [diagramUrl, setDiagramUrl] = useState(saved?.diagramUrl || "");
    const [flux, setFlux] = useState(saved?.flux || []);
    const [acteurs, setActeurs] = useState(saved?.acteurs || []);

    const [dragging, setDragging] = useState(false);
    const [fileName, setFileName] = useState(saved?.fileName || "");
    const [iaLoading, setIaLoading] = useState(false);
    const [iaError, setIaError] = useState("");
    const [diagramError, setDiagramError] = useState(false);

    const fileInputRef = useRef(null);

    // ── Lecture fichier ────────────────────────────────────────────────────────

    function processFile(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const code = e.target.result;
            setPlantUmlCode(code);
            setFileName(file.name);
            setDiagramError(false);

            const url = buildPlantUMLUrl(code);
            setDiagramUrl(url);

            // Reset résultats IA
            setFlux([]);
            setActeurs([]);
            setIaError("");

            saveMFC({ code, diagramUrl: url, flux: [], acteurs: [], fileName: file.name });
        };
        reader.readAsText(file, "UTF-8");
    }

    function handleFileChange(e) {
        processFile(e.target.files[0]);
        e.target.value = "";
    }

    function handleDrop(e) {
        e.preventDefault();
        setDragging(false);
        processFile(e.dataTransfer.files[0]);
    }

    // ── Analyse IA ─────────────────────────────────────────────────────────────

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

    // ── Reset ──────────────────────────────────────────────────────────────────

    function handleReset() {
        setPlantUmlCode("");
        setDiagramUrl("");
        setFlux([]);
        setActeurs([]);
        setFileName("");
        setIaError("");
        setDiagramError(false);
        sessionStorage.removeItem(STORAGE_KEY);
    }

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Title */}
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

                {/* ── Zone upload ── */}
                {!plantUmlCode ? (
                    <div
                        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 cursor-pointer ${
                            dragging
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                        }`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".puml,.plantuml,.txt,.iuml"
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Upload className="w-8 h-8 text-blue-600" />
                        </div>

                        <h3 className="font-semibold text-gray-900 text-lg mb-2">
                            Importer votre diagramme MFC
                        </h3>
                        <p className="text-gray-500 text-sm mb-1">
                            Glissez-déposez votre fichier PlantUML ici
                        </p>
                        <p className="text-gray-400 text-xs">
                            Formats acceptés : .puml · .plantuml · .iuml · .txt
                        </p>
                    </div>

                ) : (

                    // ── Layout principal après import ──────────────────────────
                    <div className="grid grid-cols-12 gap-6">

                        {/* Colonne gauche : diagramme + actions */}
                        <div className="col-span-7 space-y-4">

                            {/* Fichier importé */}
                            <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
                                <FileText className="w-5 h-5 text-green-600 flex-shrink-0" />
                                <span className="text-sm font-medium text-green-800 flex-1 truncate">
                                    {fileName}
                                </span>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-xs text-green-600 hover:text-green-700 underline"
                                >
                                    Changer
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".puml,.plantuml,.txt,.iuml"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>

                            {/* Diagramme SVG */}
                            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">Aperçu du diagramme</span>
                                    {diagramError && (
                                        <span className="text-xs text-orange-600 flex items-center gap-1">
                                            <AlertTriangle className="w-3 h-3" />
                                            Erreur de rendu
                                        </span>
                                    )}
                                </div>

                                <div className="p-4 min-h-[400px] flex items-center justify-center bg-gray-50">
                                    {diagramUrl && !diagramError ? (
                                        <img
                                            src={diagramUrl}
                                            alt="Diagramme MFC"
                                            className="max-w-full max-h-[500px] object-contain"
                                            onError={() => setDiagramError(true)}
                                        />
                                    ) : diagramError ? (
                                        <div className="text-center text-gray-500">
                                            <AlertTriangle className="w-10 h-10 text-orange-400 mx-auto mb-3" />
                                            <p className="text-sm font-medium">Impossible de générer l'aperçu</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Vérifiez la syntaxe de votre fichier PlantUML
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-400">
                                            <p className="text-sm">Chargement...</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bouton analyse IA */}
                            <button
                                onClick={lancerAnalyseIA}
                                disabled={iaLoading}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:bg-purple-300 transition-colors font-medium"
                            >
                                {iaLoading ? (
                                    <>
                                        <span className="animate-spin">⏳</span>
                                        Analyse en cours...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Analyser les flux avec l'IA
                                    </>
                                )}
                            </button>

                            {iaError && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                    {iaError}
                                </div>
                            )}
                        </div>

                        {/* Colonne droite : résultats IA */}
                        <div className="col-span-5 space-y-4">

                            {/* Acteurs détectés */}
                            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                    <span className="text-sm font-semibold text-gray-700">
                                        Acteurs ({acteurs.length})
                                    </span>
                                    {acteurs.length > 0 && (
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                    )}
                                </div>

                                <div className="p-4">
                                    {acteurs.length === 0 ? (
                                        <p className="text-sm text-gray-400 text-center py-4">
                                            Lance l'analyse IA pour détecter les acteurs
                                        </p>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {acteurs.map((a, i) => (
                                                <span
                                                    key={i}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                                                >
                                                    <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                                                    {a.nom}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Flux détectés */}
                            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                    <span className="text-sm font-semibold text-gray-700">
                                        Flux ({flux.length})
                                    </span>
                                    {flux.length > 0 && (
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                    )}
                                </div>

                                <div className="p-4 space-y-2 max-h-[480px] overflow-y-auto">
                                    {flux.length === 0 ? (
                                        <p className="text-sm text-gray-400 text-center py-4">
                                            Lance l'analyse IA pour extraire les flux
                                        </p>
                                    ) : (
                                        flux.map((f, i) => (
                                            <FluxCard key={i} flux={f} index={i} />
                                        ))
                                    )}
                                </div>
                            </div>

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