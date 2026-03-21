import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Calendar, AlertCircle, Loader2 } from "lucide-react";

import { Card, CardContent } from "../components/ui/card";
import { authFetch } from "../../services/authFetch";
import { setProjetCourant } from "../../services/projetCourant";
import { getInterviewByProjet, loadInterviewIntoSession, clearInterviewSession } from "../../services/interviewService";
import { loadNotesIntoSession } from "../../services/notesService";

export function Projects() {
    const [projets, setProjets]   = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState("");
    const [selecting, setSelecting] = useState(null); // id du projet en cours de sélection

    const navigate = useNavigate();

    useEffect(() => {
        authFetch("/api/projets")
            .then((res) => {
                if (!res.ok) throw new Error("Erreur serveur : " + res.status);
                return res.json();
            })
            .then((data) => setProjets(data))
            .catch(() => setError("Impossible de charger les projets."))
            .finally(() => setLoading(false));
    }, []);

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/login");
    };

    const handleSelectProjet = async (projet) => {
        setSelecting(projet.idProjet);

        // 1. Sauvegarder le projet courant
        setProjetCourant({
            id: projet.idProjet,
            nom: projet.nom,
            dateCreation: projet.dateCreation,
            idUtilisateur: projet.idUtilisateur,
        });

        // 2. Nettoyer la session précédente
        clearInterviewSession();

        try {
            // 3. Vérifier si une interview existe en BDD pour ce projet
            const interview = await getInterviewByProjet(projet.idProjet);

            if (interview) {
                // 4a. Interview trouvée → charger en sessionStorage
                loadInterviewIntoSession(interview);
                await loadNotesIntoSession(projet.idProjet);
                navigate("/dashboard/phase1/interview");
            } else {
                // 4b. Pas d'interview → aller sur la liste vide
                navigate("/dashboard/phase1/interviews");
            }
        } catch (err) {
            console.error(err);
            // En cas d'erreur réseau on va quand même sur interviews
            navigate("/dashboard/phase1/interviews");
        } finally {
            setSelecting(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Analyse Checker
                        </h1>
                        <p className="text-sm text-gray-500">Mes projets</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                        Déconnexion
                    </button>
                </div>
            </header>

            {/* Main */}
            <main className="max-w-7xl mx-auto p-6">

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Mes projets
                    </h2>
                    <Link
                        to="/projects/new"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Nouveau projet
                    </Link>
                </div>

                {error && (
                    <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="flex items-center justify-center py-20 text-gray-500">
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        Chargement des projets...
                    </div>
                )}

                {!loading && (
                    <div className="grid grid-cols-3 gap-6">

                        {/* Carte nouveau projet */}
                        <Link to="/projects/new">
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500 h-full">
                                <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                                        <Plus className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <h3 className="font-medium text-gray-900 mb-1">
                                        Créer un nouveau projet
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Démarrer une nouvelle analyse
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>

                        {/* Projets existants */}
                        {projets.map((projet) => (
                            <Card
                                key={projet.idProjet}
                                className={`hover:shadow-lg transition-shadow h-full ${
                                    selecting === projet.idProjet
                                        ? "opacity-60 cursor-wait"
                                        : "cursor-pointer"
                                }`}
                                onClick={() => {
                                    if (!selecting) handleSelectProjet(projet);
                                }}
                            >
                                <CardContent className="p-5 flex flex-col justify-between min-h-[200px]">

                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-900 mb-2">
                                            {projet.nom}
                                        </h3>

                                        {projet.dateCreation && (
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    Créé le{" "}
                                                    {new Date(projet.dateCreation).toLocaleDateString("fr-FR", {
                                                        day: "2-digit",
                                                        month: "long",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <span className="text-xs text-gray-400">
                                            ID #{projet.idProjet}
                                        </span>
                                        {selecting === projet.idProjet && (
                                            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                        )}
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