import { authFetch } from "./authFetch";



export async function getInterviewByProjet(idProjet) {
    const res = await authFetch(`/api/interviews/projet/${idProjet}`);
    if (!res.ok) return null;
    const liste = await res.json();
    return liste.length > 0 ? liste[0] : null;
}



export async function createInterview(data) {
    const res = await authFetch("/api/interviews", {
        method: "POST",
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
    return res.json();
}


export async function updateInterview(numeroInterview, data) {
    const res = await authFetch(`/api/interviews/${numeroInterview}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
    return res.json();
}



export function buildInterviewPayload(idProjet) {
    try {
        const draft = JSON.parse(sessionStorage.getItem("interview_draft") || "{}");
        const dateHeure = draft.dateHeure || "";


        let objectifs = draft.objectifs || "";
        if (draft.duree && draft.duree.trim()) {
            const dureeTag = `[Durée estimée : ${draft.duree.trim()}]`;
            if (!objectifs.includes("[Durée estimée :")) {
                objectifs = objectifs
                    ? `${dureeTag}\n${objectifs}`
                    : dureeTag;
            }
        }

        return {
            idProjet,
            titre:          draft.titre     || "",
            objectifs,
            dateInterview:  dateHeure ? dateHeure.split("T")[0]  : null,
            heureInterview: dateHeure || null,
            nomInterviewer: draft.participants
                ? draft.participants
                    .filter((p) => p.nom && p.nom.trim())
                    .map((p) => p.nom.trim())
                    .join(", ")
                : "",
        };
    } catch {
        return null;
    }
}



export function loadInterviewIntoSession(interview) {
    let existingDraft = {};
    try {
        const raw = sessionStorage.getItem("interview_draft");
        if (raw) existingDraft = JSON.parse(raw);
    } catch {
    }

    let objectifs = interview.objectifs || "";
    let duree = existingDraft.duree || "";
    const dureeMatch = objectifs.match(/^\[Durée estimée : (.+?)\]\n?/);
    if (dureeMatch) {
        duree = dureeMatch[1];
        objectifs = objectifs.replace(dureeMatch[0], "").trim();
    }

    const draft = {
        titre:          interview.titre          || "",
        objectifs,
        dateHeure:      interview.heureInterview || "",
        duree,
        participants:   existingDraft.participants || [],
        notesImportees: existingDraft.notesImportees || [],
    };

    sessionStorage.setItem("interview_draft",         JSON.stringify(draft));
    sessionStorage.setItem("interview_id",            String(interview.numeroInterview));
    sessionStorage.setItem("interview_exists_in_db",  "true");
}




export function interviewExistsInDb() {
    return sessionStorage.getItem("interview_exists_in_db") === "true";
}


export function getInterviewId() {
    const id = sessionStorage.getItem("interview_id");
    return id ? Number(id) : null;
}




export function clearInterviewSession() {
    sessionStorage.removeItem("interview_draft");
    sessionStorage.removeItem("interview_live");
    sessionStorage.removeItem("interview_id");
    sessionStorage.removeItem("interview_exists_in_db");
    sessionStorage.removeItem("interview_questions");
    sessionStorage.removeItem("interview_audio");
    sessionStorage.removeItem("interview_marqueurs");
    sessionStorage.removeItem("interview_statut");
}