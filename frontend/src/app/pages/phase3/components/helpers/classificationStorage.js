const STORAGE_KEY = "phase3_classification";

export const COLONNES = {
    besoinsF: {
        id: "besoinsF",
        label: "Besoins fonctionnels",
        couleur: "border-t-green-500",
        bg: "bg-green-50",
        badge: "bg-green-100 text-green-700",
        dot: "bg-green-500",
    },
    contraintes: {
        id: "contraintes",
        label: "Contraintes",
        couleur: "border-t-red-500",
        bg: "bg-red-50",
        badge: "bg-red-100 text-red-700",
        dot: "bg-red-500",
    },
    donnees: {
        id: "donnees",
        label: "Données métier",
        couleur: "border-t-yellow-500",
        bg: "bg-yellow-50",
        badge: "bg-yellow-100 text-yellow-700",
        dot: "bg-yellow-500",
    },
    ressentis: {
        id: "ressentis",
        label: "Ressentis / Points de douleur",
        couleur: "border-t-purple-500",
        bg: "bg-purple-50",
        badge: "bg-purple-100 text-purple-700",
        dot: "bg-purple-500",
    },
};

const ETAT_INITIAL = {
    besoinsF: [],
    contraintes: [],
    donnees: [],
    ressentis: [],
};

export function loadClassification() {
    try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
}

export function saveClassification(data) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearClassification() {
    sessionStorage.removeItem(STORAGE_KEY);
}

export function importerDepuisPhase1() {
    try {
        const raw = sessionStorage.getItem("interview_live");
        if (!raw) return ETAT_INITIAL;
        const live = JSON.parse(raw);

        const makeItem = (texte, sourceType) => ({
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            texte: typeof texte === "string" ? texte : texte.texte || texte.nom || "",
            valide: false,
            source: sourceType,
            doublonSuspecte: false,
        });

        return {
            besoinsF: [
                ...(live.besoins || []).map((el) => makeItem(el, "besoin")),
                ...(live.solutions || []).map((el) => makeItem(el, "solution")),
            ],
            contraintes: [
                ...(live.regles || []).map((el) => makeItem(el, "règle")),
                ...(live.contraintes || []).map((el) => makeItem(el, "contrainte")),
            ],
            donnees: (live.donnees || []).map((el) => makeItem(el, "donnée")),
            ressentis: [],
        };
    } catch {
        return ETAT_INITIAL;
    }
}