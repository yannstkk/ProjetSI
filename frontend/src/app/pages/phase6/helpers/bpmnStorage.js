const KEY = "phase6_bpmn";

export function loadBpmn() {
    try {
        const raw = sessionStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function saveBpmn(data) {
    try {
        sessionStorage.setItem(KEY, JSON.stringify(data));
    } catch {
        console.warn("bpmnStorage : impossible de sauvegarder (quota sessionStorage dépassé)");
    }
}

export function clearBpmn() {
    sessionStorage.removeItem(KEY);
}