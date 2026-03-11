import { Link } from "react-router";
import { AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export function Phase2C() {
    return (
        <div className="p-6">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Title */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Résultat contrôle cohérence
                    </h1>
                    <p className="text-gray-600">
                        Phase 2C — Vérification du périmètre
                    </p>
                </div>

                {/* Alertes cohérence */}
                <Card className="border-l-4 border-l-yellow-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            Alertes cohérence (0)
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <p className="text-sm text-gray-500">
                            Aucune incohérence détectée
                        </p>
                    </CardContent>
                </Card>

                {/* Résumé MFC */}
                <Card className="border-l-4 border-l-green-600">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            Synthèse MFC
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="grid grid-cols-3 gap-4">

                            <div className="text-center p-4 bg-gray-50 rounded">
                                <div className="text-2xl font-semibold text-gray-900">0</div>
                                <div className="text-sm text-gray-600">Acteurs</div>
                            </div>

                            <div className="text-center p-4 bg-gray-50 rounded">
                                <div className="text-2xl font-semibold text-gray-900">0</div>
                                <div className="text-sm text-gray-600">Flux</div>
                            </div>

                            <div className="text-center p-4 bg-gray-50 rounded">
                                <div className="text-2xl font-semibold text-gray-900">0</div>
                                <div className="text-sm text-gray-600">Connexions</div>
                            </div>

                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3">

                    <Link
                        to="/dashboard/phase2/flows"
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        ← Retour aux flux
                    </Link>

                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Aller corriger
                    </button>

                    <Link
                        to="/dashboard/phase3/classification"
                        className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium ml-auto"
                    >
                        Valider Phase 2
                        <ArrowRight className="w-4 h-4" />
                    </Link>

                </div>

            </div>
        </div>
    );
}