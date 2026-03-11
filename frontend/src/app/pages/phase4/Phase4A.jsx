import { Link } from "react-router-dom";
import { Plus, Search, Filter, AlertTriangle, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table";

export function Phase4A() {
    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Backlog US</h1>
                    <p className="text-gray-600">Phase 4A — Gestion des User Stories</p>
                </div>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    placeholder="Rechercher une user story..."
                                    className="pl-10"
                                />
                            </div>

                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                <Filter className="w-4 h-4" />
                                Filtrer
                            </button>

                            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                                <Download className="w-4 h-4" />
                                Importer depuis Taiga
                            </button>

                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                <Plus className="w-4 h-4" />
                                Nouvelle US
                            </button>

                            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                Détecter doublons
                            </button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>User Stories (0)</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">ID</TableHead>
                                    <TableHead>Titre</TableHead>
                                    <TableHead>Acteur</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="w-[100px]">Qualité</TableHead>
                                    <TableHead className="w-[100px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                <TableRow>
                                    <TableCell colSpan={6} className="py-8 text-center text-gray-500">
                                        Aucune user story — Cliquez sur &quot;+ Nouvelle US&quot; ou
                                        &quot; Importer depuis Taiga&quot;
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                            Alertes qualité (0)
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <p className="text-sm text-gray-500">Aucune alerte détectée</p>
                    </CardContent>
                </Card>

                <div className="flex gap-3">
                    <Link
                        to="/dashboard/phase4/form"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Créer US →
                    </Link>

                    <Link
                        to="/dashboard/phase4/control"
                        className="ml-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Contrôle cohérence
                    </Link>
                </div>
            </div>
        </div>
    );
}