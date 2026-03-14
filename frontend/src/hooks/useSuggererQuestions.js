import { useState, useEffect } from "react";
import { suggererQuestions } from "../services/mistralService";

const STORAGE_KEY = "interview_questions";

export function useSuggererQuestions() {
    const [questions, setQuestions] = useState(() => {
        try {
            const saved = sessionStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Sauvegarde automatique à chaque changement
    useEffect(() => {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
    }, [questions]);

    async function genererQuestions(notes) {
        if (!notes || notes.trim() === "") {
            setError("Aucune note disponible pour générer des questions.");
            return;
        }

        setLoading(true);
        setError("");
        setQuestions([]);

        try {
            const data = await suggererQuestions(notes);
            const content = data?.choices?.[0]?.message?.content;

            if (!content) {
                throw new Error("Réponse inattendue de l'API Mistral.");
            }

            const parsed = JSON.parse(content);
            setQuestions(parsed.questions || []);
        } catch (err) {
            setError("Erreur lors de la génération : " + err.message);
        } finally {
            setLoading(false);
        }
    }

    function resetQuestions() {
        sessionStorage.removeItem(STORAGE_KEY);
        setQuestions([]);
        setError("");
    }

    return { questions, loading, error, genererQuestions, resetQuestions };
}