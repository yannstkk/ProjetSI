import { Link } from "react-router";
import { FileDown, ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export function Phase1D() {
    return (
        <div className="p-6">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Title */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Traçabilité & Export
                    </h1>

                    <p className="text-gray-600">
                        Phase 1D — Timeline et compte-rendu
                    </p>
                </div>

                {/* Timeline */}
                <Card>

                    <CardHeader>
                        <CardTitle>
                            Timeline de l'entretien
                        </CardTitle>
                    </CardHeader>

                    <CardContent>

                        <div className="text-center py-8 text-gray-500">
                            <p className="text-sm">
                                Aucun échange enregistré
                            </p>
                        </div>

                    </CardContent>

                </Card>

                {/* Résumé */}
                <Card className="border-l-4 border-l-blue-600">

                    <CardHeader>
                        <CardTitle>
                            Résumé de l'entretien
                        </CardTitle>
                    </CardHeader>

                    <CardContent>

                        <div className="grid grid-cols-3 gap-4">

                            <div className="text-center p-4 bg-gray-50 rounded">
                                <div className="text-2xl font-semibold text-gray-900">0</div>
                                <div className="text-sm text-gray-600">Durée (min)</div>
                            </div>

                            <div className="text-center p-4 bg-gray-50 rounded">
                                <div className="text-2xl font-semibold text-gray-900">0</div>
                                <div className="text-sm text-gray-600">
                                    Éléments capturés
                                </div>
                            </div>

                            <div className="text-center p-4 bg-gray-50 rounded">
                                <div className="text-2xl font-semibold text-gray-900">0</div>
                                <div className="text-sm text-gray-600">
                                    Points à clarifier
                                </div>
                            </div>

                        </div>

                    </CardContent>

                </Card>

                {/* Actions */}
                <div className="flex gap-3">

                    <Link
                        to="/dashboard/phase1/control"
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Retour
                    </Link>

                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <FileDown className="w-4 h-4" />
                        Exporter compte-rendu
                    </button>

                    <Link
                        to="/dashboard/phase2/actors"
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium ml-auto"
                    >
                        Passer à Phase 2
                        <ArrowRight className="w-4 h-4" />
                    </Link>

                </div>

            </div>
        </div>
    );
}