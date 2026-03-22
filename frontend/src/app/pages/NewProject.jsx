import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { authFetch } from "../../services/authFetch";
import { setProjetCourant } from "../../services/projetCourant";
import { clearInterviewSession } from "../../services/interviewService";

export function NewProject() {
    const [nom, setNom]         = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState("");
    const navigate = useNavigate();

    const handleCreer = async () => {
        if (!nom.trim()) {
            setError("Le nom du projet est obligatoire.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const username = sessionStorage.getItem("username");

            const res = await authFetch("/api/projets", {
                method: "POST",
                body: JSON.stringify({
                    nom:    nom.trim(),
                    idUser: username,   // ← idUser (pas idUtilisateur)
                }),
            });

            if (!res.ok) throw new Error("Erreur serveur : " + res.status);

            const projet = await res.json();

            // Stocker le projet courant
            setProjetCourant({
                id:           projet.idProjet,
                nom:          projet.nom,
                dateCreation: projet.dateCreation,
                idUser:       projet.idUser,
            });

            // Nouveau projet = sessionStorage interview vierge
            clearInterviewSession();

            // Rediriger vers le cockpit (pas vers interviews)
            navigate("/dashboard");

        } catch (err) {
            setError("Impossible de créer le projet. Vérifiez votre connexion.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Créer un nouveau projet
                    </h1>
                    <p className="text-sm text-gray-500">
                        Définissez les informations de base
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto p-6">

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Informations du projet</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nom du projet <span className="text-red-600">*</span>
                            </label>
                            <Input
                                placeholder="Nom du projet"
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleCreer()}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                    <Link
                        to="/projects"
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Annuler
                    </Link>
                    <button
                        onClick={handleCreer}
                        disabled={loading || !nom.trim()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors font-medium ml-auto"
                    >
                        {loading ? "Création..." : "Créer le projet"}
                    </button>
                </div>

            </main>
        </div>
    );
}