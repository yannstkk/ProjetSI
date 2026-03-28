import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

export function Phase6B() {
    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">

                {/* Title */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Viewer BPMN + Liens
                    </h1>
                    <p className="text-gray-600">
                        Phase 6B — Visualisation et traçabilité processus
                    </p>
                </div>

                <div className="grid grid-cols-12 gap-6">

                    {/* Diagramme */}
                    <div className="col-span-8">
                        <Card className="h-full">

                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">

                                    <span>Processus_Facturation_v2.bpmn</span>

                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                                            Zoom +
                                        </button>

                                        <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                                            Zoom -
                                        </button>

                                        <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                                            Réinitialiser
                                        </button>
                                    </div>

                                </CardTitle>
                            </CardHeader>

                            <CardContent>

                                <div className="bg-gray-50 rounded-lg p-6 min-h-[600px] border border-gray-300 flex items-center justify-center">

                                    <div className="text-center text-gray-500">

                                        <p className="text-sm">
                                            Aucun processus BPMN importé
                                        </p>

                                        <p className="text-xs mt-1">
                                            Les swimlanes et activités apparaîtront ici
                                        </p>

                                    </div>

                                </div>

                            </CardContent>

                        </Card>
                    </div>

                    {/* Panneau droit */}
                    <div className="col-span-4 space-y-4">

                        {/* US */}
                        <Card>

                            <CardHeader>
                                <CardTitle className="text-base">
                                    User Stories liées
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-2">

                                <p className="text-sm text-gray-500">
                                    Aucune US liée
                                </p>

                                <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mt-2">
                                    <Plus className="w-4 h-4" />
                                    Lier à une US
                                </button>

                            </CardContent>

                        </Card>

                        {/* Exigences */}
                        <Card>

                            <CardHeader>
                                <CardTitle className="text-base">
                                    Exigences liées
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-2">

                                <p className="text-sm text-gray-500">
                                    Aucune exigence liée
                                </p>

                                <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mt-2">
                                    <Plus className="w-4 h-4" />
                                    Lier à exigence
                                </button>

                            </CardContent>

                        </Card>

                        {/* Recherche */}
                        <Card>

                            <CardHeader>
                                <CardTitle className="text-base">
                                    Rechercher
                                </CardTitle>
                            </CardHeader>

                            <CardContent>

                                <div className="relative">

                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                                    <Input
                                        placeholder="Rechercher une activité..."
                                        className="pl-10"
                                    />

                                </div>

                            </CardContent>

                        </Card>

                    </div>

                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">

                    <Link
                        to="/dashboard/phase6/import"
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        ← Retour
                    </Link>

                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Afficher dictionnaire
                    </button>

                    <Link
                        to="/dashboard/phase6/coverage"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium ml-auto"
                    >
                        Contrôle couverture →
                    </Link>

                </div>

            </div>
        </div>
    );
}
