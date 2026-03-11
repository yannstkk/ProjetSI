import { Link } from "react-router";
import { Plus, Calendar, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Checkbox } from "../../components/ui/checkbox";

export function Phase1A() {
    return (
        <div className="p-6">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Title */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Préparer l'entretien
                    </h1>
                    <p className="text-gray-600">
                        Phase 1A — Configuration et planification
                    </p>
                </div>

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
                            <Input placeholder="Titre de l'entretien" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Calendar className="w-4 h-4 inline mr-1" />
                                    Date
                                </label>
                                <Input type="date" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Durée estimée
                                </label>
                                <Input placeholder="Durée estimée" />
                            </div>

                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Users className="w-4 h-4 inline mr-1" />
                                Participants
                            </label>

                            <div className="space-y-2">
                                <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                                    <Plus className="w-4 h-4" />
                                    Ajouter un participant
                                </button>
                            </div>
                        </div>

                    </CardContent>
                </Card>

                {/* Objectif métier */}
                <Card className="border-l-4 border-l-blue-600">
                    <CardHeader>
                        <CardTitle>Objectif métier (obligatoire)</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Demande brute du métier
                            </label>

                            <Textarea
                                placeholder="Décrire la demande métier..."
                                rows={4}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Points à couvrir */}
                <Card>
                    <CardHeader>
                        <CardTitle>Points à couvrir</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-3">

                            <div className="flex items-start gap-3">
                                <Checkbox id="obj" />
                                <label htmlFor="obj" className="text-sm cursor-pointer">
                                    <span className="font-medium">Objectifs</span> — Comprendre les buts métier
                                </label>
                            </div>

                            <div className="flex items-start gap-3">
                                <Checkbox id="act" />
                                <label htmlFor="act" className="text-sm cursor-pointer">
                                    <span className="font-medium">Acteurs</span> — Identifier tous les intervenants
                                </label>
                            </div>

                            <div className="flex items-start gap-3">
                                <Checkbox id="proc" />
                                <label htmlFor="proc" className="text-sm cursor-pointer">
                                    <span className="font-medium">Processus</span> — Cartographier les étapes
                                </label>
                            </div>

                            <div className="flex items-start gap-3">
                                <Checkbox id="data" />
                                <label htmlFor="data" className="text-sm cursor-pointer">
                                    <span className="font-medium">Données</span> — Lister les informations manipulées
                                </label>
                            </div>

                            <div className="flex items-start gap-3">
                                <Checkbox id="rules" />
                                <label htmlFor="rules" className="text-sm cursor-pointer">
                                    <span className="font-medium">Contraintes / Règles</span> — Identifier les règles métier
                                </label>
                            </div>

                            <div className="flex items-start gap-3">
                                <Checkbox id="pain" />
                                <label htmlFor="pain" className="text-sm cursor-pointer">
                                    <span className="font-medium">Irritants</span> — Recueillir les points de douleur
                                </label>
                            </div>

                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3">

                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Enregistrer
                    </button>

                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Générer guide
                    </button>

                    <Link
                        to="/dashboard/phase1/interview"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                        Démarrer l'interview
                    </Link>

                </div>

            </div>
        </div>
    );
}