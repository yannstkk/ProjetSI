import { useState } from "react";

const STORAGE_KEY = "interview_draft";

const initialState = {
    titre: "",
    dateHeure: "",
    duree: "",
    participants: [
        { nom: "", role: "" },
        { nom: "", role: "" },
    ],
    objectifs: "",
    notesImportees: [],
};

export function useInterviewForm() {
    const [form, setForm] = useState(() => {
        try {
            const saved = sessionStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Fusion avec initialState pour garantir tous les champs
                return { ...initialState, ...parsed };
            }
            return initialState;
        } catch {
            return initialState;
        }
    });

    const [savedMessage, setSavedMessage] = useState("");
    const [notesError, setNotesError] = useState("");

    function updateField(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    function updateParticipant(index, field, value) {
        setForm((prev) => {
            const updated = [...prev.participants];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, participants: updated };
        });
    }

    function addParticipant() {
        setForm((prev) => ({
            ...prev,
            participants: [...prev.participants, { nom: "", role: "" }],
        }));
    }

    function removeParticipant(index) {
        setForm((prev) => ({
            ...prev,
            participants: prev.participants.filter((_, i) => i !== index),
        }));
    }

    function importTxtFile(file) {
        setNotesError("");

        if (!file) return;

        if (!file.name.endsWith(".txt")) {
            setNotesError("Seuls les fichiers .txt sont acceptés pour l'instant.");
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            const contenu = e.target.result;
            const nouvelleNote = {
                nom: file.name,
                contenu,
            };

            setForm((prev) => ({
                ...prev,
                notesImportees: [...prev.notesImportees, nouvelleNote],
            }));
        };

        reader.onerror = () => {
            setNotesError("Erreur lors de la lecture du fichier.");
        };

        reader.readAsText(file, "UTF-8");
    }

    function removeNote(index) {
        setForm((prev) => ({
            ...prev,
            notesImportees: prev.notesImportees.filter((_, i) => i !== index),
        }));
    }

    function saveDraft() {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(form));
        setSavedMessage("Brouillon enregistré ✓");
        setTimeout(() => setSavedMessage(""), 3000);
    }

    function clearDraft() {
        sessionStorage.removeItem(STORAGE_KEY);
        setForm(initialState);
    }

    return {
        form,
        savedMessage,
        notesError,
        updateField,
        updateParticipant,
        addParticipant,
        removeParticipant,
        importTxtFile,
        removeNote,
        saveDraft,
        clearDraft,
    };
}