import { Link } from "react-router-dom";
import { FileDown, ArrowRight, CheckCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table";

export function Phase5B() {
    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Matrice de traçabilité
                    </h1>
                    <p className="text-gray-600">
                        Phase 5B — Vue complète des liens Exigences ↔ US ↔ Acteurs ↔ Données
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Matrice complète (12 exigences)</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Exigence</TableHead>
                                        <TableHead className="w-[80px]">US</TableHead>
                                        <TableHead>Acteur</TableHead>
                                        <TableHead>Donnée</TableHead>
                                        <TableHead>Flux</TableHead>
                                        <TableHead className="w-[100px]">Statut</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    <TableRow>
                                        <TableCell colSpan={6} className="py-8 text-center text-gray-500">
                                            Aucune exigence fonctionnelle — Créez des US d&apos;abord en Phase 4
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-semibold text-gray-900">0</div>
                            <div className="text-sm text-gray-600">Exigences totales</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-semibold text-green-700">0</div>
                            <div className="text-sm text-gray-600">Exigences validées</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-semibold text-blue-700">0</div>
                            <div className="text-sm text-gray-600">User Stories liées</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-semibold text-purple-700">0</div>
                            <div className="text-sm text-gray-600">Acteurs impliqués</div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-l-4 border-l-green-600">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            Contrôle de cohérence
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <span>Toutes les US ont au moins une exigence associée</span>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <span>Tous les acteurs sont liés à au moins une exigence</span>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <span>Toutes les données manipulées sont tracées</span>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <span>Les flux MFC sont cohérents avec les exigences</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-3">
                    <Link
                        to="/dashboard/phase5/generate"
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        ← Retour
                    </Link>

                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Vérifier cohérence
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <FileDown className="w-4 h-4" />
                        Exporter matrice
                    </button>

                    <Link
                        to="/dashboard/phase6/import"
                        className="ml-auto flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Passer à Phase 6
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}