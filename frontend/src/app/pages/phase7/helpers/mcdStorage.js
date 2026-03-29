const KEY = "phase7_mcd";

export function loadMCD() {
    try {
        const raw = sessionStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function saveMCD(data) {
    try {
        sessionStorage.setItem(KEY, JSON.stringify(data));
    } catch {
        console.warn("mcdStorage : quota sessionStorage dépassé");
    }
}

export function clearMCD() {
    sessionStorage.removeItem(KEY);
}