import { Link } from "react-router";
import { CheckCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "../../components/ui/select";

export function Phase2B() {
    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Title */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Flux MFC
                    </h1>
                    <p className="text-gray-600">
                        Phase 2B — Modèle de Flux de Communication (Lecture seule)
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-6">

                    {/* Canvas */}
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle>Canvas MFC</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="bg-gray-50 rounded-lg p-6 min-h-[500px] border-2 border-dashed border-gray-300">

                                <div className="mt-6 text-center text-sm text-gray-500">
                                    Modèle en lecture seule — Aucun flux défini
                                </div>

                            </div>
                        </CardContent>
                    </Card>

                    {/* Formulaire */}
                    <div className="col-span-1 space-y-6">

                        <Card>
                            <CardHeader>
                                <CardTitle>Informations flux</CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4">

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nom du flux
                                    </label>
                                    <Input placeholder="Nom du flux" disabled />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        De (acteur source)
                                    </label>

                                    <Select disabled>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner..." />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="placeholder">
                                                Aucun acteur
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Vers (acteur destination)
                                    </label>

                                    <Select disabled>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner..." />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="placeholder">
                                                Aucun acteur
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Type de flux
                                    </label>

                                    <Select disabled>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Type..." />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="info">
                                                Informationnel
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Canal / Support
                                    </label>

                                    <Select disabled>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Canal..." />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="mail">
                                                Mail
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                            </CardContent>
                        </Card>

                        {/* Info */}
                        <Card className="border-l-4 border-l-blue-600">

                            <CardHeader>
                                <CardTitle className="text-base">
                                    À propos de cet écran
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <p className="text-sm text-gray-700">
                                    Cet écran permet de <strong>visualiser et vérifier</strong> les flux MFC.
                                    La création de flux se fait en dehors de l'outil.
                                </p>
                            </CardContent>

                        </Card>

                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">

                    <Link
                        to="/dashboard/phase2/actors"
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        ← Retour aux acteurs
                    </Link>

                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        Vérifier cohérence
                    </button>

                    <Link
                        to="/dashboard/phase2/coherence"
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium ml-auto"
                    >
                        <CheckCircle className="w-4 h-4 inline mr-2" />
                        Valider périmètre
                    </Link>

                </div>

            </div>
        </div>
    );
}