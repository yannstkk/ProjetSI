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
    const parties = [];

    try {
        const draft = sessionStorage.getItem("interview_draft");
        if (draft) {
            const parsed = JSON.parse(draft);
            const contenuFichiers = (parsed.notesImportees || [])
                .map((n) => n.contenu)
                .filter(Boolean)
                .join("\n\n");
            if (contenuFichiers.trim()) {
                parties.push(contenuFichiers);
            }
        }
    } catch {
    }

    try {
        const live = sessionStorage.getItem("interview_live");
        if (live) {
            const parsed = JSON.parse(live);

            const besoins = (parsed.besoins || [])
                .map((el) => el.texte || "")
                .filter(Boolean);

            const regles = (parsed.regles || [])
                .map((el) => el.texte || "")
                .filter(Boolean);

            const donnees = (parsed.donnees || [])
                .map((el) => el.nom || el.texte || "")
                .filter(Boolean);

            const contraintes = (parsed.contraintes || [])
                .map((el) => el.texte || "")
                .filter(Boolean);

            const solutions = (parsed.solutions || [])
                .map((el) => el.texte || "")
                .filter(Boolean);

            const lignes = [];
            if (besoins.length)     lignes.push("Besoins :\n" + besoins.join("\n"));
            if (regles.length)      lignes.push("Règles métier :\n" + regles.join("\n"));
            if (donnees.length)     lignes.push("Données :\n" + donnees.join("\n"));
            if (contraintes.length) lignes.push("Contraintes :\n" + contraintes.join("\n"));
            if (solutions.length)   lignes.push("Solutions proposées :\n" + solutions.join("\n"));

            if (lignes.length) {
                parties.push(lignes.join("\n\n"));
            }
        }
    } catch {
    }

    return parties.join("\n\n---\n\n");
}


export async function appelDetectionActeurs(notesTexte) {
    const response = await authFetch("/api/mistral/detecter-acteurs", {
        method: "POST",
        body: JSON.stringify({ contenu: notesTexte }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Erreur serveur ${response.status} : ${text}`);
    }

    const data = await response.json();

    return data.acteurs || [];
}