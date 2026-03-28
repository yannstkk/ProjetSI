import { useState } from "react";
import { X, User, Building, Sparkles } from "lucide-react";
import { Input } from "../../../components/ui/input";

export function ActeurModal({ acteur, onSave, onDelete, onClose }) {
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

                {/* Badge source */}
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
                            <p className="text-xs text-purple-600 font-medium mb-1">
                                Extrait des notes :
                            </p>
                            <p className="text-xs text-gray-600 italic">
                                "{acteur.phraseSource}"
                            </p>
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