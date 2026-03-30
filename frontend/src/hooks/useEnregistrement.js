import { useState, useRef, useEffect } from "react";

const STORAGE_KEY_AUDIO = "interview_audio";
const STORAGE_KEY_MARQUEURS = "interview_marqueurs";
const STORAGE_KEY_STATUT = "interview_statut";

export function useEnregistrement() {
    const [statut, setStatut] = useState(() => {
        const saved = sessionStorage.getItem(STORAGE_KEY_STATUT);
        return saved || "idle";
    });

    const [tempsEcoule, setTempsEcoule] = useState(0);
    const [marqueurs, setMarqueurs] = useState(() => {
        try {
            const saved = sessionStorage.getItem(STORAGE_KEY_MARQUEURS);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [audioUrl, setAudioUrl] = useState(() => {
        const saved = sessionStorage.getItem(STORAGE_KEY_AUDIO);
        if (saved) {
            const blob = base64ToBlob(saved, "audio/webm");
            return URL.createObjectURL(blob);
        }
        return null;
    });

    const [limitAtteinte, setLimitAtteinte] = useState(false);

    const [ecouteEnPause, setEcouteEnPause] = useState(false);

    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const intervalRef = useRef(null);
    const tempsRef = useRef(0);
    const audioPauseUrlRef = useRef(null);

    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);

    useEffect(() => {
        sessionStorage.setItem(STORAGE_KEY_MARQUEURS, JSON.stringify(marqueurs));
    }, [marqueurs]);

    useEffect(() => {
        sessionStorage.setItem(STORAGE_KEY_STATUT, statut);
    }, [statut]);

    function demarrerChrono() {
        intervalRef.current = setInterval(() => {
            tempsRef.current += 1;
            setTempsEcoule(tempsRef.current);
        }, 1000);
    }

    function arreterChrono() {
        clearInterval(intervalRef.current);
    }

    async function demarrer() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                    const tailleTotale = chunksRef.current.reduce(
                        (acc, chunk) => acc + chunk.size, 0
                    );
                    if (tailleTotale >= 5 * 1024 * 1024) {
                        arreter(true);
                    }
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: "audio/webm" });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                blobToBase64(blob).then((base64) => {
                    try {
                        sessionStorage.setItem(STORAGE_KEY_AUDIO, base64);
                    } catch {
                        console.warn("Audio trop volumineux pour sessionStorage.");
                    }
                });
                stream.getTracks().forEach((track) => track.stop());
            };

            mediaRecorder.start(1000);
            tempsRef.current = 0;
            setTempsEcoule(0);
            demarrerChrono();
            setStatut("recording");
            setLimitAtteinte(false);
            setEcouteEnPause(false);
        } catch (err) {
            console.error("Erreur accès micro :", err);
        }
    }

    function pause() {
        if (mediaRecorderRef.current?.state === "recording") {
            mediaRecorderRef.current.pause();
        }
        arreterChrono();

        if (chunksRef.current.length > 0) {
            const blob = new Blob(chunksRef.current, { type: "audio/webm" });
            audioPauseUrlRef.current = URL.createObjectURL(blob);
        }

        setStatut("paused");
    }

    function reprendre() {
        if (mediaRecorderRef.current?.state === "paused") {
            mediaRecorderRef.current.resume();
        }
        setEcouteEnPause(false);
        demarrerChrono();
        setStatut("recording");
    }

    function arreter(limiteAtteinte = false) {
        if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state !== "inactive"
        ) {
            mediaRecorderRef.current.stop();
        }
        arreterChrono();
        setStatut("stopped");
        if (limiteAtteinte) setLimitAtteinte(true);
    }

    function marquer() {
        const marqueur = {
            id: Date.now(),
            temps: tempsRef.current,
            label: `Marqueur ${marqueurs.length + 1}`,
        };
        setMarqueurs((prev) => [...prev, marqueur]);
    }

    function supprimerMarqueur(id) {
        setMarqueurs((prev) => prev.filter((m) => m.id !== id));
    }

    function clearEnregistrement() {
        sessionStorage.removeItem(STORAGE_KEY_AUDIO);
        sessionStorage.removeItem(STORAGE_KEY_MARQUEURS);
        sessionStorage.removeItem(STORAGE_KEY_STATUT);
        setStatut("idle");
        setTempsEcoule(0);
        setMarqueurs([]);
        setAudioUrl(null);
        setLimitAtteinte(false);
        setEcouteEnPause(false);
        tempsRef.current = 0;
    }

    return {
        statut,
        tempsEcoule,
        marqueurs,
        audioUrl,
        audioPauseUrl: audioPauseUrlRef.current,
        limitAtteinte,
        ecouteEnPause,
        setEcouteEnPause,
        demarrer,
        pause,
        reprendre,
        arreter,
        marquer,
        supprimerMarqueur,
        clearEnregistrement,
    };
}

function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

function base64ToBlob(base64, mimeType) {
    const bytes = atob(base64);
    const arr = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
        arr[i] = bytes.charCodeAt(i);
    }
    return new Blob([arr], { type: mimeType });
}