import { useState } from "react";
import {
    loadTaigaSession,
    saveTaigaSession,
    clearTaigaSession,
    updateUS,
} from "../app/pages/phase4/components/usStorage";

const BASE_URL = "http://localhost:8080";


async function taigaFetch(path, taigaToken, options = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (taigaToken) {
        headers["Authorization"] = `Bearer ${taigaToken}`;
    }

    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        credentials: "include",
        headers,
    });

    return response;
}

export const TAIGA_STEP = {
    CLOSED:  "closed",
    LOGIN:   "login",
    PROJETS: "projets",
    EXPORT:  "export",
};

export function useTaiga({ onBacklogChange }) {
    const [step, setStep]                 = useState(TAIGA_STEP.CLOSED);
    const [session, setSession]           = useState(loadTaigaSession);
    const [projets, setProjets]           = useState([]);
    const [projetChoisi, setProjetChoisi] = useState(() => {
        try {
            const raw = sessionStorage.getItem("taiga_projet_choisi");
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });
    const [usAExporter, setUsAExporter]   = useState(null);
    const [loading, setLoading]           = useState(false);
    const [error, setError]               = useState("");


    function persistSession(s) {
        saveTaigaSession(s);
        setSession(s);
    }

    function persistProjetChoisi(p) {
        if (p) {
            sessionStorage.setItem("taiga_projet_choisi", JSON.stringify(p));
        } else {
            sessionStorage.removeItem("taiga_projet_choisi");
        }
        setProjetChoisi(p);
    }


    function ouvrirConnexion() {
        setError("");
        if (session) {
            chargerProjets(session.token, session.userId);
        } else {
            setStep(TAIGA_STEP.LOGIN);
        }
    }

    function ouvrirExportUS(us) {
        setUsAExporter(us);
        setError("");
        if (session) {
            if (projetChoisi) {
                setStep(TAIGA_STEP.EXPORT);
            } else {
                chargerProjets(session.token, session.userId);
            }
        } else {
            setStep(TAIGA_STEP.LOGIN);
        }
    }

    function fermer() {
        setStep(TAIGA_STEP.CLOSED);
        setUsAExporter(null);
        setError("");
    }


    async function login(username, password) {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${BASE_URL}/api/taiga/login`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                const text = await res.text();
                let msg;
                try { msg = JSON.parse(text)?.error || text; } catch { msg = text || `Erreur ${res.status}`; }
                throw new Error(msg);
            }

            const data = await res.json();
            const nouvelleSession = {
                token:    data.token,
                userId:   data.userId,
                username: data.username,
            };
            persistSession(nouvelleSession);
            await chargerProjets(data.token, data.userId);
        } catch (e) {
            setError(e.message || "Erreur de connexion");
        } finally {
            setLoading(false);
        }
    }


    async function chargerProjets(token, userId) {
        setLoading(true);
        setError("");
        try {
            // GET /api/taiga/projects?userId=... avec token Taiga dans Authorization
            // Le backend : @RequestParam Long userId, @RequestHeader("Authorization") String token
            const res = await taigaFetch(
                `/api/taiga/projects?userId=${userId}`,
                token
            );

            if (!res.ok) {
                const text = await res.text();
                let msg;
                try { msg = JSON.parse(text)?.error || text; } catch { msg = text || `Erreur ${res.status}`; }
                if (res.status === 401) {
                    clearTaigaSession();
                    setSession(null);
                    persistProjetChoisi(null);
                    setStep(TAIGA_STEP.LOGIN);
                    throw new Error("Session expirée, veuillez vous reconnecter.");
                }
                throw new Error(msg);
            }

            const data = await res.json();
            setProjets(data);
            setStep(TAIGA_STEP.PROJETS);
        } catch (e) {
            setError(e.message || "Erreur lors du chargement des projets");
            if (!e.message?.includes("Session expirée")) {
                setStep(TAIGA_STEP.PROJETS);
            }
        } finally {
            setLoading(false);
        }
    }


    function choisirProjet(projet) {
        persistProjetChoisi(projet);
        setStep(TAIGA_STEP.EXPORT);
    }


    async function exporterUS(us) {
        if (!projetChoisi || !session) return;
        setLoading(true);
        setError("");
        try {

            const parts = [];
            if (us.acteur) parts.push(`En tant que ${us.acteur}`);
            if (us.veux)   parts.push(`je veux ${us.veux}`);
            if (us.afin)   parts.push(`afin de ${us.afin}`);
            const subject = parts.length > 0 ? parts.join(", ") : (us.id || "User Story");

            // POST /api/taiga/exporter-us
            // Backend : @RequestBody UserStoryRequest userStory, @RequestHeader("Authorization") String token
            const res = await taigaFetch(
                "/api/taiga/exporter-us",
                session.token,
                {
                    method: "POST",
                    body: JSON.stringify({
                        project: projetChoisi.id,
                        subject,
                    }),
                }
            );

            if (!res.ok) {
                const text = await res.text();
                let msg;
                try { msg = JSON.parse(text)?.error || text; } catch { msg = text || `Erreur ${res.status}`; }
                throw new Error(msg);
            }

            const data = await res.json();
            const backlogMisAJour = updateUS(us.id, {
                taigaId:  data.taigaId,
                taigaRef: data.getTaigaRef || data.taigaRef,
            });
            onBacklogChange(backlogMisAJour);
            fermer();
        } catch (e) {
            setError(e.message || "Erreur lors de l'export");
        } finally {
            setLoading(false);
        }
    }



    function deconnecter() {
        clearTaigaSession();
        sessionStorage.removeItem("taiga_projet_choisi");
        setSession(null);
        setProjets([]);
        setProjetChoisi(null);
        setUsAExporter(null);
        setError("");
        setStep(TAIGA_STEP.CLOSED);
    }


    function changerProjet() {
        setError("");
        if (session) {
            chargerProjets(session.token, session.userId);
        }
    }

    return {
        step, session, projets, projetChoisi, usAExporter,
        loading, error,
        ouvrirConnexion, ouvrirExportUS, fermer,
        login, choisirProjet, exporterUS, deconnecter, changerProjet,
    };
}