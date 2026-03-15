import { useState } from "react";
import { useNavigate } from "react-router";
import {
    Plus, AlertTriangle, Mic, Clock,
    Bookmark, Sparkles, RotateCcw, X
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Input } from "../../components/ui/input";
import { useInterviewLive } from "../../../hooks/useInterviewLive";
import { useSuggererQuestions } from "../../../hooks/useSuggererQuestions";
import { useRef } from "react";
import { useEffect } from "react";

import { useEnregistrement } from "../../../hooks/useEnregistrement";

// Composant onglet texte simple (Besoins, Règles, Solutions)
function OngletTexte({ items, onAjouter, onSupprimer, placeholder }) {
    const [valeur, setValeur] = useState("");

    function handleAjouter() {
        if (!valeur.trim()) return;
        onAjouter({ texte: valeur.trim() });
        setValeur("");
    }

    return (
        <div className="space-y-3 mt-4">
            {/* Champ ajout */}
            <div className="flex gap-2">
                <Input
                    placeholder={placeholder}
                    value={valeur}
                    onChange={(e) => setValeur(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAjouter()}
                />
                <button
                    onClick={handleAjouter}
                    disabled={!valeur.trim()}
                    className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors text-sm flex-shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    Ajouter
                </button>
            </div>

            {/* Liste */}
            {items.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                    Aucun élément
                </p>
            )}

            {items.map((item) => (
                <div
                    key={item.id}
                    className="flex items-start justify-between p-3 bg-gray-50 rounded border border-gray-200 group"
                >
                    <p className="text-sm text-gray-700 flex-1">{item.texte}</p>
                    <button
                        onClick={() => onSupprimer(item.id)}
                        className="ml-2 text-gray-300 hover:text-red-600 transition-colors flex-shrink-0"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}

function OngletDonnees({ items, onAjouter, onSupprimer }) {
    const [nom, setNom] = useState("");
    const [type, setType] = useState("texte");

    function handleAjouter() {
        if (!nom.trim()) return;
        onAjouter({ nom: nom.trim(), type });
        setNom("");
        setType("texte");
    }

    const typeColors = {
        texte: "bg-blue-100 text-blue-700",
        nombre: "bg-green-100 text-green-700",
        date: "bg-purple-100 text-purple-700",
        booléen: "bg-orange-100 text-orange-700",
    };

    return (
        <div className="space-y-3 mt-4">
            {/* Champ ajout */}
            <div className="flex gap-2">
                <Input
                    placeholder="Nom de la donnée"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAjouter()}
                    className="flex-1"
                />
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                    <option value="texte">Texte</option>
                    <option value="nombre">Nombre</option>
                    <option value="date">Date</option>
                    <option value="booléen">Booléen</option>
                </select>
                <button
                    onClick={handleAjouter}
                    disabled={!nom.trim()}
                    className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors text-sm flex-shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    Ajouter
                </button>
            </div>

            {/* Liste */}
            {items.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                    Aucune donnée
                </p>
            )}

            {items.map((item) => (
                <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200"
                >
                    <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${typeColors[item.type]}`}>
                            {item.type}
                        </span>
                        <p className="text-sm text-gray-700">{item.nom}</p>
                    </div>
                    <button
                        onClick={() => onSupprimer(item.id)}
                        className="ml-2 text-gray-300 hover:text-red-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}

// Composant onglet Contraintes (texte + niveau)
function OngletContraintes({ items, onAjouter, onSupprimer }) {
    const [texte, setTexte] = useState("");
    const [niveau, setNiveau] = useState("important");

    function handleAjouter() {
        if (!texte.trim()) return;
        onAjouter({ texte: texte.trim(), niveau });
        setTexte("");
        setNiveau("important");
    }

    const niveauColors = {
        bloquant: "bg-red-100 text-red-700",
        important: "bg-yellow-100 text-yellow-700",
        mineur: "bg-green-100 text-green-700",
    };

    return (
        <div className="space-y-3 mt-4">
            {/* Champ ajout */}
            <div className="flex gap-2">
                <Input
                    placeholder="Décrire la contrainte"
                    value={texte}
                    onChange={(e) => setTexte(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAjouter()}
                    className="flex-1"
                />
                <select
                    value={niveau}
                    onChange={(e) => setNiveau(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                    <option value="bloquant">Bloquant</option>
                    <option value="important">Important</option>
                    <option value="mineur">Mineur</option>
                </select>
                <button
                    onClick={handleAjouter}
                    disabled={!texte.trim()}
                    className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors text-sm flex-shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    Ajouter
                </button>
            </div>

            {/* Liste */}
            {items.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                    Aucune contrainte
                </p>
            )}

            {items.map((item) => (
                <div
                    key={item.id}
                    className="flex items-start justify-between p-3 bg-gray-50 rounded border border-gray-200"
                >
                    <div className="flex items-start gap-2 flex-1">
                        <span className={`text-xs px-2 py-0.5 rounded font-medium flex-shrink-0 mt-0.5 ${niveauColors[item.niveau]}`}>
                            {item.niveau}
                        </span>
                        <p className="text-sm text-gray-700">{item.texte}</p>
                    </div>
                    <button
                        onClick={() => onSupprimer(item.id)}
                        className="ml-2 text-gray-300 hover:text-red-600 transition-colors flex-shrink-0"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}

// Composant principal
export function Phase1B() {
    const navigate = useNavigate();
    const { live, ajouterElement, supprimerElement, clearLive } = useInterviewLive();
    const { questions, loading, error, genererQuestions, resetQuestions } = useSuggererQuestions();
    const [showConfirm, setShowConfirm] = useState(false);

     useEffect(() => {
            sessionStorage.setItem("phase1_last", window.location.pathname);
        }, []);


    const [showConfirmNouvelEnreg, setShowConfirmNouvelEnreg] = useState(false);

    const {
        statut,
        tempsEcoule,
        marqueurs,
        audioUrl,
        audioPauseUrl,
        limitAtteinte,
        ecouteEnPause,
        setEcouteEnPause,
        demarrer,
        pause,
        reprendre,
        arreter,
        marquer,
        supprimerMarqueur,
        clearEnregistrement,
    } = useEnregistrement();

    const audioRef = useRef(null);
    const audioPauseRef = useRef(null);

    function formaterTemps(secondes) {
        const h = Math.floor(secondes / 3600).toString().padStart(2, "0");
        const m = Math.floor((secondes % 3600) / 60).toString().padStart(2, "0");
        const s = (secondes % 60).toString().padStart(2, "0");
        return `${h}:${m}:${s}`;
    }

    function allerVersMarqueur(temps) {
        if (audioRef.current) {
            audioRef.current.currentTime = temps;
            audioRef.current.play();
        }
    }

    const draft = (() => {
        try {
            const saved = sessionStorage.getItem("interview_draft");
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    })();

    const notesTexte = draft?.notesImportees
        ?.map((n) => n.contenu)
        .join("\n\n") || "";

    function handleRetourClick() {
        setShowConfirm(true);
    }

    function handleConfirmRetour() {
        clearLive();
        sessionStorage.removeItem("interview_questions");
        sessionStorage.removeItem("interview_audio");
        sessionStorage.removeItem("interview_marqueurs");
        sessionStorage.removeItem("interview_statut");
        setShowConfirm(false);
        navigate("/dashboard/phase1/interview/new");
    }

    function handleAnnulerRetour() {
        setShowConfirm(false);
    }

    const counts = {
        besoins: live.besoins.length,
        regles: live.regles.length,
        donnees: live.donnees.length,
        contraintes: live.contraintes.length,
        solutions: live.solutions.length,
    };

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">

                {/* Modale confirmation retour */}
                {showConfirm && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
                            <h3 className="font-semibold text-lg text-gray-900 mb-2">
                                Confirmer le retour
                            </h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Si vous retournez à la préparation, toutes les données
                                saisies dans le mode interview live seront{" "}
                                <strong>perdues définitivement</strong>. Voulez-vous continuer ?
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={handleAnnulerRetour}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleConfirmRetour}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Confirmer le retour
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            {/* Modale confirmation nouvel enregistrement */}
            {showConfirmNouvelEnreg && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">
                            Nouvel enregistrement
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                            L'enregistrement actuel sera <strong>perdu définitivement</strong>.
                            Voulez-vous continuer ?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowConfirmNouvelEnreg(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={() => {
                                    clearEnregistrement();
                                    setShowConfirmNouvelEnreg(false);
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            )}



                {/* Title */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Mode Interview Live
                    </h1>
                    <p className="text-gray-600">
                        Phase 1B
                    </p>
                </div>

                {/* Infos brouillon */}
                {draft && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-medium text-blue-900">
                            {draft.titre || "Entretien sans titre"}
                        </p>
                        {draft.participants?.filter((p) => p.nom).length > 0 && (
                            <p className="text-xs text-blue-700 mt-1">
                                Participants :{" "}
                                {draft.participants
                                    .filter((p) => p.nom)
                                    .map((p) => p.nom)
                                    .join(", ")}
                            </p>
                        )}
                    </div>
                )}




            {/* Barre enregistrement */}
                        <Card className={`mb-4 border-l-4 ${
                            statut === "recording" ? "border-l-red-600" :
                            statut === "paused"    ? "border-l-orange-500" :
                            statut === "stopped"   ? "border-l-gray-400" :
                            "border-l-blue-600"
                        }`}>
                            <CardContent className="p-4 space-y-4">

                                {/* Ligne principale */}
                                <div className="flex items-center justify-between">

                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                            statut === "recording" ? "bg-red-100" :
                                            statut === "paused"    ? "bg-orange-100" :
                                            statut === "stopped"   ? "bg-gray-100" :
                                            "bg-blue-100"
                                        }`}>
                                            <Mic className={`w-5 h-5 ${
                                                statut === "recording" ? "text-red-600" :
                                                statut === "paused"    ? "text-orange-500" :
                                                statut === "stopped"   ? "text-gray-400" :
                                                "text-blue-600"
                                            }`} />
                                        </div>

                                        <div>
                                            <div className="font-medium text-sm">
                                                {statut === "idle"      && "Prêt à enregistrer"}
                                                {statut === "recording" && "Enregistrement en cours"}
                                                {statut === "paused"    && "Enregistrement en pause"}
                                                {statut === "stopped"   && "Enregistrement terminé"}
                                            </div>
                                            <div className="text-xs text-gray-600 flex items-center gap-2">
                                                <Clock className="w-3 h-3" />
                                                <span className="font-mono">{formaterTemps(tempsEcoule)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Boutons selon statut */}
                                    <div className="flex gap-2">

                                        {statut === "idle" && (
                                            <button
                                                onClick={demarrer}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                                            >
                                                <Mic className="w-4 h-4" />
                                                Démarrer
                                            </button>
                                        )}

                                        {statut === "recording" && (
                                            <>
                                                <button
                                                    onClick={marquer}
                                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm"
                                                >
                                                    <Bookmark className="w-4 h-4" />
                                                    Marquer
                                                </button>
                                                <button
                                                    onClick={pause}
                                                    className="px-4 py-2 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 text-sm"
                                                >
                                                    Pause
                                                </button>
                                                <button
                                                    onClick={() => arreter(false)}
                                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                                                >
                                                    Stop
                                                </button>
                                            </>
                                        )}

                                        {statut === "paused" && (
                                            <>
                                                <button
                                                    onClick={marquer}
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
                                                    onClick={reprendre}
                                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm"
                                                >
                                                    Reprendre
                                                </button>
                                                <button
                                                    onClick={() => arreter(false)}
                                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                                                >
                                                    Stop
                                                </button>
                                            </>
                                        )}

                                        {statut === "stopped" && (
                                            <button
                                                onClick={() => setShowConfirmNouvelEnreg(true)}
                                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                                            >
                                                Nouvel enregistrement
                                            </button>
                                        )}

                                    </div>
                                </div>

                                {/* Notification limite atteinte */}
                                {limitAtteinte && (
                                    <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-300 rounded-lg text-yellow-800 text-sm">
                                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                        Limite de 5MB atteinte — l'enregistrement s'est arrêté automatiquement.
                                    </div>
                                )}

                                {/* Lecteur pendant pause */}
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

                                {/* Lecteur final après stop */}
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
                                                                onClick={() => supprimerMarqueur(m.id)}
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



                {/* Layout principal */}
                <div className="grid grid-cols-12 gap-4">

                    {/* Colonne gauche */}
                    <div className="col-span-4 space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-purple-600" />
                                    Questions suggérées
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <button
                                    onClick={() => genererQuestions(notesTexte)}
                                    disabled={loading || !notesTexte}
                                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-300 transition-colors text-sm"
                                >
                                    {loading ? (
                                        <>
                                            <span className="animate-spin">⏳</span>
                                            Génération...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4" />
                                            Générer avec l'IA
                                        </>
                                    )}
                                </button>

                                {!notesTexte && (
                                    <p className="text-xs text-gray-500 text-center">
                                        Importez des notes dans la préparation pour activer la génération
                                    </p>
                                )}

                                {error && (
                                    <p className="text-xs text-red-600">{error}</p>
                                )}

                                {questions.length > 0 && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-medium text-gray-700">
                                                {questions.length} questions générées
                                            </p>
                                            <button
                                                onClick={resetQuestions}
                                                className="text-xs text-gray-400 hover:text-gray-600"
                                            >
                                                <RotateCcw className="w-3 h-3" />
                                            </button>
                                        </div>
                                        {questions.map((q, index) => (
                                            <div
                                                key={index}
                                                className="p-2 bg-purple-50 rounded border border-purple-200"
                                            >
                                                <p className="text-xs text-gray-400 mb-1">Q{index + 1}</p>
                                                <p className="text-sm text-gray-700">{q.question}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Colonne centrale */}
                    <div className="col-span-8">
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>Notes structurées</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="besoins">
                                    <TabsList className="grid grid-cols-5 w-full">
                                        <TabsTrigger value="besoins">
                                            Besoins {counts.besoins > 0 && `(${counts.besoins})`}
                                        </TabsTrigger>
                                        <TabsTrigger value="regles">
                                            Règles {counts.regles > 0 && `(${counts.regles})`}
                                        </TabsTrigger>
                                        <TabsTrigger value="donnees">
                                            Données {counts.donnees > 0 && `(${counts.donnees})`}
                                        </TabsTrigger>
                                        <TabsTrigger value="contraintes">
                                            Contraintes {counts.contraintes > 0 && `(${counts.contraintes})`}
                                        </TabsTrigger>
                                        <TabsTrigger value="solutions">
                                            Solutions {counts.solutions > 0 && `(${counts.solutions})`}
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="besoins">
                                        <OngletTexte
                                            items={live.besoins}
                                            onAjouter={(el) => ajouterElement("besoins", el)}
                                            onSupprimer={(id) => supprimerElement("besoins", id)}
                                            placeholder="Décrire le besoin..."
                                        />
                                    </TabsContent>

                                    <TabsContent value="regles">
                                        <OngletTexte
                                            items={live.regles}
                                            onAjouter={(el) => ajouterElement("regles", el)}
                                            onSupprimer={(id) => supprimerElement("regles", id)}
                                            placeholder="Décrire la règle métier..."
                                        />
                                    </TabsContent>

                                    <TabsContent value="donnees">
                                        <OngletDonnees
                                            items={live.donnees}
                                            onAjouter={(el) => ajouterElement("donnees", el)}
                                            onSupprimer={(id) => supprimerElement("donnees", id)}
                                        />
                                    </TabsContent>

                                    <TabsContent value="contraintes">
                                        <OngletContraintes
                                            items={live.contraintes}
                                            onAjouter={(el) => ajouterElement("contraintes", el)}
                                            onSupprimer={(id) => supprimerElement("contraintes", id)}
                                        />
                                    </TabsContent>

                                    <TabsContent value="solutions">
                                        <OngletTexte
                                            items={live.solutions}
                                            onAjouter={(el) => ajouterElement("solutions", el)}
                                            onSupprimer={(id) => supprimerElement("solutions", id)}
                                            placeholder="Décrire la solution proposée..."
                                        />
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>



                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                    <button
                        onClick={handleRetourClick}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Retour
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Pause
                    </button>
                </div>

            </div>
        </div>
    );
}