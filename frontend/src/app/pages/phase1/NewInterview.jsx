import { Link } from "react-router-dom";
import { Plus, Upload, Calendar, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";

export default function NewInterview() {
    return (
        <div className="p-6">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Title */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Créer un nouvel entretien
                    </h1>
                    <p className="text-gray-600">
                        Phase 1 — Configuration de l'interview
                    </p>
                </div>

                {/* Info entretien */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informations entretien</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Titre de l'entretien
                            </label>
                            <Input placeholder="Titre de l'entretien" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Calendar className="w-4 h-4 inline mr-1" />
                                    Date et heure
                                </label>
                                <Input type="datetime-local" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Durée estimée
                                </label>
                                <Input placeholder="Ex: 1h" />
                            </div>

                        </div>

                        {/* Parties prenantes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Users className="w-4 h-4 inline mr-1" />
                                Parties prenantes
                            </label>

                            <div className="space-y-2">

                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded border border-gray-200">
                                    <Input placeholder="Nom" className="flex-1" />
                                    <Input placeholder="Rôle" className="w-48" />
                                    <button className="text-sm text-red-600 hover:text-red-700 px-2">
                                        Retirer
                                    </button>
                                </div>

                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded border border-gray-200">
                                    <Input placeholder="Nom" className="flex-1" />
                                    <Input placeholder="Rôle" className="w-48" />
                                    <button className="text-sm text-red-600 hover:text-red-700 px-2">
                                        Retirer
                                    </button>
                                </div>

                                <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
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
                            />
                        </div>

                    </CardContent>
                </Card>

                {/* Import notes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Importer des notes existantes (optionnel)</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">

                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />

                            <p className="text-sm font-medium text-gray-700">
                                Glissez-déposez vos notes ici
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                                ou cliquez pour parcourir
                            </p>

                            <p className="text-xs text-gray-500 mt-2">
                                Formats supportés : .txt, .docx, .pdf
                            </p>

                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3">

                    <Link
                        to="/dashboard/phase1/interviews"
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Annuler
                    </Link>

                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Enregistrer brouillon
                    </button>

                    <Link
                        to="/dashboard/phase1/interview/1"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium ml-auto"
                    >
                        Créer l'entretien
                    </Link>

                </div>

            </div>
        </div>
    );
}