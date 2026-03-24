import { Edit, User, Building, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";

export function ActeurTable({ acteurs, onEditer }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Liste des acteurs ({acteurs.length})</CardTitle>
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
                        {acteurs.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="text-center text-gray-500 py-8"
                                >
                                    Aucun acteur — Cliquez sur "Détecter avec l'IA" ou ajoutez-en un manuellement
                                </TableCell>
                            </TableRow>
                        ) : (
                            acteurs.map((acteur) => (
                                <TableRow key={acteur.id}>

                                    <TableCell className="font-medium text-gray-900">
                                        {acteur.nom}
                                    </TableCell>

                                    <TableCell className="text-gray-600">
                                        {acteur.role || (
                                            <span className="text-orange-500 text-xs italic">
                                                Non défini
                                            </span>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {acteur.type === "internal" ? (
                                            <Badge className="bg-blue-100 text-blue-700 border-0">
                                                <User className="w-3 h-3 mr-1" /> Interne
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-gray-100 text-gray-700 border-0">
                                                <Building className="w-3 h-3 mr-1" /> Externe
                                            </Badge>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {acteur.source === "ia" ? (
                                            <Badge className="bg-purple-100 text-purple-700 border-0 gap-1">
                                                <Sparkles className="w-3 h-3" /> IA
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-blue-50 text-blue-600 border-0">
                                                Manuel
                                            </Badge>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        <button
                                            onClick={() => onEditer(acteur)}
                                            className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <Edit className="w-3.5 h-3.5" />
                                            Éditer
                                        </button>
                                    </TableCell>

                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}