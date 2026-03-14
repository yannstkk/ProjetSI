const BASE_URL = "http://localhost:8080";

export async function fetchNotes() {
    const response = await fetch(`${BASE_URL}/api/notes`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(`Erreur serveur : ${response.status}`);
    }

    return response.json();
}