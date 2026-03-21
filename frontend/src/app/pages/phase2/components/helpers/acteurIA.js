import { authFetch } from "../../../../../services/authFetch";


const STORAGE_KEY = "phase2_acteurs";

export function loadActeurs() {
    try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
}

export function saveActeurs(acteurs) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(acteurs));
}


export function getNotesTexte() {
    try {
        const draft = sessionStorage.getItem("interview_draft");
        if (!draft) return "";
        const parsed = JSON.parse(draft);
        return (parsed.notesImportees || []).map((n) => n.contenu).join("\n\n");
    } catch {
        return "";
    }
}

// ─── Appel endpoint dédié ─────────────────────────────────────────────────────

/**
 * Appelle le nouvel endpoint /api/mistral/detecter-acteurs.
 * Retourne une liste d'objets { nom, role, phraseSource }.
 * - nom       : toujours présent (obligatoire côté back)
 * - role      : peut être une chaîne vide si non identifiable
 * - phraseSource : citation extraite des notes
 */
export async function appelDetectionActeurs(notesTexte) {
    const response = await authFetch("/api/mistral/detecter-acteurs", {
        method: "POST",
        body: JSON.stringify({ notes: notesTexte }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Erreur serveur ${response.status} : ${text}`);
    }

    const data = await response.json();

    return data.acteurs || [];
}