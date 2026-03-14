import { useState, useEffect } from "react";

const STORAGE_KEY = "interview_live";

const initialState = {
    besoins: [],
    regles: [],
    donnees: [],
    contraintes: [],
    solutions: [],
};

export function useInterviewLive() {
    const [live, setLive] = useState(() => {
        try {
            const saved = sessionStorage.getItem(STORAGE_KEY);
            if (saved) return { ...initialState, ...JSON.parse(saved) };
            return initialState;
        } catch {
            return initialState;
        }
    });

    useEffect(() => {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(live));
    }, [live]);

    function ajouterElement(onglet, element) {
        setLive((prev) => ({
            ...prev,
            [onglet]: [...prev[onglet], { id: Date.now(), ...element }],
        }));
    }

    function supprimerElement(onglet, id) {
        setLive((prev) => ({
            ...prev,
            [onglet]: prev[onglet].filter((el) => el.id !== id),
        }));
    }

    function clearLive() {
        sessionStorage.removeItem(STORAGE_KEY);
        setLive(initialState);
    }

    return { live, ajouterElement, supprimerElement, clearLive };
}