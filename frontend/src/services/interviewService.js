import { authFetch } from "./authFetch";

/**
 * Récupère l'interview d'un projet depuis la BDD
 * Retourne null si aucune interview n'existe (404)
 */
export async function getInterviewByProjet(idProjet) {
    const res = await authFetch(`/api/interviews/projet/${idProjet}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
    return res.json();
}

/**
 * Crée une nouvelle interview en BDD (POST)
 */
export async function createInterview(data) {
    const res = await authFetch("/api/interviews", {
        method: "POST",
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
    return res.json();
}

/**
 * Met à jour une interview existante en BDD (PUT)
 */
export async function updateInterview(idProjet, data) {
    const res = await authFetch(`/api/interviews/${idProjet}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
    return res.json();
}

/**
 * Construit l'objet à envoyer au back depuis sessionStorage
 */
export function buildInterviewPayload(idProjet) {
    try {
        const draft = JSON.parse(sessionStorage.getItem("interview_draft") || "{}");
        const live  = JSON.parse(sessionStorage.getItem("interview_live")  || "{}");

        return {
            idProjet,
            sujet:        draft.objectifs   || draft.titre || "",
            dateInterview: draft.dateHeure  ? draft.dateHeure.split("T")[0] : null,
            nomInterviewer: draft.participants
                ? JSON.stringify(draft.participants)
                : "[]",
            participants:  JSON.stringify(draft.participants || []),
            besoins:       JSON.stringify(live.besoins      || []),
            regles:        JSON.stringify(live.regles        || []),
            donnees:       JSON.stringify(live.donnees       || []),
            contraintes:   JSON.stringify(live.contraintes   || []),
            solutions:     JSON.stringify(live.solutions     || []),
        };
    } catch {
        return null;
    }
}

/**
 * Charge une interview depuis la BDD vers sessionStorage
 */
export function loadInterviewIntoSession(interview) {
    // Reconstruire interview_draft
    const draft = {
        titre:          interview.sujet || "",
        dateHeure:      interview.dateInterview || "",
        duree:          "",
        objectifs:      interview.sujet || "",
        participants:   safeParseJson(interview.participants, []),
        notesImportees: [],
    };

    // Reconstruire interview_live
    const live = {
        besoins:     safeParseJson(interview.besoins,     []),
        regles:      safeParseJson(interview.regles,      []),
        donnees:     safeParseJson(interview.donnees,     []),
        contraintes: safeParseJson(interview.contraintes, []),
        solutions:   safeParseJson(interview.solutions,   []),
    };

    sessionStorage.setItem("interview_draft", JSON.stringify(draft));
    sessionStorage.setItem("interview_live",  JSON.stringify(live));
    sessionStorage.setItem("interview_exists_in_db", "true");
}

function safeParseJson(value, fallback) {
    try {
        return value ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
}

/**
 * Indique si l'interview courante existe déjà en BDD
 */
export function interviewExistsInDb() {
    return sessionStorage.getItem("interview_exists_in_db") === "true";
}

/**
 * Réinitialise les flags interview en sessionStorage
 */
export function clearInterviewSession() {
    sessionStorage.removeItem("interview_draft");
    sessionStorage.removeItem("interview_live");
    sessionStorage.removeItem("interview_exists_in_db");
    sessionStorage.removeItem("interview_questions");
    sessionStorage.removeItem("interview_audio");
    sessionStorage.removeItem("interview_marqueurs");
    sessionStorage.removeItem("interview_statut");
}