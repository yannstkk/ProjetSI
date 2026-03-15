import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Plus, AlertTriangle, CheckCircle, Info, Sparkles, Edit, X, User, Building } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { authFetch } from "../../../services/authFetch";



const STORAGE_KEY = "phase2_acteurs";
const EMPTY_FORM = { nom: "", role: "", type: "internal" };



function loadActeurs() {
    try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
}

function saveActeurs(acteurs) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(acteurs));
}

function getNotesTexte() {
    try {
        const draft = sessionStorage.getItem("interview_draft");
        if (!draft) return "";
        const parsed = JSON.parse(draft);
        return (parsed.notesImportees || []).map((n) => n.contenu).join("\n\n");
    } catch {
        return "";
    }
}

/**
 * Appelle /api/mistral/suggerer-questions avec un prompt orienté détection d'acteurs.
 * Cet endpoint fonctionne et renvoie la réponse brute Mistral (choices[0].message.content).
 * On injecte le prompt acteurs dans le champ "notes" — le backend le transmet tel quel à Mistral.
 */
async function appelDetectionActeurs(notesTexte) {
    const promptActeurs =
        `Tu es un expert AFSI. Voici des notes d'entretien métier :\n\n${notesTexte}\n\n` +
        `Identifie tous les acteurs (personnes, rôles, systèmes, organisations) mentionnés ou implicites dans ces notes. ` +
        `Pour chaque acteur, fournis son nom court et la phrase exacte des notes qui justifie sa présence. ` +
        `Réponds UNIQUEMENT en JSON brut sans aucun texte avant ou après, avec cette structure exacte : ` +
        `{ "acteurs": [ { "nom": "", "phraseSource": "" } ] }`;

    const response = await authFetch("/api/mistral/suggerer-questions", {
        method: "POST",
        body: JSON.stringify({ notes: promptActeurs }),
    });

    if (!response.ok) throw new Error(`Erreur serveur : ${response.status}`);

    const data = await response.json();


    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error("Réponse inattendue de l'API.");


    const cleaned = content.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return parsed.acteurs || [];
}


function ActeurModal({ acteur, onSave, onDelete, onClose }) {
    const isNew = !acteur.id;
    const [form, setForm] = useState({
        nom: acteur.nom || "",
        role: acteur.role || "",
        type: acteur.type || "internal",
    });
    const [confirmDelete, setConfirmDelete] = useState(false);

    function handleSave() {
        if (!form.nom.trim()) return;
        onSave({ ...acteur, ...form });
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">

                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h3 className="font-semibold text-lg text-gray-900">
                        {isNew ? "Ajouter un acteur" : "Modifier l'acteur"}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Source badge */}
                {!isNew && (
                    <div className="mb-4">
                        <span className="text-xs text-gray-500">Source : </span>
                        {acteur.source === "ia" ? (
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-medium">
                                <Sparkles className="w-3 h-3" /> IA
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">
                                <User className="w-3 h-3" /> Saisie manuelle
                            </span>
                        )}
                    </div>
                )}

                {/* Formulaire */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nom <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="Ex: Comptable, Client, Responsable RH..."
                            value={form.nom}
                            onChange={(e) => setForm((p) => ({ ...p, nom: e.target.value }))}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rôle
                        </label>
                        <Input
                            placeholder="Ex: Valide les factures, Passe commande..."
                            value={form.role}
                            onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setForm((p) => ({ ...p, type: "internal" }))}
                                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-colors text-sm font-medium ${
                                    form.type === "internal"
                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                                }`}
                            >
                                <User className="w-4 h-4" />
                                Interne
                            </button>
                            <button
                                onClick={() => setForm((p) => ({ ...p, type: "external" }))}
                                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-colors text-sm font-medium ${
                                    form.type === "external"
                                        ? "border-gray-500 bg-gray-50 text-gray-700"
                                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                                }`}
                            >
                                <Building className="w-4 h-4" />
                                Externe
                            </button>
                        </div>
                    </div>

                    {/* Phrase source IA */}
                    {acteur.phraseSource && (
                        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <p className="text-xs text-purple-600 font-medium mb-1">Extrait des notes :</p>
                            <p className="text-xs text-gray-600 italic">"{acteur.phraseSource}"</p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                    {!isNew && !confirmDelete && (
                        <button
                            onClick={() => setConfirmDelete(true)}
                            className="flex items-center gap-1 px-3 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 text-sm"
                        >
                            Supprimer
                        </button>
                    )}
                    {confirmDelete && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-red-600">Confirmer ?</span>
                            <button
                                onClick={() => onDelete(acteur.id)}
                                className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                            >
                                Oui
                            </button>
                            <button
                                onClick={() => setConfirmDelete(false)}
                                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                            >
                                Non
                            </button>
                        </div>
                    )}
                    <div className="ml-auto flex gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!form.nom.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 text-sm font-medium"
                        >
                            {isNew ? "Ajouter" : "Enregistrer"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


export function Phase2A() {

    const [acteurs, setActeurs] = useState(loadActeurs);
    const [iaLoading, setIaLoading] = useState(false);
    const [iaError, setIaError] = useState("");
    const [iaRan, setIaRan] = useState(false);
    const [modal, setModal] = useState(null);

    useEffect(() => {
        saveActeurs(acteurs);
    }, [acteurs]);


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
                    role: "",
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
                                    <div className="font-medium text-blue-900 mb-1">Acteur INTERNE</div>
                                    <div className="text-blue-700">
                                        Fait partie de l'organisation et interagit directement avec le système
                                    </div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded border border-gray-300">
                                    <div className="font-medium text-gray-900 mb-1">Acteur EXTERNE</div>
                                    <div className="text-gray-700">
                                        Extérieur à l'organisation, interagit avec le système
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
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

                    {/* Tableau */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Liste des acteurs ({acteurs.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nom</TableHead>
                                        <TableHead>Rôle</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Source</TableHead>
                                        <TableHead className="w-[100px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {acteurs.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                                                Aucun acteur — Cliquez sur "Détecter avec l'IA" ou ajoutez-en un manuellement
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        acteurs.map((acteur) => (
                                            <TableRow key={acteur.id}>
                                                <TableCell className="font-medium text-gray-900">
                                                    {acteur.nom}
                                                </TableCell>
                                                <TableCell className="text-gray-600">
                                                    {acteur.role || (
                                                        <span className="text-orange-500 text-xs italic">Non défini</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {acteur.type === "internal" ? (
                                                        <Badge className="bg-blue-100 text-blue-700 border-0">
                                                            <User className="w-3 h-3 mr-1" /> Interne
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-gray-100 text-gray-700 border-0">
                                                            <Building className="w-3 h-3 mr-1" /> Externe
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {acteur.source === "ia" ? (
                                                        <Badge className="bg-purple-100 text-purple-700 border-0 gap-1">
                                                            <Sparkles className="w-3 h-3" /> IA
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-blue-50 text-blue-600 border-0">
                                                            Manuel
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <button
                                                        onClick={() => setModal(acteur)}
                                                        className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                                    >
                                                        <Edit className="w-3.5 h-3.5" />
                                                        Éditer
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Acteurs sans rôle */}
                    <Card className="border-l-4 border-l-orange-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-orange-600" />
                                Acteurs sans rôle défini ({acteursSansRole.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {acteursSansRole.length === 0 ? (
                                <p className="text-sm text-gray-500">Tous les acteurs ont un rôle défini ✓</p>
                            ) : (
                                <div className="space-y-2">
                                    <p className="text-sm text-orange-700 mb-3">
                                        Ces acteurs nécessitent une qualification avant de passer à la suite.
                                    </p>
                                    {acteursSansRole.map((a) => (
                                        <div
                                            key={a.id}
                                            className="flex items-center justify-between p-3 bg-orange-50 rounded border border-orange-200"
                                        >
                                            <div>
                                                <span className="font-medium text-gray-900 text-sm">{a.nom}</span>
                                                <span className="ml-2 text-xs text-orange-600">— rôle manquant</span>
                                            </div>
                                            <button
                                                onClick={() => setModal(a)}
                                                className="text-xs px-2 py-1 border border-orange-300 rounded hover:bg-orange-100 text-orange-700"
                                            >
                                                Qualifier
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

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