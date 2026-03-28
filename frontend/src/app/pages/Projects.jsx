import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Calendar, AlertCircle, Loader2 } from "lucide-react";

import { Card, CardContent } from "../components/ui/card";
import { authFetch } from "../../services/authFetch";
import { setProjetCourant } from "../../services/projetCourant";
import {
    getInterviewByProjet,
    loadInterviewIntoSession,
    clearInterviewSession,
} from "../../services/interviewService";
import {
    loadNotesIntoSession,
    loadNotesStructureesIntoSession,
    loadQuestionsIntoSession,
    loadParticipantsIntoSession,
} from "../../services/notesService";
import { loadUSFromDb } from "../../services/usService";
import { saveBacklog } from "./phase4/components/usStorage";
import { saveMFC, clearMFC } from "./phase2/components/helpers/mfcStorage";
import { saveBpmn, clearBpmn } from "./phase6/helpers/bpmnStorage";

// ─── Helpers chargement BDD ───────────────────────────────────────────────────

async function loadActeursIntoSession(idProjet) {
    const res = await authFetch(`/api/acteur/projet/${idProjet}`);
    if (!res.ok) return;
    const acteursDb = await res.json();
    if (!acteursDb.length) return;
    const acteursLocaux = acteursDb.map((a) => ({
        id:           a.idActeur,
        nom:          a.nom    || "",
        role:         a.role   || "",
        type:         a.type   || "internal",
        source:       a.source || "bdd",
        phraseSource: "",
    }));
    sessionStorage.setItem("phase2_acteurs", JSON.stringify(acteursLocaux));
}

async function loadMFCIntoSession(idProjet) {
    const res = await authFetch(`/api/modelisation/mfc/projet/${idProjet}`);
    if (!res.ok) return;
    const liste = await res.json();
    if (!liste.length) return;
    const mfc = liste[liste.length - 1];
    const fluxLocal    = (mfc.flux    || []).map((f) => ({ nom: f.nom || "", emetteur: f.emetteur || "", recepteur: f.recepteur || "", description: f.description || "", data: f.data || "" }));
    const acteursLocal = (mfc.acteurs || []).map((a) => ({ nom: a.nom || "" }));
    saveMFC({ code: "", diagramUrl: "", fileName: mfc.nom || "MFC importé depuis BDD", flux: fluxLocal, acteurs: acteursLocal, mfcDbId: mfc.id || null });
}

async function loadBpmnIntoSession(idProjet) {
    const res = await authFetch(`/api/bpmn/projet/${idProjet}`);
    if (!res.ok) return;
    const liste = await res.json();
    if (!liste.length) return;
    // Prendre le plus récent
    const bpmn = liste[liste.length - 1];
    const fichier = {
        id:      bpmn.idBpmn,
        nom:     bpmn.titre + ".bpmn",
        contenu: bpmn.contenu || "",
        dbId:    bpmn.idBpmn,
    };
    saveBpmn({
        fichiers: [fichier],
        selected: fichier,
        titre:    bpmn.titre || "",
        liens:    [],
        iaResult: null,
    });
}

// ─── Composant ────────────────────────────────────────────────────────────────

export function Projects() {
    const [projets, setProjets]     = useState([]);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState("");
    const [selecting, setSelecting] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        authFetch("/api/projets")
            .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
            .then((data) => setProjets(data))
            .catch(() => setError("Impossible de charger les projets."))
            .finally(() => setLoading(false));
    }, []);

    const handleLogout = () => { sessionStorage.clear(); navigate("/login"); };

    const handleSelectProjet = async (projet) => {
        setSelecting(projet.idProjet);
        setProjetCourant({ id: projet.idProjet, nom: projet.nom, dateCreation: projet.dateCreation, idUser: projet.idUser });
        clearInterviewSession();
        clearMFC();
        clearBpmn();

        try {
            // 1. Interview + notes
            const interview = await getInterviewByProjet(projet.idProjet);
            if (interview) {
                loadInterviewIntoSession(interview);
                await loadNotesIntoSession(interview.numeroInterview);
                await loadParticipantsIntoSession(interview.numeroInterview);
                await loadNotesStructureesIntoSession(interview.numeroInterview);
                await loadQuestionsIntoSession(interview.numeroInterview);
            }

            // 2. Acteurs Phase 2
            await loadActeursIntoSession(projet.idProjet);

            // 3. MFC Phase 2B (non bloquant)
            try { await loadMFCIntoSession(projet.idProjet); } catch { /* ignore */ }

            // 4. BPMN Phase 6 (non bloquant)
            try { await loadBpmnIntoSession(projet.idProjet); } catch { /* ignore */ }

            // 5. User Stories Phase 4 (non bloquant)
            try {
                const usDb = await loadUSFromDb(projet.idProjet);
                if (usDb.length > 0) saveBacklog(usDb);
            } catch { /* ignore */ }

            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            navigate("/dashboard");
        } finally {
            setSelecting(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Analyse Checker</h1>
                        <p className="text-sm text-gray-500">Mes projets</p>
                    </div>
                    <button onClick={handleLogout} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                        Déconnexion
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Mes projets</h2>
                    <Link to="/projects/new" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        <Plus className="w-4 h-4" /> Nouveau projet
                    </Link>
                </div>

                {error && (
                    <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />{error}
                    </div>
                )}

                {loading && (
                    <div className="flex items-center justify-center py-20 text-gray-500">
                        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Chargement des projets...
                    </div>
                )}

                {!loading && (
                    <div className="grid grid-cols-3 gap-6">
                        <Link to="/projects/new">
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500 h-full">
                                <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                                        <Plus className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <h3 className="font-medium text-gray-900 mb-1">Créer un nouveau projet</h3>
                                    <p className="text-sm text-gray-500">Démarrer une nouvelle analyse</p>
                                </CardContent>
                            </Card>
                        </Link>

                        {projets.map((projet) => (
                            <Card
                                key={projet.idProjet}
                                className={`hover:shadow-lg transition-shadow h-full ${selecting === projet.idProjet ? "opacity-60 cursor-wait" : "cursor-pointer"}`}
                                onClick={() => { if (!selecting) handleSelectProjet(projet); }}
                            >
                                <CardContent className="p-5 flex flex-col justify-between min-h-[200px]">
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-900 mb-2">{projet.nom}</h3>
                                        {projet.dateCreation && (
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Calendar className="w-4 h-4" />
                                                <span>Créé le {new Date(projet.dateCreation).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <span className="text-xs text-gray-400">ID #{projet.idProjet}</span>
                                        {selecting === projet.idProjet && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}