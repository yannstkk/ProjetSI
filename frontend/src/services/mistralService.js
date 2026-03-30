import { authFetch } from "./authFetch";

export async function suggererQuestions(notes) {
    const response = await authFetch("/api/mistral/suggerer-questions", {
        method: "POST",
        body: JSON.stringify({ contenu: notes }),
    });

    if (!response.ok) {
        throw new Error(`Erreur serveur : ${response.status}`);
    }

    return response.json();
}