import { authFetch } from "../../../../../services/authFetch";

// ─── Storage ──────────────────────────────────────────────────────────────────

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

// ─── Notes ───────────────────────────────────────────────────────────────────

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

// ─── Appel IA ─────────────────────────────────────────────────────────────────

export async function appelDetectionActeurs(notesTexte) {
    const promptActeurs =
        `Tu es un expert AFSI. Voici des notes d'entretien métier :\n\n${notesTexte}\n\n` +
        `Identifie tous les acteurs (personnes, rôles, systèmes, organisations) mentionnés ou implicites dans ces notes. ` +
        `Pour chaque acteur, fournis son nom court et la phrase exacte des notes qui justifie sa présence. ` +
        `Réponds UNIQUEMENT en JSON brut sans aucun texte avant ou après, avec cette structure exacte : ` +
        `{ "acteurs": [ { "nom": "", "phraseSource": "" } ] }`;

    const response = await authFetch("/api/mistral/suggerer-questions", {
        method: "POST",
        body: JSON.stringify({ notes: promptActeurs }),
    });

    if (!response.ok) throw new Error(`Erreur serveur : ${response.status}`);

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error("Réponse inattendue de l'API.");

    const cleaned = content.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return parsed.acteurs || [];
}