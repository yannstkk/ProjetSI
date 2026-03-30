import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Download, Save } from "lucide-react";

import { useInterviewLive } from "../../../hooks/useInterviewLive";
import { useSuggererQuestions } from "../../../hooks/useSuggererQuestions";
import { useEnregistrement } from "../../../hooks/useEnregistrement";

import { BarreEnregistrement } from "./components/BarreEnregistrement";
import { PanneauQuestions } from "./components/PanneauQuestions";
import { NotesStructurees } from "./components/NotesStructurees";
import { BoutonIA } from "../../components/BoutonIA";

import { getProjetCourant } from "../../../services/projetCourant";
import {
    buildInterviewPayload,
    createInterview,
    updateInterview,
    interviewExistsInDb,
    getInterviewId,
    loadInterviewIntoSession,
    getInterviewByProjet,
} from "../../../services/interviewService";
import {
    saveNotesFromSession,
    saveNotesStructureesFromSession,
    saveQuestionsFromSession,
    saveParticipantsFromSession,
    loadNotesIntoSession,
    loadNotesStructureesIntoSession,
    loadQuestionsIntoSession,
    loadParticipantsIntoSession,
} from "../../../services/notesService";

function Modale({ titre, message, onConfirmer, onAnnuler, labelConfirmer = "Confirmer", danger = false }) {
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{titre}</h3>
                <p className="text-sm text-gray-600 mb-6">{message}</p>
                <div className="flex gap-3 justify-end">
                    <button onClick={onAnnuler} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Annuler</button>
                    <button onClick={onConfirmer} className={`px-4 py-2 text-white rounded-lg ${danger ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}>{labelConfirmer}</button>
                </div>
            </div>
        </div>
    );
}

function getDraftInfo() {
    try { return JSON.parse(sessionStorage.getItem("interview_draft") || "{}"); } catch { return {}; }
}

export function Phase1B() {
    const navigate = useNavigate();
    const { live, ajouterElement, supprimerElement, clearLive, setLive } = useInterviewLive();
    const { questions, loading: questionsLoading, error: questionsError, genererQuestions, resetQuestions, setQuestions } = useSuggererQuestions();
    const enregistrement = useEnregistrement();

    const [showConfirmRetour, setShowConfirmRetour] = useState(false);
    const [showConfirmNouvelEnreg, setShowConfirmNouvelEnreg] = useState(false);
    const [showConfirmSave, setShowConfirmSave] = useState(false);
    const [showConfirmImport, setShowConfirmImport] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [importLoading, setImportLoading] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [importSuccess, setImportSuccess] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [draft, setDraft] = useState(getDraftInfo());
    const notesTexte = (draft.notesImportees || []).map((n) => n.contenu).join("\n\n");

    useEffect(() => { sessionStorage.setItem("phase1_last", window.location.pathname); }, []);

    function refreshDraft() { setDraft(getDraftInfo()); }

    function handleConfirmRetour() {
        clearLive();
        sessionStorage.removeItem("interview_questions");
        sessionStorage.removeItem("interview_audio");
        sessionStorage.removeItem("interview_marqueurs");
        sessionStorage.removeItem("interview_statut");
        setShowConfirmRetour(false);
        navigate("/dashboard/phase1/interview/new");
    }

    async function handleConfirmImport() {
        setShowConfirmImport(false);
        setImportLoading(true);
        setSaveError("");
        const projet = getProjetCourant();
        if (!projet) { setSaveError("Aucun projet sélectionné."); setImportLoading(false); return; }
        try {
            const interview = await getInterviewByProjet(projet.id);
            if (!interview) { setSaveError("Aucune interview trouvée en base pour ce projet."); setImportLoading(false); return; }
            loadInterviewIntoSession(interview);
            await loadNotesIntoSession(interview.numeroInterview);
            await loadParticipantsIntoSession(interview.numeroInterview);
            const newLive = await loadNotesStructureesIntoSession(interview.numeroInterview);
            const newQuestions = await loadQuestionsIntoSession(interview.numeroInterview);
            if (newLive) setLive(newLive);
            if (newQuestions) setQuestions(newQuestions);
            refreshDraft();
            setImportSuccess(true);
            setTimeout(() => setImportSuccess(false), 3000);
        } catch (err) {
            setSaveError("Erreur lors de l'import : " + err.message);
        } finally {
            setImportLoading(false);
        }
    }

    async function handleConfirmSave() {
        setShowConfirmSave(false);
        setSaveLoading(true);
        setSaveError("");
        setSaveSuccess(false);
        const projet = getProjetCourant();
        if (!projet) { setSaveError("Aucun projet sélectionné."); setSaveLoading(false); return; }
        try {
            const payload = buildInterviewPayload(projet.id);
            const existsDb = interviewExistsInDb();
            let numeroInterview;
            if (existsDb) {
                numeroInterview = getInterviewId();
                await updateInterview(numeroInterview, payload);
            } else {
                const created = await createInterview(payload);
                numeroInterview = created.numeroInterview;
                sessionStorage.setItem("interview_id", String(numeroInterview));
                sessionStorage.setItem("interview_exists_in_db", "true");
            }
            await saveNotesFromSession(numeroInterview);
            await saveNotesStructureesFromSession(numeroInterview);
            await saveQuestionsFromSession(numeroInterview);
            await saveParticipantsFromSession(numeroInterview);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            setSaveError("Erreur lors de l'enregistrement : " + err.message);
        } finally {
            setSaveLoading(false);
        }
    }

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                {showConfirmRetour && <Modale titre="Confirmer le retour" message="Si vous retournez à la préparation, toutes les données du mode live seront perdues définitivement." onConfirmer={handleConfirmRetour} onAnnuler={() => setShowConfirmRetour(false)} labelConfirmer="Confirmer le retour" danger />}
                {showConfirmNouvelEnreg && <Modale titre="Nouvel enregistrement" message="L'enregistrement actuel sera perdu définitivement." onConfirmer={() => { enregistrement.clearEnregistrement(); setShowConfirmNouvelEnreg(false); }} onAnnuler={() => setShowConfirmNouvelEnreg(false)} danger />}
                {showConfirmSave && <Modale titre="Enregistrer en base de données" message={interviewExistsInDb() ? "Les données existantes seront mises à jour. Confirmer ?" : "L'interview et les notes vont être sauvegardées. Confirmer ?"} onConfirmer={handleConfirmSave} onAnnuler={() => setShowConfirmSave(false)} labelConfirmer="Enregistrer" />}
                {showConfirmImport && <Modale titre="Importer depuis la base de données" message="Les données actuelles en session seront écrasées par les données de la base. Confirmer ?" onConfirmer={handleConfirmImport} onAnnuler={() => setShowConfirmImport(false)} labelConfirmer="Importer" danger />}

                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Mode Interview Live</h1>
                        <p className="text-gray-600">Phase 1 — Interview en cours</p>
                    </div>
                    <button onClick={() => setShowConfirmImport(true)} disabled={importLoading} className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors font-medium">
                        <Download className="w-4 h-4" />
                        {importLoading ? "Import..." : "Importer depuis la base"}
                    </button>
                </div>

                {saveSuccess && <div className="mb-4 p-3 bg-green-50 border border-green-300 rounded-lg text-green-700 text-sm">Interview enregistrée avec succès en base de données.</div>}
                {importSuccess && <div className="mb-4 p-3 bg-blue-50 border border-blue-300 rounded-lg text-blue-700 text-sm">Données importées depuis la base de données.</div>}
                {saveError && <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm">{saveError}</div>}

                {draft.titre && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-medium text-blue-900">{draft.titre}</p>
                        {draft.participants?.filter((p) => p.nom).length > 0 && (
                            <p className="text-xs text-blue-700 mt-1">Participants : {draft.participants.filter((p) => p.nom).map((p) => p.role ? `${p.nom} (${p.role})` : p.nom).join(", ")}</p>
                        )}
                    </div>
                )}

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

                <div className="grid grid-cols-12 gap-4">
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
                    <div className="col-span-8">
                        <NotesStructurees live={live} ajouterElement={ajouterElement} supprimerElement={supprimerElement} />
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <button onClick={() => setShowConfirmRetour(true)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Retour à la préparation</button>
                    <button onClick={() => setShowConfirmSave(true)} disabled={saveLoading} className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-300 transition-colors font-medium">
                        <Save className="w-4 h-4" />
                        {saveLoading ? "Enregistrement..." : "Enregistrer"}
                    </button>
                </div>
            </div>
        </div>
    );
}