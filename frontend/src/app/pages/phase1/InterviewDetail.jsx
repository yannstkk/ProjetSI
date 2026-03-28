import { Link } from "react-router-dom";
import { Calendar, Users, FileText, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

export default function InterviewDetail() {
    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Détail entretien
                        </h1>
                        <p className="text-gray-600">
                            Phase 1 — Détail de l'interview
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Badge className="bg-gray-100 text-gray-700">
                            Brouillon
                        </Badge>

                        <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                            <Edit className="w-4 h-4" />
                            Modifier
                        </button>
                    </div>
                </div>

                {/* Informations générales */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informations générales</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">

                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-gray-500" />
                            <div>
                                <div className="text-sm font-medium">Date et heure</div>
                                <div className="text-sm text-gray-600">
                                    Non défini
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-gray-500" />
                            <div>
                                <div className="text-sm font-medium">
                                    Parties prenantes
                                </div>
                                <div className="text-sm text-gray-600">
                                    Aucun participant
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-500" />
                            <div>
                                <div className="text-sm font-medium">
                                    Éléments capturés
                                </div>
                                <div className="text-sm text-gray-600">
                                    0 éléments
                                </div>
                            </div>
                        </div>

                    </CardContent>
                </Card>

                {/* Échanges */}
                <Card>
                    <CardHeader>
                        <CardTitle>Échanges et notes</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="text-center py-8 text-gray-500">
                            <p className="text-sm">
                                Aucun échange enregistré
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3">

                    <Link
                        to="/dashboard/phase1/interviews"
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Retour à la liste
                    </Link>

                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Exporter
                    </button>

                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Modifier
                    </button>

                </div>

            </div>
        </div>
    );
}