import { useState, useEffect } from "react";
import { fetchNotes } from "../services/notesService";

export function useNotes() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchNotes()
            .then((data) => setNotes(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return { notes, loading, error };
}