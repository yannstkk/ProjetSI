const BASE_URL = "http://localhost:8080";

export async function authFetch(path, options = {}) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    return response;
}