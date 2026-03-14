const BASE_URL = "http://localhost:8080";

export async function suggererQuestions(notes) {
    const response = await fetch(`${BASE_URL}/api/mistral/suggerer-questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ notes }),
    });

    if (!response.ok) {
        throw new Error(`Erreur serveur : ${response.status}`);
    }

    return response.json();
}