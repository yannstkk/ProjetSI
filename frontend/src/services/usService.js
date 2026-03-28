import { authFetch } from "./authFetch";

// ─── API Acteurs ──────────────────────────────────────────────────────────────

/**
 * Récupère tous les acteurs d'un projet depuis la BDD.
 */
async function getActeursFromDb(idProjet) {
    const res = await authFetch(`/api/acteur/projet/${idProjet}`);
    if (!res.ok) return [];
    return res.json();
}

/**
 * Crée un acteur en BDD et retourne l'acteur créé (avec idActeur).
 */
async function createActeurInDb(nom, idProjet) {
    // Cherche dans le sessionStorage si on a des infos sur cet acteur (type, role)
    const acteurLocal = getActeurLocalByNom(nom);

    const res = await authFetch("/api/acteur", {
        method: "POST",
        body: JSON.stringify({
            idProjet,
            nom,
            type:   acteurLocal?.type   || "internal",
            source: acteurLocal?.source || "manuel",
            role:   acteurLocal?.role   || "",
        }),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Impossible de créer l'acteur "${nom}" : ${text}`);
    }
    return res.json();
}

/**
 * Résout l'idActeur pour un nom donné :
 * 1. Cherche parmi les acteurs BDD existants du projet
 * 2. Si absent → le crée automatiquement
 * 3. Retourne l'idActeur (Long)
 * Retourne null si le nom est vide.
 */
async function resolveIdActeur(nomActeur, idProjet) {
    if (!nomActeur || !nomActeur.trim()) return null;

    const nom = nomActeur.trim();

    // Chercher parmi les acteurs déjà en BDD
    const acteursDb = await getActeursFromDb(idProjet);
    const found = acteursDb.find(
        (a) => a.nom?.toLowerCase() === nom.toLowerCase()
    );
    if (found) return found.idActeur;

    // Pas trouvé → créer l'acteur automatiquement
    const created = await createActeurInDb(nom, idProjet);
    return created.idActeur;
}

/**
 * Récupère les infos d'un acteur depuis le sessionStorage Phase 2.
 */
function getActeurLocalByNom(nom) {
    try {
        const raw = sessionStorage.getItem("phase2_acteurs");
        if (!raw) return null;
        const acteurs = JSON.parse(raw);
        return acteurs.find(
            (a) => a.nom?.toLowerCase() === nom?.toLowerCase()
        ) || null;
    } catch {
        return null;
    }
}

// ─── API User Stories ─────────────────────────────────────────────────────────

/**
 * Charge toutes les User Stories d'un projet depuis la BDD.
 * Retourne un tableau au format interne du backlog frontend.
 */
export async function loadUSFromDb(idProjet) {
    const res = await authFetch(`/api/userstories/projet/${idProjet}`);
    if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
    const liste = await res.json();

    // Charger les acteurs BDD pour résoudre les noms
    const acteursDb = await getActeursFromDb(idProjet);
    const acteurById = Object.fromEntries(
        acteursDb.map((a) => [a.idActeur, a])
    );

    return liste.map((dbUS) => dbUSToLocal(dbUS, acteurById));
}

/**
 * Sauvegarde une US en BDD.
 * - Résout (ou crée) l'acteur automatiquement
 * - Si l'US a déjà un dbId → supprime puis recrée (pas de PUT disponible)
 * Retourne l'US locale enrichie avec dbId.
 */
export async function saveUSToDb(us, idProjet) {
    // 1. Résoudre l'idActeur (création auto si besoin)
    const idActeur = await resolveIdActeur(us.acteur, idProjet);

    // 2. Supprimer l'ancienne version si elle existe
    if (us.dbId) {
        try {
            await authFetch(`/api/userstories/${us.dbId}`, { method: "DELETE" });
        } catch {
            // non bloquant
        }
    }

    // 3. Construire le payload
    const payload = localUSToDb(us, idProjet, idActeur);

    // 4. Créer la nouvelle version
    const res = await authFetch("/api/userstories", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Erreur serveur ${res.status} : ${text}`);
    }

    const created = await res.json();
    return { ...us, dbId: created.idUs };
}

/**
 * Supprime une US de la BDD par son dbId.
 */
export async function deleteUSFromDb(dbId) {
    const res = await authFetch(`/api/userstories/${dbId}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
}

// ─── Conversions format BDD ↔ format local ────────────────────────────────────

/**
 * Convertit un objet local du backlog en UserStoryRequest (BDD).
 *
 * Mapping des colonnes Oracle :
 * - ref      VARCHAR2(20)  → identifiant court : "US-001"
 * - veux     VARCHAR2(300) → champ "je veux"
 * - afin     VARCHAR2(300) → champ "afin de"
 * - priorite VARCHAR2(10)  → "haute"/"moyenne"/"basse"
 * - criteres CLOB          → JSON array des critères d'acceptation
 * - flux     CLOB          → JSON array des flux MFC liés
 * - taigaRef VARCHAR2(100) → référence Taiga
 * - idProjet Long          → FK projet
 * - idActeur Long          → FK acteur (résolu automatiquement)
 */
function localUSToDb(us, idProjet, idActeur) {
    return {
        ref:      (us.id || "").slice(0, 20),
        veux:     (us.veux  || "").slice(0, 300),
        afin:     (us.afin  || "").slice(0, 300),
        priorite: (us.priorite || "moyenne").slice(0, 10),
        criteres: JSON.stringify(us.criteres || []),
        flux:     JSON.stringify(us.flux     || []),
        taigaRef: us.taigaRef ? us.taigaRef.slice(0, 100) : null,
        idProjet,
        idActeur: idActeur || null,
    };
}

/**
 * Convertit une UserStoryResponse (BDD) en objet local du backlog.
 * Résout le nom de l'acteur depuis la map acteurById.
 */
function dbUSToLocal(dbUS, acteurById = {}) {
    // Résoudre le nom de l'acteur depuis idActeur
    const acteurNom = dbUS.idActeur && acteurById[dbUS.idActeur]
        ? acteurById[dbUS.idActeur].nom
        : "";

    return {
        id:       dbUS.ref    || `US-${String(dbUS.idUs).padStart(3, "0")}`,
        dbId:     dbUS.idUs,
        acteur:   acteurNom,
        veux:     dbUS.veux     || "",
        afin:     dbUS.afin     || "",
        priorite: dbUS.priorite || "moyenne",
        criteres: parseClobArray(dbUS.criteres),
        flux:     parseClobArray(dbUS.flux),
        taigaRef: dbUS.taigaRef || null,
        taigaId:  null,
        source:   "bdd",
        statut:   "brouillon",
    };
}

// ─── Helpers parsing CLOB ─────────────────────────────────────────────────────

/**
 * Parse un CLOB contenant un JSON array.
 * Fallback gracieux si le contenu est brut (texte ou ancien format).
 */
function parseClobArray(raw) {
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
    } catch {
        // texte brut → tableau de lignes
        return raw.split("\n").map((l) => l.trim()).filter(Boolean);
    }
    return [];
}