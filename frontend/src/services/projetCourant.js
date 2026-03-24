export function getProjetCourant() {
    try {
        const raw = sessionStorage.getItem("projet_courant");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function setProjetCourant(projet) {
    sessionStorage.setItem("projet_courant", JSON.stringify(projet));
}

export function clearProjetCourant() {
    sessionStorage.removeItem("projet_courant");
}