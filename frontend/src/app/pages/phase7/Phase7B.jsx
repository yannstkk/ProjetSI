import { Link } from "react-router-dom";
import { Search } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

export function Phase7B() {
    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">

                {/* Title */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Viewer MCD
                    </h1>
                    <p className="text-gray-600">
                        Phase 7B — Visualisation du modèle conceptuel de données
                    </p>
                </div>

                <div className="grid grid-cols-12 gap-6">

                    {/* Zone centrale */}
                    <div className="col-span-8">

                        <Card className="h-full">

                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">

                                    <span>MCD_Facturation_v3</span>

                                    <div className="flex gap-2">

                                        <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                                            Zoom +
                                        </button>

                                        <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                                            Zoom -
                                        </button>

                                        <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                                            Centrer
                                        </button>

                                    </div>

                                </CardTitle>
                            </CardHeader>

                            <CardContent>

                                <div className="bg-gray-50 rounded-lg p-6 min-h-[600px] border border-gray-300 flex items-center justify-center">

                                    <div className="text-center text-gray-500">

                                        <p className="text-sm">
                                            Aucun MCD importé
                                        </p>

                                        <p className="text-xs mt-1">
                                            Les entités et relations apparaîtront ici
                                        </p>

                                    </div>

                                </div>

                            </CardContent>

                        </Card>

                    </div>

                    {/* Panneau droit */}
                    <div className="col-span-4 space-y-4">

                        <Card>

                            <CardHeader>
                                <CardTitle className="text-base">
                                    Liste des entités
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <p className="text-sm text-gray-500">
                                    Aucune entité disponible
                                </p>
                            </CardContent>

                        </Card>

                        <Card>

                            <CardHeader>
                                <CardTitle className="text-base">
                                    Relations
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <p className="text-sm text-gray-500">
                                    Aucune relation disponible
                                </p>
                            </CardContent>

                        </Card>

                        <Card>

                            <CardHeader>
                                <CardTitle className="text-base">
                                    Rechercher entité
                                </CardTitle>
                            </CardHeader>

                            <CardContent>

                                <div className="relative">

                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                                    <Input
                                        placeholder="Nom d'entité..."
                                        className="pl-10"
                                    />

                                </div>

                            </CardContent>

                        </Card>

                        <Card>

                            <CardHeader>
                                <CardTitle className="text-base">
                                    Dictionnaire
                                </CardTitle>
                            </CardHeader>

                            <CardContent>

                                <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                                    Afficher dictionnaire complet
                                </button>

                            </CardContent>

                        </Card>

                    </div>

                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">

                    <Link
                        to="/dashboard/phase7/import"
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        ← Retour
                    </Link>

                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Afficher dictionnaire
                    </button>

                    <Link
                        to="/dashboard/phase7/control"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium ml-auto"
                    >
                        Contrôle cohérence →
                    </Link>

                </div>

            </div>
        </div>
    );
}