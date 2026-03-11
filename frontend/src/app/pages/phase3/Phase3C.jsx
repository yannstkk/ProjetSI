import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

export function Phase3C() {
    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Title */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Classification
                    </h1>
                    <p className="text-gray-600">
                        Phase 3C — Organiser les éléments capturés
                    </p>
                </div>

                {/* Kanban */}
                <div className="grid grid-cols-4 gap-4">

                    {/* Besoins */}
                    <Card>
                        <CardHeader className="bg-green-50">
                            <CardTitle className="text-base flex items-center justify-between">
                                <span>Besoins</span>
                                <Badge>0</Badge>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-3">
                            <p className="text-sm text-gray-500 text-center py-4">
                                Aucun besoin
                            </p>
                        </CardContent>
                    </Card>

                    {/* Contraintes */}
                    <Card>
                        <CardHeader className="bg-red-50">
                            <CardTitle className="text-base flex items-center justify-between">
                                <span>Contraintes</span>
                                <Badge variant="destructive">0</Badge>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-3">
                            <p className="text-sm text-gray-500 text-center py-4">
                                Aucune contrainte
                            </p>
                        </CardContent>
                    </Card>

                    {/* Données */}
                    <Card>
                        <CardHeader className="bg-yellow-50">
                            <CardTitle className="text-base flex items-center justify-between">
                                <span>Données</span>
                                <Badge className="bg-yellow-600">0</Badge>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-3">
                            <p className="text-sm text-gray-500 text-center py-4">
                                Aucune donnée
                            </p>
                        </CardContent>
                    </Card>

                    {/* Ressenti */}
                    <Card>
                        <CardHeader className="bg-purple-50">
                            <CardTitle className="text-base flex items-center justify-between">
                                <span>Ressenti</span>
                                <Badge className="bg-purple-600">0</Badge>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-3">
                            <p className="text-sm text-gray-500 text-center py-4">
                                Aucun ressenti
                            </p>
                        </CardContent>
                    </Card>

                </div>

                {/* Résumé */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Résumé de la classification
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="grid grid-cols-4 gap-4">

                            <div className="text-center p-4 bg-green-50 rounded">
                                <div className="text-2xl font-semibold text-green-700">0</div>
                                <div className="text-sm text-gray-600">Besoins</div>
                            </div>

                            <div className="text-center p-4 bg-red-50 rounded">
                                <div className="text-2xl font-semibold text-red-700">0</div>
                                <div className="text-sm text-gray-600">Contraintes</div>
                            </div>

                            <div className="text-center p-4 bg-yellow-50 rounded">
                                <div className="text-2xl font-semibold text-yellow-700">0</div>
                                <div className="text-sm text-gray-600">Données</div>
                            </div>

                            <div className="text-center p-4 bg-purple-50 rounded">
                                <div className="text-2xl font-semibold text-purple-700">0</div>
                                <div className="text-sm text-gray-600">Ressentis</div>
                            </div>

                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3">

                    <Link
                        to="/dashboard/phase2/coherence"
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        ← Retour
                    </Link>

                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Générer synthèse
                    </button>

                    <Link
                        to="/dashboard/phase4/backlog"
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium ml-auto"
                    >
                        Envoyer vers Phase 4
                        <ArrowRight className="w-4 h-4" />
                    </Link>

                </div>

            </div>
        </div>
    );
}