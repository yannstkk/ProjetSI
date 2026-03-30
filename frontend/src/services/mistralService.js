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

export async function genererExigencesGlobales(idProjet) {
    const response = await authFetch(`/api/modelisation/exigences/generer/${idProjet}`, {
        method: "POST"
    });

    if (!response.ok) {
        throw new Error(`Erreur lors de la génération : ${response.status}`);
    }
    return response.json();
}

export async function sauvegarderExigences(idProjet, exigences) {
    const response = await authFetch(`/api/modelisation/exigences/sauvegarder/${idProjet}`, {
        method: "POST",
        body: JSON.stringify(exigences),
    });

    if (!response.ok) {
        throw new Error(`Erreur lors de la sauvegarde : ${response.status}`);
    }
    return response; 
}

export const mistralService = {
    suggererQuestions,
    genererExigencesGlobales,
    sauvegarderExigences
};