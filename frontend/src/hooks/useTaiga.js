import { useState } from "react";
import { authFetch } from "../services/authFetch";
import {
    loadTaigaSession,
    saveTaigaSession,
    clearTaigaSession,
    updateUS,
} from "../app/pages/phase4/components/usStorage";

export const TAIGA_STEP = {
    CLOSED:  "closed",
    LOGIN:   "login",
    PROJETS: "projets",
    EXPORT:  "export",
};

export function useTaiga({ onBacklogChange }) {
    const [step, setStep]                     = useState(TAIGA_STEP.CLOSED);
    const [session, setSession]               = useState(loadTaigaSession);
    const [projets, setProjets]               = useState([]);
    const [projetChoisi, setProjetChoisi]     = useState(null);
    const [usAExporter, setUsAExporter]       = useState(null);
    const [loading, setLoading]               = useState(false);
    const [error, setError]                   = useState("");

    function ouvrirConnexion() {
        setError("");
        if (session) {
            chargerProjets(session.token);
        } else {
            setStep(TAIGA_STEP.LOGIN);
        }
    }

    function ouvrirExportUS(us) {
        setUsAExporter(us);
        setError("");
        if (session) {
            chargerProjets(session.token);
        } else {
            setStep(TAIGA_STEP.LOGIN);
        }
    }

    function fermer() {
        setStep(TAIGA_STEP.CLOSED);
        setUsAExporter(null);
        setError("");
        setProjetChoisi(null);
    }

    async function login(username, password) {
        setLoading(true);
        setError("");
        try {
            const res  = await authFetch("/api/taiga/login", {
                method: "POST",
                body: JSON.stringify({ username, password }),
            });
            const text = await res.text();
            if (!res.ok) {
                let msg;
                try { msg = JSON.parse(text).error; } catch { msg = text; }
                throw new Error(msg || `Erreur ${res.status}`);
            }
            const data             = JSON.parse(text);
            const nouvelleSession  = { token: data.token, userId: data.userId, username: data.username };
            saveTaigaSession(nouvelleSession);
            setSession(nouvelleSession);
            await chargerProjets(data.token);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    async function chargerProjets(token) {
        setLoading(true);
        setError("");
        try {
            const res  = await authFetch("/api/taiga/projets", {
                headers: { "X-Taiga-Token": token },
            });
            const text = await res.text();
            if (!res.ok) {
                let msg;
                try { msg = JSON.parse(text).error; } catch { msg = text; }
                throw new Error(msg || `Erreur ${res.status}`);
            }
            setProjets(JSON.parse(text));
            setStep(TAIGA_STEP.PROJETS);
        } catch (e) {
            setError(e.message);
            clearTaigaSession();
            setSession(null);
            setStep(TAIGA_STEP.LOGIN);
        } finally {
            setLoading(false);
        }
    }

    function choisirProjet(projet) {
        setProjetChoisi(projet);
        setStep(TAIGA_STEP.EXPORT);
    }

    async function exporterUS(us) {
        if (!projetChoisi || !session) return;
        setLoading(true);
        setError("");
        try {
            const res  = await authFetch("/api/taiga/exporter-us", {
                method: "POST",
                headers: { "X-Taiga-Token": session.token },
                body: JSON.stringify({
                    projetId: projetChoisi.id,
                    us: {
                        acteur:   us.acteur,
                        veux:     us.veux,
                        afin:     us.afin,
                        criteres: us.criteres,
                        priorite: us.priorite,
                    },
                }),
            });
            const text = await res.text();
            if (!res.ok) {
                let msg;
                try { msg = JSON.parse(text).error; } catch { msg = text; }
                throw new Error(msg || `Erreur ${res.status}`);
            }
            const data          = JSON.parse(text);
            const backlogMisAJour = updateUS(us.id, { taigaId: data.taigaId, taigaRef: data.taigaRef });
            onBacklogChange(backlogMisAJour);
            fermer();
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    function deconnecter() {
        clearTaigaSession();
        setSession(null);
        setProjets([]);
        setProjetChoisi(null);
        fermer();
    }

    return {
        step, session, projets, projetChoisi, usAExporter,
        loading, error,
        ouvrirConnexion, ouvrirExportUS, fermer,
        login, choisirProjet, exporterUS, deconnecter,
    };
}