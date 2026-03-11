import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";

export function Cockpit() {
    return (
        <div className="p-6 space-y-6">

            {/* Page title */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                    Cockpit Global
                </h1>
                <p className="text-gray-600">
                    Vue d'ensemble du projet et suivi des phases
                </p>
            </div>

            {/* Timeline */}
            <Card>

                <CardHeader>
                    <CardTitle>Timeline du projet</CardTitle>
                </CardHeader>

                <CardContent>

                    <div className="space-y-6">

                        {[
                            { title: "Entretien métier", phase: "Phase 1" },
                            { title: "User Stories", phase: "Phase 4" },
                            { title: "Exigences", phase: "Phase 5" },
                            { title: "BPMN", phase: "Phase 6" },
                            { title: "MCD / Données", phase: "Phase 7" }
                        ].map((item, index) => (

                            <div key={index} className="flex items-center gap-4">

                                <div className="flex-1 flex items-center gap-4">

                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                        <ArrowRight className="w-5 h-5 text-gray-400" />
                                    </div>

                                    <div className="flex-1">

                                        <div className="font-medium">
                                            {item.title}
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            {item.phase}
                                        </div>

                                        <Progress value={0} className="mt-2" />

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                </CardContent>

            </Card>

            {/* Alertes critiques */}
            <Card>

                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        Alertes critiques
                    </CardTitle>
                </CardHeader>

                <CardContent>

                    <div className="text-center py-8 text-gray-500">
                        <p className="text-sm">Aucune alerte détectée</p>
                    </div>

                </CardContent>

            </Card>

            {/* Statistiques */}
            <div className="grid grid-cols-4 gap-4">

                {[
                    { label: "Acteurs", color: "text-green-600" },
                    { label: "User Stories", color: "text-blue-600" },
                    { label: "Exigences", color: "text-purple-600" },
                    { label: "Entités MCD", color: "text-orange-600" }
                ].map((stat, index) => (

                    <Card key={index}>

                        <CardContent className="p-6">

                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm text-gray-500">
                                        {stat.label}
                                    </p>

                                    <p className="text-2xl font-semibold mt-1">
                                        0
                                    </p>
                                </div>

                                <TrendingUp className={`w-8 h-8 ${stat.color}`} />

                            </div>

                        </CardContent>

                    </Card>

                ))}

            </div>

            {/* Actions rapides */}
            <Card>

                <CardHeader>
                    <CardTitle>Actions rapides</CardTitle>
                </CardHeader>

                <CardContent>

                    <div className="flex flex-wrap gap-3">

                        <Link
                            to="/dashboard/phase1/prepare"
                            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Nouvel entretien
                        </Link>

                        <Link
                            to="/dashboard/phase4/backlog"
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Voir backlog
                        </Link>

                        <Link
                            to="/dashboard/phase5/matrix"
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Matrice traçabilité
                        </Link>

                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            Exporter dossier final
                        </button>

                    </div>

                </CardContent>

            </Card>

        </div>
    );
}