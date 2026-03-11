import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export function Phase5A() {
    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto space-y-6">

                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Générer exigences
                    </h1>
                    <p className="text-gray-600">
                        Phase 5A — Transformation US → Exigences fonctionnelles
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-6">

                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>User Story sélectionnée</CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="text-center py-8 text-gray-500">
                                    <p className="text-sm">Aucune US sélectionnée</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mt-4">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Liste des US
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="max-h-[300px] overflow-y-auto">
                                <p className="text-sm text-gray-500 text-center py-4">
                                    Aucune user story disponible
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Exigences fonctionnelles (0)</span>

                                    <button className="text-sm px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700">
                                        Générer avec IA
                                    </button>
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <p className="text-sm text-gray-500 text-center py-4">
                                    Aucune exigence générée
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                </div>

                <div className="flex gap-3">

                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Modifier
                    </button>

                    <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                        <CheckCircle className="w-4 h-4 inline mr-2" />
                        Valider exigence
                    </button>

                    <Link
                        to="/dashboard/phase5/matrix"
                        className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Matrice de traçabilité →
                    </Link>

                </div>

            </div>
        </div>
    );
}