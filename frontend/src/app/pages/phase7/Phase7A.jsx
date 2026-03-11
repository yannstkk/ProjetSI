import { Link } from "react-router-dom";
import { Upload, FileJson } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export function Phase7A() {
    return (
        <div className="p-6">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Title */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Import Dictionnaire + MCD
                    </h1>
                    <p className="text-gray-600">
                        Phase 7A — Importation des données et modèle conceptuel
                    </p>
                </div>

                {/* Upload Dictionnaire */}
                <Card>

                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileJson className="w-5 h-5" />
                            Importer un dictionnaire de données
                        </CardTitle>
                    </CardHeader>

                    <CardContent>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">

                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />

                            <p className="text-sm font-medium text-gray-700">
                                Glissez-déposez votre fichier dictionnaire ici
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                                ou cliquez pour parcourir
                            </p>

                            <p className="text-xs text-gray-500 mt-2">
                                Formats supportés : .json, .xml, .csv, .xlsx
                            </p>

                        </div>

                    </CardContent>

                </Card>

                {/* Upload MCD */}
                <Card>

                    <CardHeader>
                        <CardTitle>
                            Importer un MCD (Modèle Conceptuel de Données)
                        </CardTitle>
                    </CardHeader>

                    <CardContent>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">

                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />

                            <p className="text-sm font-medium text-gray-700">
                                Glissez-déposez votre MCD ici
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                                ou cliquez pour parcourir
                            </p>

                            <p className="text-xs text-gray-500 mt-2">
                                Formats supportés : .pdf, .png, .jpg, .drawio, .powerdesigner
                            </p>

                        </div>

                    </CardContent>

                </Card>

                {/* Actions */}
                <div className="flex gap-3">

                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Upload className="w-4 h-4 inline mr-2" />
                        Importer nouveaux fichiers
                    </button>

                    <Link
                        to="/dashboard/phase7/viewer"
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium ml-auto"
                    >
                        Voir MCD →
                    </Link>

                </div>

            </div>
        </div>
    );
}