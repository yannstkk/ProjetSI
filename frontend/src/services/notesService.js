import { authFetch } from "./authFetch";

export async function fetchNotes() {
    const response = await authFetch("/api/notes");

    if (!response.ok) {
        throw new Error(`Erreur serveur : ${response.status}`);
    }

    return response.json();
}