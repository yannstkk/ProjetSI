import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Calendar, AlertCircle, Loader2 } from "lucide-react";

import { Card, CardContent } from "../components/ui/card";

export function Projects() {
    const [projets, setProjets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:8080/api/projets", {
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) throw new Error("Erreur serveur : " + res.status);
                return res.json();
            })
            .then((data) => {
                setProjets(data);
            })
            .catch((err) => {
                setError("Impossible de charger les projets. Vérifiez votre connexion.");
                console.error(err);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/login");
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
                        <p className="text-sm text-gray-500">
                            Mes projets
                        </p>
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

                {/* Erreur */}
                {error && (
                    <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        {error}
                    </div>
                )}

                {/* Chargement */}
                {loading && (
                    <div className="flex items-center justify-center py-20 text-gray-500">
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        Chargement des projets...
                    </div>
                )}

                {/* Grid projets */}
                {!loading && (
                    <div className="grid grid-cols-3 gap-6">

                        {/* Carte "Nouveau projet" */}
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
                            <Link to="/dashboard" key={projet.idProjet}>
                                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
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

                                        <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
                                            ID #{projet.idProjet}
                                        </div>

                                    </CardContent>
                                </Card>
                            </Link>
                        ))}

                    </div>
                )}

            </main>

        </div>
    );
}