import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import { useInterviewLive } from "../../../hooks/useInterviewLive";
import { useSuggererQuestions } from "../../../hooks/useSuggererQuestions";
import { useEnregistrement } from "../../../hooks/useEnregistrement";

import { BarreEnregistrement } from "./components/BarreEnregistrement";
import { PanneauQuestions } from "./components/PanneauQuestions";
import { NotesStructurees } from "./components/NotesStructurees";


function ModaleConfirmation({ titre, message, onConfirmer, onAnnuler, labelConfirmer = "Confirmer" }) {
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
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        {labelConfirmer}
                    </button>
                </div>
            </div>
        </div>
    );
}


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


export function Phase1B() {
    const navigate = useNavigate();

    const { live, ajouterElement, supprimerElement, clearLive } = useInterviewLive();
    const { questions, loading, error, genererQuestions, resetQuestions } = useSuggererQuestions();
    const enregistrement = useEnregistrement();

    const [showConfirmRetour, setShowConfirmRetour] = useState(false);
    const [showConfirmNouvelEnreg, setShowConfirmNouvelEnreg] = useState(false);

    const draft = getDraftInfo();
    const notesTexte = getNotesTexte(draft);

    useEffect(() => {
        sessionStorage.setItem("phase1_last", window.location.pathname);
    }, []);


    function handleConfirmRetour() {
        clearLive();
        sessionStorage.removeItem("interview_questions");
        sessionStorage.removeItem("interview_audio");
        sessionStorage.removeItem("interview_marqueurs");
        sessionStorage.removeItem("interview_statut");
        setShowConfirmRetour(false);
        navigate("/dashboard/phase1/interview/new");
    }


    function handleConfirmNouvelEnreg() {
        enregistrement.clearEnregistrement();
        setShowConfirmNouvelEnreg(false);
    }


    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">

                {/* Modales */}
                {showConfirmRetour && (
                    <ModaleConfirmation
                        titre="Confirmer le retour"
                        message={
                            <>
                                Si vous retournez à la préparation, toutes les données saisies dans
                                le mode interview live seront{" "}
                                <strong>perdues définitivement</strong>. Voulez-vous continuer ?
                            </>
                        }
                        onConfirmer={handleConfirmRetour}
                        onAnnuler={() => setShowConfirmRetour(false)}
                        labelConfirmer="Confirmer le retour"
                    />
                )}

                {showConfirmNouvelEnreg && (
                    <ModaleConfirmation
                        titre="Nouvel enregistrement"
                        message={
                            <>
                                L'enregistrement actuel sera{" "}
                                <strong>perdu définitivement</strong>. Voulez-vous continuer ?
                            </>
                        }
                        onConfirmer={handleConfirmNouvelEnreg}
                        onAnnuler={() => setShowConfirmNouvelEnreg(false)}
                    />
                )}

                {/* Titre */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Mode Interview Live</h1>
                    <p className="text-gray-600">Phase 1B</p>
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

                    {/* Colonne gauche — Questions IA */}
                    <div className="col-span-4">
                        <PanneauQuestions
                            questions={questions}
                            loading={loading}
                            error={error}
                            notesTexte={notesTexte}
                            onGenerer={() => genererQuestions(notesTexte)}
                            onReset={resetQuestions}
                        />
                    </div>

                    {/* Colonne centrale — Notes structurées */}
                    <div className="col-span-8">
                        <NotesStructurees
                            live={live}
                            ajouterElement={ajouterElement}
                            supprimerElement={supprimerElement}
                        />
                    </div>

                </div>

                {/* Actions */}
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