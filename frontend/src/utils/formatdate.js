/**
 * Formate une date ISO ou LocalDate en format français : "12 mars 2025"
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDateLong(date) {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("fr-FR", {
        day:   "numeric",
        month: "long",
        year:  "numeric",
    });
}

/**
 * Formate une date en format court : "12/03/2025"
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDateShort(date) {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("fr-FR");
}

/**
 * Formate une date en format ISO pour les inputs type="date" : "2025-03-12"
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDateInput(date) {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
}

/**
 * Retourne "Il y a X jours" / "Aujourd'hui" / "Hier"
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDateRelative(date) {
    if (!date) return "—";

    const now  = new Date();
    const then = new Date(date);
    const diffMs   = now - then;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 30)  return `Il y a ${diffDays} jours`;
    if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `Il y a ${months} mois`;
    }
    const years = Math.floor(diffDays / 365);
    return `Il y a ${years} an${years > 1 ? "s" : ""}`;
}