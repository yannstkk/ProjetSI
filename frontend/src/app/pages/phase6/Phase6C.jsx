import { Link } from "react-router-dom";
import { CheckCircle, XCircle, AlertTriangle, FileDown, ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export function Phase6C() {
    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Title */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Contrôle couverture BPMN
                    </h1>
                    <p className="text-gray-600">
                        Phase 6C — Vérification de la cohérence processus ↔ exigences
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">

                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-semibold text-gray-900">0</div>
                            <div className="text-sm text-gray-600">Processus</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-semibold text-green-700">0</div>
                            <div className="text-sm text-gray-600">
                                Activités couvertes
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-semibold text-blue-700">0</div>
                            <div className="text-sm text-gray-600">
                                User Stories liées
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-semibold text-purple-700">0</div>
                            <div className="text-sm text-gray-600">
                                Exigences liées
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* US couvertes */}
                <Card className="border-l-4 border-l-green-600">

                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            User Stories couvertes (0)
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <p className="text-sm text-gray-500">
                            Aucune US couverte
                        </p>
                    </CardContent>

                </Card>

                {/* US non couvertes */}
                <Card className="border-l-4 border-l-red-600">

                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-red-600" />
                            User Stories non couvertes (0)
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <p className="text-sm text-gray-500">
                            Aucune US non couverte
                        </p>
                    </CardContent>

                </Card>

                {/* Activités sans lien */}
                <Card className="border-l-4 border-l-orange-500">

                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                            Activités BPMN sans lien (0)
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <p className="text-sm text-gray-500">
                            Aucune activité orpheline
                        </p>
                    </CardContent>

                </Card>

                {/* Taux de couverture */}
                <Card>

                    <CardHeader>
                        <CardTitle>
                            Taux de couverture
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3">

                        <div>

                            <div className="flex justify-between text-sm mb-2">
                                <span>User Stories → BPMN</span>
                                <span className="font-medium">0% (0/0)</span>
                            </div>

                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-600"
                                    style={{ width: "0%" }}
                                />
                            </div>

                        </div>

                        <div>

                            <div className="flex justify-between text-sm mb-2">
                                <span>Activités BPMN → Exigences</span>
                                <span className="font-medium">0% (0/0)</span>
                            </div>

                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-600"
                                    style={{ width: "0%" }}
                                />
                            </div>

                        </div>

                    </CardContent>

                </Card>

                {/* Actions */}
                <div className="flex gap-3">

                    <Link
                        to="/dashboard/phase6/viewer"
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        ← Retour au viewer
                    </Link>

                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <FileDown className="w-4 h-4" />
                        Exporter rapport
                    </button>

                    <Link
                        to="/dashboard/phase7/import"
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium ml-auto"
                    >
                        Passer à Phase 7
                        <ArrowRight className="w-4 h-4" />
                    </Link>

                </div>

            </div>
        </div>
    );
}