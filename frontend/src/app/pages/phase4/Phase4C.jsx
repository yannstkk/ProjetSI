import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export function Phase4C() {
    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Contrôle cohérence
                    </h1>
                    <p className="text-gray-600">
                        Phase 4C — Vérification et liens US
                    </p>
                </div>

                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-3">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Menu US (0)</CardTitle>
                            </CardHeader>

                            <CardContent>
                                <p className="text-sm text-gray-500">
                                    Aucune US disponible
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="col-span-9 space-y-6">
                        <Card className="border-2 border-dashed border-gray-300">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <p className="text-sm text-gray-500">
                                    Sélectionnez une US dans le menu pour voir les détails
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="mt-6 flex gap-3">
                    <Link
                        to="/dashboard/phase4/backlog"
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        ← Retour au backlog
                    </Link>

                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Corriger tout
                    </button>

                    <Link
                        to="/dashboard/phase5/generate"
                        className="ml-auto flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Passer à Phase 5
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}