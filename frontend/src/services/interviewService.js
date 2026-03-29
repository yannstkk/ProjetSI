import { authFetch } from "./authFetch";


/**
 * Récupère la liste des interviews d'un projet depuis la BDD.
 * Retourne le premier élément s'il existe, null sinon.
 */
export async function getInterviewByProjet(idProjet) {
    const res = await authFetch(`/api/interviews/projet/${idProjet}`);
    if (!res.ok) return null;
    const liste = await res.json();
    return liste.length > 0 ? liste[0] : null;
}


/**
 * Crée une nouvelle interview en BDD (POST).
 * Retourne l'interview créée avec son numeroInterview.
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
 * Met à jour une interview existante en BDD (PUT).
 * @param {number} numeroInterview - L'ID de l'interview à mettre à jour
 * @param {object} data - Les données à envoyer
 */
export async function updateInterview(numeroInterview, data) {
    const res = await authFetch(`/api/interviews/${numeroInterview}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
    return res.json();
}


/**
 * Construit l'objet à envoyer au backend depuis le sessionStorage.
 * Ne garde que les champs reconnus par InterviewRequest.java.
 * La durée est stockée dans objectifs sous forme de préfixe lisible
 * car InterviewRequest n'a pas de champ dédié pour la durée.
 */
export function buildInterviewPayload(idProjet) {
    try {
        const draft = JSON.parse(sessionStorage.getItem("interview_draft") || "{}");
        const dateHeure = draft.dateHeure || "";

        // On inclut la durée dans les objectifs si elle est renseignée,
        // pour ne pas la perdre côté BDD.
        let objectifs = draft.objectifs || "";
        if (draft.duree && draft.duree.trim()) {
            const dureeTag = `[Durée estimée : ${draft.duree.trim()}]`;
            // Évite de dupliquer le tag si déjà présent
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


/**
 * Charge une interview BDD dans sessionStorage.
 * Reconstruit interview_draft depuis les champs de InterviewResponse.java.
 * IMPORTANT : préserve les champs purement frontend (duree) déjà présents
 * en sessionStorage pour ne pas les écraser lors d'un rechargement.
 */
export function loadInterviewIntoSession(interview) {
    // Lire le draft existant pour préserver les champs non persistés (ex: duree)
    let existingDraft = {};
    try {
        const raw = sessionStorage.getItem("interview_draft");
        if (raw) existingDraft = JSON.parse(raw);
    } catch {
        // ignore
    }

    // Extraire la durée depuis les objectifs si elle y a été encodée
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
        duree,                                          // ← préservé ou extrait
        participants:   existingDraft.participants || [],
        notesImportees: existingDraft.notesImportees || [],
    };

    sessionStorage.setItem("interview_draft",         JSON.stringify(draft));
    sessionStorage.setItem("interview_id",            String(interview.numeroInterview));
    sessionStorage.setItem("interview_exists_in_db",  "true");
}



/**
 * Indique si l'interview courante existe déjà en BDD.
 */
export function interviewExistsInDb() {
    return sessionStorage.getItem("interview_exists_in_db") === "true";
}

/**
 * Retourne le numeroInterview stocké en session, ou null.
 */
export function getInterviewId() {
    const id = sessionStorage.getItem("interview_id");
    return id ? Number(id) : null;
}



/**
 * Réinitialise toutes les clés interview du sessionStorage.
 */
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