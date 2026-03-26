import { authFetch } from "./authFetch";

// ─── Notes brutes ─────────────────────────────────────────────────────────────

export async function getNotesByInterview(numeroInterview) {
    const res = await authFetch(`/api/notes/interview/${numeroInterview}`);
    if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
    return res.json();
}

export async function createNote(numeroInterview, contenu) {
    const res = await authFetch("/api/notes", {
        method: "POST",
        body: JSON.stringify({ numeroInterview, contenu }),
    });
    if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
    return res.json();
}

export async function deleteNotesByInterview(numeroInterview) {
    const res = await authFetch(`/api/notes/interview/${numeroInterview}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
}

// ─── Notes structurées ────────────────────────────────────────────────────────

export async function getNotesStructureesByInterview(numeroInterview) {
    const res = await authFetch(`/api/notes-structurees/interview/${numeroInterview}`);
    if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
    return res.json();
}

export async function createNoteStructuree(numeroInterview, categorie, contenu) {
    const res = await authFetch("/api/notes-structurees", {
        method: "POST",
        body: JSON.stringify({ numeroInterview, categorie, contenu }),
    });
    if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
    return res.json();
}

export async function deleteNotesStructureesByInterview(numeroInterview) {
    const res = await authFetch(`/api/notes-structurees/interview/${numeroInterview}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
}

// ─── Questions IA ─────────────────────────────────────────────────────────────

export async function getQuestionsByInterview(numeroInterview) {
    const res = await authFetch(`/api/questions/interview/${numeroInterview}`);
    if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
    return res.json();
}

export async function createQuestion(numeroInterview, libelle) {
    const res = await authFetch("/api/questions", {
        method: "POST",
        body: JSON.stringify({ numeroInterview, libelle }),
    });
    if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
    return res.json();
}

export async function deleteQuestionsByInterview(numeroInterview) {
    const res = await authFetch(`/api/questions/interview/${numeroInterview}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
}

// ─── Participants ─────────────────────────────────────────────────────────────

export async function getParticipantsByInterview(numeroInterview) {
    const res = await authFetch(`/api/participants/interview/${numeroInterview}`);
    if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
    return res.json();
}

export async function createParticipant(numeroInterview, nom, role) {
    const res = await authFetch(`/api/participants/interview/${numeroInterview}`, {
        method: "POST",
        body: JSON.stringify({ nom, role }),
    });
    if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
    return res.json();
}

export async function deleteParticipantsByInterview(numeroInterview) {
    const res = await authFetch(`/api/participants/interview/${numeroInterview}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
}

// ─── Sauvegarde depuis sessionStorage ────────────────────────────────────────

/**
 * Sauvegarde les notes brutes importées en BDD.
 * Supprime d'abord les anciennes pour éviter la duplication.
 */
export async function saveNotesFromSession(numeroInterview) {
    try {
        await deleteNotesByInterview(numeroInterview);
        const draft = JSON.parse(sessionStorage.getItem("interview_draft") || "{}");
        const notesImportees = draft.notesImportees || [];
        if (notesImportees.length === 0) return [];
        return await Promise.all(
            notesImportees.map((note) => createNote(numeroInterview, note.contenu))
        );
    } catch (err) {
        throw new Error("Erreur sauvegarde notes : " + err.message);
    }
}

/**
 * Sauvegarde les notes structurées (interview_live) en BDD.
 */
export async function saveNotesStructureesFromSession(numeroInterview) {
    try {
        await deleteNotesStructureesByInterview(numeroInterview);
        const live = JSON.parse(sessionStorage.getItem("interview_live") || "{}");
        const categories = ["besoins", "regles", "donnees", "contraintes", "solutions"];
        const promises = [];
        for (const cat of categories) {
            for (const item of (live[cat] || [])) {
                const contenu = item.texte || item.nom || "";
                if (contenu.trim()) {
                    promises.push(createNoteStructuree(numeroInterview, cat, contenu.trim()));
                }
            }
        }
        await Promise.all(promises);
    } catch (err) {
        throw new Error("Erreur sauvegarde notes structurées : " + err.message);
    }
}

/**
 * Sauvegarde les questions suggérées par l'IA en BDD.
 */
export async function saveQuestionsFromSession(numeroInterview) {
    try {
        await deleteQuestionsByInterview(numeroInterview);
        const questions = JSON.parse(sessionStorage.getItem("interview_questions") || "[]");
        if (questions.length === 0) return;
        await Promise.all(
            questions
                .filter((q) => q.question && q.question.trim())
                .map((q) => createQuestion(numeroInterview, q.question.trim()))
        );
    } catch (err) {
        throw new Error("Erreur sauvegarde questions : " + err.message);
    }
}

/**
 * Sauvegarde les participants depuis interview_draft en BDD.
 */
export async function saveParticipantsFromSession(numeroInterview) {
    try {
        await deleteParticipantsByInterview(numeroInterview);
        const draft = JSON.parse(sessionStorage.getItem("interview_draft") || "{}");
        const participants = (draft.participants || []).filter((p) => p.nom && p.nom.trim());
        if (participants.length === 0) return;
        await Promise.all(
            participants.map((p) =>
                createParticipant(numeroInterview, p.nom.trim(), p.role || "")
            )
        );
    } catch (err) {
        throw new Error("Erreur sauvegarde participants : " + err.message);
    }
}

// ─── Chargement dans sessionStorage ──────────────────────────────────────────

export async function loadNotesIntoSession(numeroInterview) {
    try {
        const notes = await getNotesByInterview(numeroInterview);
        const draft = JSON.parse(sessionStorage.getItem("interview_draft") || "{}");
        draft.notesImportees = notes.map((n) => ({
            nom:         `Note #${n.numeroNotes}`,
            contenu:     n.contenu,
            numeroNotes: n.numeroNotes,
        }));
        sessionStorage.setItem("interview_draft", JSON.stringify(draft));
        return notes;
    } catch {
        return [];
    }
}

export async function loadNotesStructureesIntoSession(numeroInterview) {
    try {
        const liste = await getNotesStructureesByInterview(numeroInterview);
        const live = { besoins: [], regles: [], donnees: [], contraintes: [], solutions: [] };
        for (const ns of liste) {
            const cat = ns.categorie;
            if (live[cat] !== undefined) {
                if (cat === "donnees") {
                    live[cat].push({ id: ns.idNotesStructurees, nom: ns.contenu, type: "texte" });
                } else {
                    live[cat].push({ id: ns.idNotesStructurees, texte: ns.contenu });
                }
            }
        }
        sessionStorage.setItem("interview_live", JSON.stringify(live));
        return live;
    } catch {
        return null;
    }
}

export async function loadQuestionsIntoSession(numeroInterview) {
    try {
        const questions = await getQuestionsByInterview(numeroInterview);
        const formatted = questions.map((q) => ({ question: q.libelle }));
        sessionStorage.setItem("interview_questions", JSON.stringify(formatted));
        return formatted;
    } catch {
        return [];
    }
}

export async function loadParticipantsIntoSession(numeroInterview) {
    try {
        const participants = await getParticipantsByInterview(numeroInterview);
        const draft = JSON.parse(sessionStorage.getItem("interview_draft") || "{}");
        draft.participants = participants.map((p) => ({
            nom:  p.nom,
            role: p.role || "",
        }));
        sessionStorage.setItem("interview_draft", JSON.stringify(draft));
        return participants;
    } catch {
        return [];
    }
}