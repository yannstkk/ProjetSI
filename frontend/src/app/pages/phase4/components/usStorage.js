const KEY_BACKLOG = "phase4_backlog";
const KEY_TAIGA   = "phase4_taiga_session";



export function loadBacklog() {
    try {
        const raw = sessionStorage.getItem(KEY_BACKLOG);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function saveBacklog(backlog) {
    sessionStorage.setItem(KEY_BACKLOG, JSON.stringify(backlog));
}

export function deleteUS(id) {
    const updated = loadBacklog().filter((us) => us.id !== id);
    saveBacklog(updated);
    return updated;
}

export function updateUS(id, patch) {
    const updated = loadBacklog().map((us) =>
        us.id === id ? { ...us, ...patch } : us
    );
    saveBacklog(updated);
    return updated;
}

function genId(backlog) {
    const nums = backlog
        .map((us) => parseInt(us.id?.replace("US-", ""), 10))
        .filter(Boolean);
    const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    return `US-${String(next).padStart(3, "0")}`;
}



export function loadTaigaSession() {
    try {
        const raw = sessionStorage.getItem(KEY_TAIGA);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function saveTaigaSession(session) {
    sessionStorage.setItem(KEY_TAIGA, JSON.stringify(session));
}

export function clearTaigaSession() {
    sessionStorage.removeItem(KEY_TAIGA);
}