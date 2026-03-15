import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Upload, Calendar, Users, CheckCircle, FileText, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { useInterviewForm } from "../../../hooks/useInterviewForm";
import { useEffect } from "react";


export default function NewInterview() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [showConfirmRetour, setShowConfirmRetour] = useState(false);

      useEffect(() => {
            sessionStorage.setItem("phase1_last", window.location.pathname);
        }, []);

    const {
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
    } = useInterviewForm();

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (file) importTxtFile(file);
        e.target.value = "";
    }

    function handleCancel() {
        setShowConfirmRetour(true);
    }

    function handleConfirmRetour() {
        clearDraft();
        navigate("/dashboard/phase1/interviews");
    }

    return (
        <>
            {/* Modale confirmation retour */}
            {showConfirmRetour && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">
                            Confirmer le retour
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Si vous retournez à la liste, toutes les données
                            saisies dans ce formulaire seront{" "}
                            <strong>perdues définitivement</strong>. Voulez-vous continuer ?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowConfirmRetour(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleConfirmRetour}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Confirmer le retour
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-6">
                <div className="max-w-5xl mx-auto space-y-6">

                    {/* Title */}
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Créer un nouvel entretien
                        </h1>
                        <p className="text-gray-600">
                            Phase 1 : Configuration de l'interview
                        </p>
                    </div>

                    {/* Message confirmation */}
                    {savedMessage && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-300 rounded-lg text-green-700 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            {savedMessage}
                        </div>
                    )}

                    {/* Informations entretien */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations entretien</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Titre de l'entretien
                                </label>
                                <Input
                                    placeholder="Titre de l'entretien"
                                    value={form.titre}
                                    onChange={(e) => updateField("titre", e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Calendar className="w-4 h-4 inline mr-1" />
                                        Date et heure
                                    </label>
                                    <Input
                                        type="datetime-local"
                                        value={form.dateHeure}
                                        onChange={(e) => updateField("dateHeure", e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Durée estimée
                                    </label>
                                    <Input
                                        placeholder="Ex: 1h"
                                        value={form.duree}
                                        onChange={(e) => updateField("duree", e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Parties prenantes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Users className="w-4 h-4 inline mr-1" />
                                    Parties prenantes
                                </label>

                                <div className="space-y-2">
                                    {form.participants.map((p, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 p-3 bg-gray-50 rounded border border-gray-200"
                                        >
                                            <Input
                                                placeholder="Nom"
                                                className="flex-1"
                                                value={p.nom}
                                                onChange={(e) =>
                                                    updateParticipant(index, "nom", e.target.value)
                                                }
                                            />
                                            <Input
                                                placeholder="Rôle"
                                                className="w-48"
                                                value={p.role}
                                                onChange={(e) =>
                                                    updateParticipant(index, "role", e.target.value)
                                                }
                                            />
                                            <button
                                                className="text-sm text-red-600 hover:text-red-700 px-2"
                                                onClick={() => removeParticipant(index)}
                                            >
                                                Retirer
                                            </button>
                                        </div>
                                    ))}

                                    <button
                                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                                        onClick={addParticipant}
                                    >
                                        <Plus className="w-4 h-4" />
                                        Ajouter une personne
                                    </button>
                                </div>
                            </div>

                            {/* Objectifs */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Objectifs de l'entretien
                                </label>
                                <Textarea
                                    placeholder="Décrivez les objectifs de cet entretien..."
                                    rows={4}
                                    value={form.objectifs}
                                    onChange={(e) => updateField("objectifs", e.target.value)}
                                />
                            </div>

                        </CardContent>
                    </Card>

                    {/* Import notes TXT */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Importer des notes existantes (optionnel)</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">

                            {/* Zone drop */}
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const file = e.dataTransfer.files[0];
                                    if (file) importTxtFile(file);
                                }}
                            >
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-sm font-medium text-gray-700">
                                    Glissez-déposez vos notes ici
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    ou cliquez pour parcourir
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                    Format accepté : .txt
                                </p>
                            </div>

                            {/* Input fichier caché */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".txt"
                                className="hidden"
                                onChange={handleFileChange}
                            />

                            {/* Erreur */}
                            {notesError && (
                                <p className="text-sm text-red-600">{notesError}</p>
                            )}

                            {/* Fichiers importés */}
                            {form.notesImportees.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-700">
                                        Fichiers importés ({form.notesImportees.length}) :
                                    </p>
                                    {form.notesImportees.map((note, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start justify-between p-3 bg-blue-50 rounded border border-blue-200"
                                        >
                                            <div className="flex items-start gap-2 flex-1 min-w-0">
                                                <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-gray-700 truncate">
                                                        {note.nom}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                        {note.contenu}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeNote(index)}
                                                className="ml-3 text-gray-400 hover:text-red-600 flex-shrink-0"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex gap-3">

                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Annuler
                        </button>

                        <button
                            onClick={saveDraft}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Enregistrer brouillon
                        </button>

                        <button
                            onClick={() => {
                                saveDraft();
                                navigate("/dashboard/phase1/interview");
                            }}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium ml-auto"
                        >
                            Créer l'entretien
                        </button>

                    </div>

                </div>
            </div>
        </>
    );
}