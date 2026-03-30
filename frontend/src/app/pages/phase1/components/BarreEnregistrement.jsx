import { useRef } from "react";
import { Mic, Clock, Bookmark, AlertTriangle, X } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";

function formaterTemps(secondes) {
    const h = Math.floor(secondes / 3600).toString().padStart(2, "0");
    const m = Math.floor((secondes % 3600) / 60).toString().padStart(2, "0");
    const s = (secondes % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
}

export function BarreEnregistrement({
    statut,
    tempsEcoule,
    marqueurs,
    audioUrl,
    audioPauseUrl,
    limitAtteinte,
    ecouteEnPause,
    setEcouteEnPause,
    onDemarrer,
    onPause,
    onReprendre,
    onArreter,
    onMarquer,
    onSupprimerMarqueur,
    onNouvelEnregistrement,
}) {
    const audioRef = useRef(null);
    const audioPauseRef = useRef(null);

    function allerVersMarqueur(temps) {
        if (audioRef.current) {
            audioRef.current.currentTime = temps;
            audioRef.current.play();
        }
    }

    const borderColor =
        statut === "recording" ? "border-l-red-600" :
        statut === "paused"    ? "border-l-orange-500" :
        statut === "stopped"   ? "border-l-gray-400" :
        "border-l-blue-600";

    const iconBg =
        statut === "recording" ? "bg-red-100" :
        statut === "paused"    ? "bg-orange-100" :
        statut === "stopped"   ? "bg-gray-100" :
        "bg-blue-100";

    const iconColor =
        statut === "recording" ? "text-red-600" :
        statut === "paused"    ? "text-orange-500" :
        statut === "stopped"   ? "text-gray-400" :
        "text-blue-600";

    const statutLabel =
        statut === "idle"      ? "Prêt à enregistrer" :
        statut === "recording" ? "Enregistrement en cours" :
        statut === "paused"    ? "Enregistrement en pause" :
        "Enregistrement terminé";

    return (
        <Card className={`mb-4 border-l-4 ${borderColor}`}>
            <CardContent className="p-4 space-y-4">

                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}>
                            <Mic className={`w-5 h-5 ${iconColor}`} />
                        </div>
                        <div>
                            <div className="font-medium text-sm">{statutLabel}</div>
                            <div className="text-xs text-gray-600 flex items-center gap-2">
                                <Clock className="w-3 h-3" />
                                <span className="font-mono">{formaterTemps(tempsEcoule)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">

                        {statut === "idle" && (
                            <button
                                onClick={onDemarrer}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                            >
                                <Mic className="w-4 h-4" />
                                Démarrer
                            </button>
                        )}

                        {statut === "recording" && (
                            <>
                                <button
                                    onClick={onMarquer}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm"
                                >
                                    <Bookmark className="w-4 h-4" />
                                    Marquer
                                </button>
                                <button
                                    onClick={onPause}
                                    className="px-4 py-2 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 text-sm"
                                >
                                    Pause
                                </button>
                                <button
                                    onClick={() => onArreter(false)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                                >
                                    Stop
                                </button>
                            </>
                        )}

                        {statut === "paused" && (
                            <>
                                <button
                                    onClick={onMarquer}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm"
                                >
                                    <Bookmark className="w-4 h-4" />
                                    Marquer
                                </button>
                                <button
                                    onClick={() => setEcouteEnPause(!ecouteEnPause)}
                                    className="px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 text-sm"
                                >
                                    {ecouteEnPause ? "Masquer lecteur" : "Écouter"}
                                </button>
                                <button
                                    onClick={onReprendre}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm"
                                >
                                    Reprendre
                                </button>
                                <button
                                    onClick={() => onArreter(false)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                                >
                                    Stop
                                </button>
                            </>
                        )}

                        {statut === "stopped" && (
                            <button
                                onClick={onNouvelEnregistrement}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                            >
                                Nouvel enregistrement
                            </button>
                        )}

                    </div>
                </div>

                {limitAtteinte && (
                    <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-300 rounded-lg text-yellow-800 text-sm">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        Limite de 5MB atteinte — l'enregistrement s'est arrêté automatiquement.
                    </div>
                )}

                {statut === "paused" && ecouteEnPause && audioPauseUrl && (
                    <div className="space-y-2">
                        <p className="text-xs text-gray-500">
                            Écoute en pause — cliquez sur Reprendre pour continuer l'enregistrement
                        </p>
                        <audio
                            ref={audioPauseRef}
                            src={audioPauseUrl}
                            controls
                            className="w-full"
                        />
                        {marqueurs.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {marqueurs.map((m) => (
                                    <button
                                        key={m.id}
                                        onClick={() => {
                                            if (audioPauseRef.current) {
                                                audioPauseRef.current.currentTime = m.temps;
                                                audioPauseRef.current.play();
                                            }
                                        }}
                                        className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700 hover:bg-blue-100"
                                    >
                                        <Bookmark className="w-3 h-3" />
                                        {m.label} — {formaterTemps(m.temps)}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {statut === "stopped" && audioUrl && (
                    <div className="space-y-3">
                        <audio
                            ref={audioRef}
                            src={audioUrl}
                            controls
                            className="w-full"
                        />
                        {marqueurs.length > 0 && (
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-600">
                                    Marqueurs ({marqueurs.length}) — cliquez pour vous déplacer
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {marqueurs.map((m) => (
                                        <div key={m.id} className="flex items-center gap-1">
                                            <button
                                                onClick={() => allerVersMarqueur(m.temps)}
                                                className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700 hover:bg-blue-100"
                                            >
                                                <Bookmark className="w-3 h-3" />
                                                {m.label} — {formaterTemps(m.temps)}
                                            </button>
                                            <button
                                                onClick={() => onSupprimerMarqueur(m.id)}
                                                className="text-gray-300 hover:text-red-500"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

            </CardContent>
        </Card>
    );
}