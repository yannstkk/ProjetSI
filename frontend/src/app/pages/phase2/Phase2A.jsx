import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Plus, AlertTriangle, CheckCircle, Info, Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

import { ActeurModal } from "./components/ActeurModal";
import { ActeurTable } from "./components/ActeurTable";
import { AlerteActeursSansRole } from "./components/AlerteActeursSansRole";
import {
    loadActeurs,
    saveActeurs,
    getNotesTexte,
    appelDetectionActeurs,
} from "./components/helpers/acteurIA";

// ─── Constante ────────────────────────────────────────────────────────────────

const EMPTY_FORM = { nom: "", role: "", type: "internal" };

// ─── Composant principal ──────────────────────────────────────────────────────

export function Phase2A() {
    const [acteurs, setActeurs] = useState(loadActeurs);
    const [iaLoading, setIaLoading] = useState(false);
    const [iaError, setIaError] = useState("");
    const [iaRan, setIaRan] = useState(false);
    const [modal, setModal] = useState(null);

    // Sauvegarde automatique
    useEffect(() => {
        saveActeurs(acteurs);
    }, [acteurs]);

    // ── Détection IA ──────────────────────────────────────────────────────────

    async function lancerDetectionIA() {
        const notes = getNotesTexte();

        if (!notes.trim()) {
            setIaError("Aucune note trouvée. Importez des notes dans la Phase 1 d'abord.");
            return;
        }

        setIaLoading(true);
        setIaError("");

        try {
            const acteursDetectes = await appelDetectionActeurs(notes);

            if (acteursDetectes.length === 0) {
                setIaError("L'IA n'a détecté aucun acteur dans les notes.");
                setIaRan(true);
                return;
            }

            const nomsExistants = new Set(acteurs.map((a) => a.nom.toLowerCase()));

            const nouveaux = acteursDetectes
                .filter((a) => !nomsExistants.has(a.nom.toLowerCase()))
                .map((a) => ({
                    id: Date.now() + Math.random(),
                    nom: a.nom,
                    // Le rôle est pré-rempli si l'IA l'a identifié, sinon chaîne vide
                    role: a.role || "",
                    type: "internal",
                    source: "ia",
                    phraseSource: a.phraseSource || "",
                }));

            setActeurs((prev) => [...prev, ...nouveaux]);
            setIaRan(true);
        } catch (err) {
            setIaError("Erreur lors de l'analyse : " + err.message);
        } finally {
            setIaLoading(false);
        }
    }

    // ── CRUD acteurs ──────────────────────────────────────────────────────────

    function handleSave(acteurModifie) {
        if (acteurModifie.id && acteurs.some((a) => a.id === acteurModifie.id)) {
            setActeurs((prev) =>
                prev.map((a) => (a.id === acteurModifie.id ? acteurModifie : a))
            );
        } else {
            setActeurs((prev) => [
                ...prev,
                { ...acteurModifie, id: Date.now(), source: "manuel", phraseSource: "" },
            ]);
        }
        setModal(null);
    }

    function handleDelete(id) {
        setActeurs((prev) => prev.filter((a) => a.id !== id));
        setModal(null);
    }

    // ─────────────────────────────────────────────────────────────────────────

    const acteursSansRole = acteurs.filter((a) => !a.role.trim());

    return (
        <>
            {modal && (
                <ActeurModal
                    acteur={modal}
                    onSave={handleSave}
                    onDelete={handleDelete}
                    onClose={() => setModal(null)}
                />
            )}

            <div className="p-6">
                <div className="max-w-6xl mx-auto space-y-6">

                    {/* Titre */}
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Acteurs</h1>
                        <p className="text-gray-600">
                            Phase 2A — Identification et qualification des acteurs
                        </p>
                    </div>

                    {/* Classification */}
                    <Card className="border-l-4 border-l-blue-600">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Info className="w-5 h-5 text-blue-600" />
                                Classification Interne / Externe (obligatoire)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="p-3 bg-blue-50 rounded border border-blue-300">
                                    <div className="font-medium text-blue-900 mb-1">
                                        Acteur INTERNE
                                    </div>
                                    <div className="text-blue-700">
                                        Fait partie de l'organisation et interagit directement avec le système
                                    </div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded border border-gray-300">
                                    <div className="font-medium text-gray-900 mb-1">
                                        Acteur EXTERNE
                                    </div>
                                    <div className="text-gray-700">
                                        Extérieur à l'organisation, interagit avec le système
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Barre d'actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={lancerDetectionIA}
                            disabled={iaLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-300 transition-colors font-medium"
                        >
                            {iaLoading ? (
                                <>
                                    <span className="animate-spin">⏳</span>
                                    Détection en cours...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    Détecter les acteurs avec l'IA
                                </>
                            )}
                        </button>

                        {iaRan && !iaLoading && (
                            <span className="text-sm text-green-600 flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                Détection terminée
                            </span>
                        )}

                        <button
                            onClick={() => setModal(EMPTY_FORM)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium ml-auto"
                        >
                            <Plus className="w-4 h-4" />
                            Ajouter manuellement
                        </button>
                    </div>

                    {/* Erreur IA */}
                    {iaError && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                            {iaError}
                        </div>
                    )}

                    {/* Info : rôles pré-remplis par l'IA */}
                    {iaRan && !iaLoading && acteurs.some((a) => a.source === "ia" && a.role) && (
                        <div className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg text-purple-800 text-sm">
                            <Sparkles className="w-4 h-4 flex-shrink-0" />
                            Certains rôles ont été détectés automatiquement par l'IA. Vérifiez et complétez-les si nécessaire.
                        </div>
                    )}

                    {/* Tableau */}
                    <ActeurTable
                        acteurs={acteurs}
                        onEditer={(acteur) => setModal(acteur)}
                    />

                    {/* Alerte sans rôle */}
                    <AlerteActeursSansRole
                        acteurs={acteursSansRole}
                        onQualifier={(acteur) => setModal(acteur)}
                    />

                    {/* Navigation */}
                    <div className="flex gap-3">
                        <Link
                            to="/dashboard/phase2/flows"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium ml-auto"
                        >
                            Flux MFC →
                        </Link>
                    </div>

                </div>
            </div>
        </>
    );
}