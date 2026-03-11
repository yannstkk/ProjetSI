import { Link } from "react-router";
import { Plus, AlertTriangle, CheckCircle, Info } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table";

export function Phase2A() {
    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Title */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Acteurs</h1>
                    <p className="text-gray-600">
                        Phase 2A — Identification et qualification des acteurs
                    </p>
                </div>

                {/* Classification interne / externe */}
                <Card className="border-l-4 border-l-blue-600">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Info className="w-5 h-5 text-blue-600" />
                            Classification Interne / Externe (obligatoire)
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="p-3 bg-blue-50 rounded border border-blue-300">
                                <div className="font-medium text-blue-900 mb-1">
                                    Acteur INTERNE
                                </div>
                                <div className="text-blue-700">
                                    Un acteur qui fait partie de l'organisation et interagit
                                    directement avec le système
                                </div>
                            </div>

                            <div className="p-3 bg-gray-50 rounded border border-gray-300">
                                <div className="font-medium text-gray-900 mb-1">
                                    Acteur EXTERNE
                                </div>
                                <div className="text-gray-700">
                                    Un acteur extérieur à l'organisation qui interagit avec le
                                    système
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Table acteurs */}
                <Card>
                    <CardHeader>
                        <CardTitle>Liste des acteurs</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom</TableHead>
                                    <TableHead>Rôle</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Source</TableHead>
                                    <TableHead className="w-[100px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                                        Aucun acteur défini — Cliquez sur &quot;+ Créer acteur&quot; pour
                                        commencer
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <button className="flex items-center gap-2 mt-4 text-sm text-blue-600 hover:text-blue-700">
                            <Plus className="w-4 h-4" />
                            Ajouter un acteur
                        </button>
                    </CardContent>
                </Card>

                {/* Suggestions */}
                <Card className="border-l-4 border-l-orange-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                            Acteurs suspects / cachés
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <p className="text-sm text-gray-500">Aucune alerte détectée</p>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Qualifier interne/externe
                    </button>

                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        <CheckCircle className="w-4 h-4 inline mr-2" />
                        Valider acteurs
                    </button>

                    <Link
                        to="/dashboard/phase2/flows"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium ml-auto"
                    >
                        Flux MFC →
                    </Link>
                </div>
            </div>
        </div>
    );
}