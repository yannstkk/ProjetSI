const STORAGE_KEY = "phase2_mfc";

export function loadMFC() {
    try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
}

export function saveMFC(data) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearMFC() {
    sessionStorage.removeItem(STORAGE_KEY);
}