import { Link } from "react-router";
import { AlertTriangle, CheckCircle, Plus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export function Phase1C() {
    return (
        <div className="p-6">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Title */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Contrôle avant clôture
                    </h1>
                    <p className="text-gray-600">
                        Phase 1C — Vérification de complétude
                    </p>
                </div>

                {/* Alertes */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                            Alertes détectées (0)
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <p className="text-sm text-gray-500">
                            Aucune alerte détectée
                        </p>
                    </CardContent>
                </Card>

                {/* Questions ouvertes */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Questions ouvertes restantes
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3">

                        <p className="text-sm text-gray-500">
                            Aucune question ouverte
                        </p>

                        <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                            <Plus className="w-4 h-4" />
                            Ajouter une question
                        </button>

                    </CardContent>
                </Card>

                {/* Points validés */}
                <Card className="border-l-4 border-l-green-600">

                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            Points validés
                        </CardTitle>
                    </CardHeader>

                    <CardContent>

                        <div className="grid grid-cols-2 gap-4">

                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm">0 besoins confirmés</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm">0 règles métier capturées</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm">0 acteurs identifiés</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm">0 données listées</span>
                            </div>

                        </div>

                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3">

                    <Link
                        to="/dashboard/phase1/interview"
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Retour à l'interview
                    </Link>

                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Corriger les alertes
                    </button>

                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Ajouter question
                    </button>

                    <Link
                        to="/dashboard/phase1/trace"
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                    >
                        Clôturer l'entretien
                    </Link>

                </div>

            </div>
        </div>
    );
}