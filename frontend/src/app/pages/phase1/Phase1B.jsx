import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import { useInterviewLive } from "../../../hooks/useInterviewLive";
import { useSuggererQuestions } from "../../../hooks/useSuggererQuestions";
import { useEnregistrement } from "../../../hooks/useEnregistrement";

import { BarreEnregistrement } from "./components/BarreEnregistrement";
import { PanneauQuestions } from "./components/PanneauQuestions";
import { NotesStructurees } from "./components/NotesStructurees";

import { getProjetCourant } from "../../../services/projetCourant";
import {
    buildInterviewPayload,
    createInterview,
    updateInterview,
    interviewExistsInDb,
} from "../../../services/interviewService";
import { saveNotesFromSession } from "../../../services/notesService";

// ─── Modale générique ─────────────────────────────────────────────────────────

function Modale({ titre, message, onConfirmer, onAnnuler, labelConfirmer = "Confirmer", danger = false }) {
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{titre}</h3>
                <p className="text-sm text-gray-600 mb-6">{message}</p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onAnnuler}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirmer}
                        className={`px-4 py-2 text-white rounded-lg ${
                            danger
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {labelConfirmer}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Helpers sessionStorage ───────────────────────────────────────────────────

function getDraftInfo() {
    try {
        const saved = sessionStorage.getItem("interview_draft");
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
}

function getNotesTexte(draft) {
    return draft?.notesImportees?.map((n) => n.contenu).join("\n\n") || "";
}

// ─── Composant principal ──────────────────────────────────────────────────────

export function Phase1B() {
    const navigate = useNavigate();

    const { live, ajouterElement, supprimerElement, clearLive } = useInterviewLive();
    const { questions, loading: questionsLoading, error: questionsError, genererQuestions, resetQuestions } = useSuggererQuestions();
    const enregistrement = useEnregistrement();

    const [showConfirmRetour, setShowConfirmRetour]       = useState(false);
    const [showConfirmNouvelEnreg, setShowConfirmNouvelEnreg] = useState(false);
    const [showConfirmSave, setShowConfirmSave]           = useState(false);

    const [saveLoading, setSaveLoading] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError]     = useState("");

    const draft      = getDraftInfo();
    const notesTexte = getNotesTexte(draft);

    useEffect(() => {
        sessionStorage.setItem("phase1_last", window.location.pathname);
    }, []);

    // ── Retour vers préparation ───────────────────────────────────────────────

    function handleConfirmRetour() {
        clearLive();
        sessionStorage.removeItem("interview_questions");
        sessionStorage.removeItem("interview_audio");
        sessionStorage.removeItem("interview_marqueurs");
        sessionStorage.removeItem("interview_statut");
        setShowConfirmRetour(false);
        navigate("/dashboard/phase1/interview/new");
    }

    // ── Enregistrement en BDD ─────────────────────────────────────────────────

    async function handleConfirmSave() {
        setShowConfirmSave(false);
        setSaveLoading(true);
        setSaveError("");
        setSaveSuccess(false);

        const projet = getProjetCourant();
        if (!projet) {
            setSaveError("Aucun projet sélectionné.");
            setSaveLoading(false);
            return;
        }

        try {
            const payload  = buildInterviewPayload(projet.id);
            const existsDb = interviewExistsInDb();

            // 1. Sauvegarder l'interview
            if (existsDb) {
                await updateInterview(projet.id, payload);
            } else {
                await createInterview(payload);
                // Marquer comme existante en BDD pour les prochains saves
                sessionStorage.setItem("interview_exists_in_db", "true");
            }

            // 2. Sauvegarder les notes importées
            await saveNotesFromSession(projet.id);

            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);

        } catch (err) {
            setSaveError("Erreur lors de l'enregistrement : " + err.message);
        } finally {
            setSaveLoading(false);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">

                {/* Modales */}
                {showConfirmRetour && (
                    <Modale
                        titre="Confirmer le retour"
                        message="Si vous retournez à la préparation, toutes les données du mode live seront perdues définitivement."
                        onConfirmer={handleConfirmRetour}
                        onAnnuler={() => setShowConfirmRetour(false)}
                        labelConfirmer="Confirmer le retour"
                        danger
                    />
                )}

                {showConfirmNouvelEnreg && (
                    <Modale
                        titre="Nouvel enregistrement"
                        message="L'enregistrement actuel sera perdu définitivement."
                        onConfirmer={() => {
                            enregistrement.clearEnregistrement();
                            setShowConfirmNouvelEnreg(false);
                        }}
                        onAnnuler={() => setShowConfirmNouvelEnreg(false)}
                        danger
                    />
                )}

                {showConfirmSave && (
                    <Modale
                        titre="Enregistrer en base de données"
                        message={
                            interviewExistsInDb()
                                ? "Les données existantes seront mises à jour. Confirmer ?"
                                : "L'interview et les notes vont être sauvegardées en base de données. Confirmer ?"
                        }
                        onConfirmer={handleConfirmSave}
                        onAnnuler={() => setShowConfirmSave(false)}
                        labelConfirmer="Enregistrer"
                    />
                )}

                {/* Titre */}
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Mode Interview Live
                        </h1>
                        <p className="text-gray-600">Phase 1B</p>
                    </div>

                    {/* Bouton Enregistrer */}
                    <button
                        onClick={() => setShowConfirmSave(true)}
                        disabled={saveLoading}
                        className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-300 transition-colors font-medium"
                    >
                        {saveLoading ? "Enregistrement..." : "💾 Enregistrer"}
                    </button>
                </div>

                {/* Messages save */}
                {saveSuccess && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-300 rounded-lg text-green-700 text-sm">
                        ✓ Interview enregistrée avec succès en base de données.
                    </div>
                )}
                {saveError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm">
                        {saveError}
                    </div>
                )}

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
                <BarreEnregistrement
                    statut={enregistrement.statut}
                    tempsEcoule={enregistrement.tempsEcoule}
                    marqueurs={enregistrement.marqueurs}
                    audioUrl={enregistrement.audioUrl}
                    audioPauseUrl={enregistrement.audioPauseUrl}
                    limitAtteinte={enregistrement.limitAtteinte}
                    ecouteEnPause={enregistrement.ecouteEnPause}
                    setEcouteEnPause={enregistrement.setEcouteEnPause}
                    onDemarrer={enregistrement.demarrer}
                    onPause={enregistrement.pause}
                    onReprendre={enregistrement.reprendre}
                    onArreter={enregistrement.arreter}
                    onMarquer={enregistrement.marquer}
                    onSupprimerMarqueur={enregistrement.supprimerMarqueur}
                    onNouvelEnregistrement={() => setShowConfirmNouvelEnreg(true)}
                />

                {/* Layout principal */}
                <div className="grid grid-cols-12 gap-4">

                    {/* Questions IA */}
                    <div className="col-span-4">
                        <PanneauQuestions
                            questions={questions}
                            loading={questionsLoading}
                            error={questionsError}
                            notesTexte={notesTexte}
                            onGenerer={() => genererQuestions(notesTexte)}
                            onReset={resetQuestions}
                        />
                    </div>

                    {/* Notes structurées */}
                    <div className="col-span-8">
                        <NotesStructurees
                            live={live}
                            ajouterElement={ajouterElement}
                            supprimerElement={supprimerElement}
                        />
                    </div>

                </div>

                {/* Actions bas de page */}
                <div className="mt-6 flex gap-3">
                    <button
                        onClick={() => setShowConfirmRetour(true)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Retour
                    </button>
                </div>

            </div>
        </div>
    );
}