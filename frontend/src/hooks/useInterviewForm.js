import { useState } from "react";

const STORAGE_KEY = "interview_draft";

const initialState = {
    titre:          "",
    dateHeure:      "",
    duree:          "",
    participants:   [{ nom: "", role: "" }, { nom: "", role: "" }],
    objectifs:      "",
    notesImportees: [],
};

export function useInterviewForm() {
    const [form, setFormState] = useState(() => {
        try {
            const saved = sessionStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                return { ...initialState, ...parsed };
            }
            return initialState;
        } catch {
            return initialState;
        }
    });

    const [savedMessage, setSavedMessage] = useState("");
    const [notesError, setNotesError]     = useState("");

    // Exposé pour permettre un rechargement complet depuis l'extérieur (ex: import BDD)
    function setForm(newForm) {
        setFormState({ ...initialState, ...newForm });
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...initialState, ...newForm }));
    }

    function updateField(field, value) {
        setFormState((prev) => {
            const updated = { ...prev, [field]: value };
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }

    function updateParticipant(index, field, value) {
        setFormState((prev) => {
            const updated = [...prev.participants];
            updated[index] = { ...updated[index], [field]: value };
            const newForm = { ...prev, participants: updated };
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newForm));
            return newForm;
        });
    }

    function addParticipant() {
        setFormState((prev) => {
            const newForm = {
                ...prev,
                participants: [...prev.participants, { nom: "", role: "" }],
            };
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newForm));
            return newForm;
        });
    }

    function removeParticipant(index) {
        setFormState((prev) => {
            const newForm = {
                ...prev,
                participants: prev.participants.filter((_, i) => i !== index),
            };
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newForm));
            return newForm;
        });
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
            const nouvelleNote = { nom: file.name, contenu };

            setFormState((prev) => {
                const newForm = {
                    ...prev,
                    notesImportees: [...prev.notesImportees, nouvelleNote],
                };
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newForm));
                return newForm;
            });
        };

        reader.onerror = () => {
            setNotesError("Erreur lors de la lecture du fichier.");
        };

        reader.readAsText(file, "UTF-8");
    }

    function removeNote(index) {
        setFormState((prev) => {
            const newForm = {
                ...prev,
                notesImportees: prev.notesImportees.filter((_, i) => i !== index),
            };
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newForm));
            return newForm;
        });
    }

    function saveDraft() {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(form));
        setSavedMessage("Brouillon enregistré ✓");
        setTimeout(() => setSavedMessage(""), 3000);
    }

    function clearDraft() {
        sessionStorage.removeItem(STORAGE_KEY);
        setFormState(initialState);
    }

    return {
        form,
        setForm,
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