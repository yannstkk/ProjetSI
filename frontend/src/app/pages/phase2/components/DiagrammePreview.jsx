import { useRef } from "react";
import { FileText, AlertTriangle, Sparkles } from "lucide-react";

export function DiagrammePreview({
    fileName,
    diagramUrl,
    diagramError,
    iaLoading,
    iaError,
    onChangerFichier,
    onAnalyserIA,
    onDiagramError,
}) {
    const fileInputRef = useRef(null);

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => onChangerFichier(ev.target.result, file.name);
        reader.readAsText(file, "UTF-8");
        e.target.value = "";
    }

    return (
        <div className="space-y-4">

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

            {/* Aperçu SVG */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                        Aperçu du diagramme
                    </span>
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
                            onError={onDiagramError}
                        />
                    ) : diagramError ? (
                        <div className="text-center text-gray-500">
                            <AlertTriangle className="w-10 h-10 text-orange-400 mx-auto mb-3" />
                            <p className="text-sm font-medium">
                                Impossible de générer l'aperçu
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Vérifiez la syntaxe de votre fichier PlantUML
                            </p>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400">Chargement...</p>
                    )}
                </div>
            </div>

            {/* Bouton analyse IA */}
            <button
                onClick={onAnalyserIA}
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

            {/* Erreur IA */}
            {iaError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    {iaError}
                </div>
            )}

        </div>
    );
}