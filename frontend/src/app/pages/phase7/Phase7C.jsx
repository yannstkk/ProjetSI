import { Link } from "react-router-dom";
import { AlertTriangle, XCircle, CheckCircle, FileDown } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export function Phase7C() {
    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Title */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Contrôle cohérence Data
                    </h1>
                    <p className="text-gray-600">
                        Phase 7C — Vérification de la cohérence Données ↔ Processus ↔ Exigences
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">

                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-semibold text-gray-900">0</div>
                            <div className="text-sm text-gray-600">Entités MCD</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-semibold text-green-700">0</div>
                            <div className="text-sm text-gray-600">
                                Attributs valides
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-semibold text-red-700">0</div>
                            <div className="text-sm text-gray-600">
                                Alertes critiques
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-semibold text-orange-700">0</div>
                            <div className="text-sm text-gray-600">
                                Avertissements
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Alertes critiques */}
                <Card className="border-l-4 border-l-red-600">

                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-red-600" />
                            Alertes critiques (0)
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <p className="text-sm text-gray-500">
                            Aucune alerte critique détectée
                        </p>
                    </CardContent>

                </Card>

                {/* Avertissements */}
                <Card className="border-l-4 border-l-orange-500">

                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                            Avertissements (0)
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <p className="text-sm text-gray-500">
                            Aucun avertissement détecté
                        </p>
                    </CardContent>

                </Card>

                {/* Points validés */}
                <Card className="border-l-4 border-l-green-600">

                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            Cohérence validée
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <p className="text-sm text-gray-500">
                            Aucun contrôle effectué
                        </p>
                    </CardContent>

                </Card>

                {/* Matrice */}
                <Card>

                    <CardHeader>
                        <CardTitle>
                            Matrice de couverture données
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3">

                        <div>

                            <div className="flex justify-between text-sm mb-2">
                                <span>Attributs → Exigences</span>
                                <span className="font-medium">0% (0/0)</span>
                            </div>

                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-green-600" style={{ width: "0%" }} />
                            </div>

                        </div>

                        <div>

                            <div className="flex justify-between text-sm mb-2">
                                <span>Entités → Activités BPMN</span>
                                <span className="font-medium">0% (0/0)</span>
                            </div>

                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-green-600" style={{ width: "0%" }} />
                            </div>

                        </div>

                        <div>

                            <div className="flex justify-between text-sm mb-2">
                                <span>Relations → User Stories</span>
                                <span className="font-medium">0% (0/0)</span>
                            </div>

                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-green-600" style={{ width: "0%" }} />
                            </div>

                        </div>

                    </CardContent>

                </Card>

                {/* Actions */}
                <div className="flex gap-3">

                    <Link
                        to="/dashboard/phase7/viewer"
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        ← Retour au viewer
                    </Link>

                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <FileDown className="w-4 h-4" />
                        Exporter rapport
                    </button>

                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Marquer résolu
                    </button>

                    <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium ml-auto"
                    >
                        <CheckCircle className="w-4 h-4" />
                        Projet terminé
                    </Link>

                </div>

            </div>
        </div>
    );
}