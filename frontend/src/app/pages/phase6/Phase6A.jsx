import { Upload, Eye, FileX } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export function Phase6A() {
    return (
        <div className="p-6">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Title */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Import BPMN
                    </h1>
                    <p className="text-gray-600">
                        Phase 6A — Importation du diagramme de processus
                    </p>
                </div>

                {/* Upload */}
                <Card>
                    <CardHeader>
                        <CardTitle>Importer un fichier BPMN</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">

                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />

                            <p className="text-sm font-medium text-gray-700">
                                Glissez-déposez votre fichier BPMN ici
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                                ou cliquez pour parcourir
                            </p>

                            <p className="text-xs text-gray-500 mt-2">
                                Formats supportés : .bpmn, .xml, .bizagi
                            </p>

                        </div>

                        <div className="flex items-center gap-4">

                            <div className="flex-1 border-t border-gray-300"></div>

                            <span className="text-sm text-gray-500">ou</span>

                            <div className="flex-1 border-t border-gray-300"></div>

                        </div>

                        <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            Charger depuis une URL
                        </button>

                    </CardContent>
                </Card>

                {/* Fichiers importés */}
                <Card>

                    <CardHeader>
                        <CardTitle>
                            Fichiers BPMN disponibles
                        </CardTitle>
                    </CardHeader>

                    <CardContent>

                        <div className="text-center py-12">

                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileX className="w-8 h-8 text-gray-400" />
                            </div>

                            <p className="text-sm font-medium text-gray-900 mb-1">
                                Aucun fichier BPMN importé
                            </p>

                            <p className="text-sm text-gray-600">
                                Importez votre premier diagramme de processus pour commencer
                            </p>

                        </div>

                    </CardContent>

                </Card>

                {/* Aperçu */}
                <Card>

                    <CardHeader>
                        <CardTitle>
                            Aperçu miniature
                        </CardTitle>
                    </CardHeader>

                    <CardContent>

                        <div className="bg-gray-50 rounded-lg p-6 min-h-[300px] flex items-center justify-center border-2 border-dashed border-gray-300">

                            <div className="text-center">

                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Eye className="w-8 h-8 text-gray-400" />
                                </div>

                                <p className="text-sm font-medium text-gray-900 mb-1">
                                    Aucun aperçu disponible
                                </p>

                                <p className="text-sm text-gray-600">
                                    L'aperçu s'affichera après l'import d'un fichier BPMN
                                </p>

                            </div>

                        </div>

                    </CardContent>

                </Card>

                {/* Actions */}
                <div className="flex gap-3">

                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Upload className="w-4 h-4 inline mr-2" />
                        Importer nouveau
                    </button>

                </div>

            </div>
        </div>
    );
}
