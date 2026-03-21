import { authFetch } from "./authFetch";

/**
 * Récupère toutes les notes d'un projet
 */
export async function getNotesByProjet(idProjet) {
    const res = await authFetch(`/api/notes?idProjet=${idProjet}`);
    if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
    return res.json();
}

/**
 * Crée une note en BDD
 */
export async function createNote(idProjet, contenu) {
    const res = await authFetch("/api/notes", {
        method: "POST",
        body: JSON.stringify({ idProjet, contenu }),
    });
    if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
    return res.json();
}

/**
 * Met à jour une note existante
 */
export async function updateNote(numeroNotes, idProjet, contenu) {
    const res = await authFetch(`/api/notes/${numeroNotes}/${idProjet}`, {
        method: "PUT",
        body: JSON.stringify({ idProjet, contenu }),
    });
    if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
    return res.json();
}

/**
 * Sauvegarde toutes les notes importées depuis sessionStorage vers la BDD
 * Crée une note par fichier importé dans notesImportees
 */
export async function saveNotesFromSession(idProjet) {
    try {
        const draft = JSON.parse(sessionStorage.getItem("interview_draft") || "{}");
        const notesImportees = draft.notesImportees || [];

        if (notesImportees.length === 0) return [];

        const results = await Promise.all(
            notesImportees.map((note) =>
                createNote(idProjet, note.contenu)
            )
        );

        return results;
    } catch (err) {
        throw new Error("Erreur lors de la sauvegarde des notes : " + err.message);
    }
}

/**
 * Charge les notes BDD dans sessionStorage (dans interview_draft.notesImportees)
 */
export async function loadNotesIntoSession(idProjet) {
    try {
        const notes = await getNotesByProjet(idProjet);

        const draft = JSON.parse(sessionStorage.getItem("interview_draft") || "{}");
        draft.notesImportees = notes.map((n) => ({
            nom: `Note #${n.numeroNotes}`,
            contenu: n.contenu,
            numeroNotes: n.numeroNotes,
        }));

        sessionStorage.setItem("interview_draft", JSON.stringify(draft));
        return notes;
    } catch {
        return [];
    }
}