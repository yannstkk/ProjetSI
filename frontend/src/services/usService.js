import { authFetch } from "./authFetch";


async function getActeursFromDb(idProjet) {
    const res = await authFetch(`/api/acteur/projet/${idProjet}`);
    if (!res.ok) return [];
    return res.json();
}


async function createActeurInDb(nom, idProjet) {
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


async function resolveIdActeur(nomActeur, idProjet) {
    if (!nomActeur || !nomActeur.trim()) return null;

    const nom = nomActeur.trim();

    const acteursDb = await getActeursFromDb(idProjet);
    const found = acteursDb.find(
        (a) => a.nom?.toLowerCase() === nom.toLowerCase()
    );
    if (found) return found.idActeur;

    const created = await createActeurInDb(nom, idProjet);
    return created.idActeur;
}

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



export async function loadUSFromDb(idProjet) {
    const res = await authFetch(`/api/userstories/projet/${idProjet}`);
    if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
    const liste = await res.json();

    const acteursDb = await getActeursFromDb(idProjet);
    const acteurById = Object.fromEntries(
        acteursDb.map((a) => [a.idActeur, a])
    );

    return liste.map((dbUS) => dbUSToLocal(dbUS, acteurById));
}


export async function saveUSToDb(us, idProjet) {
    const idActeur = await resolveIdActeur(us.acteur, idProjet);

    if (us.dbId) {
        try {
            await authFetch(`/api/userstories/${us.dbId}`, { method: "DELETE" });
        } catch {
        }
    }

    const payload = localUSToDb(us, idProjet, idActeur);

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


export async function deleteUSFromDb(dbId) {
    const res = await authFetch(`/api/userstories/${dbId}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
}



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


function dbUSToLocal(dbUS, acteurById = {}) {
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



function parseClobArray(raw) {
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
    } catch {
        return raw.split("\n").map((l) => l.trim()).filter(Boolean);
    }
    return [];
}