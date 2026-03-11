import { Link } from "react-router";
import { Plus, AlertTriangle, Mic, Clock, Bookmark } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

export function Phase1B() {
    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">

                {/* Title */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Mode Interview Live
                    </h1>
                    <p className="text-gray-600">
                        Phase 1B — Prise de notes structurée en temps réel
                    </p>
                </div>

                {/* Barre d'enregistrement */}
                <Card className="mb-6 border-l-4 border-l-red-600">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3">

                                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                        <Mic className="w-5 h-5 text-red-600" />
                                    </div>

                                    <div>
                                        <div className="font-medium text-sm">
                                            Enregistrement actif
                                        </div>

                                        <div className="text-xs text-gray-600 flex items-center gap-2">
                                            <Clock className="w-3 h-3" />
                                            <span className="font-mono">00:24:15</span>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className="flex gap-2">

                                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm">
                                    <Bookmark className="w-4 h-4" />
                                    Marquer moment important
                                </button>

                                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                                    Stop enregistrement
                                </button>

                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Layout principal */}
                <div className="grid grid-cols-12 gap-4">

                    {/* Colonne gauche */}
                    <div className="col-span-3 space-y-4">

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Questions suggérées
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <button className="w-full text-sm text-blue-600 hover:text-blue-700 py-2">
                                    Suggérer question
                                </button>
                            </CardContent>
                        </Card>

                    </div>

                    {/* Colonne centrale */}
                    <div className="col-span-6">

                        <Card className="h-full">

                            <CardHeader>
                                <CardTitle>
                                    Notes structurées
                                </CardTitle>
                            </CardHeader>

                            <CardContent>

                                <Tabs defaultValue="besoins">

                                    <TabsList className="grid grid-cols-5 w-full">
                                        <TabsTrigger value="besoins">Besoins</TabsTrigger>
                                        <TabsTrigger value="regles">Règles</TabsTrigger>
                                        <TabsTrigger value="donnees">Données</TabsTrigger>
                                        <TabsTrigger value="contraintes">Contraintes</TabsTrigger>
                                        <TabsTrigger value="solutions">Solutions</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="besoins" className="space-y-3 mt-4">

                                        <button className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50">

                                            <Plus className="w-4 h-4" />
                                            <span className="text-sm font-medium">
                        Créer besoin
                      </span>

                                        </button>

                                    </TabsContent>

                                    <TabsContent value="regles" className="mt-4">

                                        <div className="text-center py-8 text-gray-500">
                                            <p className="text-sm">
                                                Aucune règle métier capturée
                                            </p>

                                            <button className="mt-3 text-sm text-blue-600 hover:text-blue-700">
                                                + Ajouter une règle
                                            </button>
                                        </div>

                                    </TabsContent>

                                    <TabsContent value="donnees" className="mt-4">

                                        <div className="text-center py-8 text-gray-500">
                                            <p className="text-sm">
                                                Aucune donnée capturée
                                            </p>

                                            <button className="mt-3 text-sm text-blue-600 hover:text-blue-700">
                                                + Ajouter une donnée
                                            </button>
                                        </div>

                                    </TabsContent>

                                    <TabsContent value="contraintes" className="mt-4">

                                        <div className="text-center py-8 text-gray-500">
                                            <p className="text-sm">
                                                Aucune contrainte identifiée
                                            </p>
                                        </div>

                                    </TabsContent>

                                    <TabsContent value="solutions" className="mt-4">

                                        <div className="text-center py-8 text-gray-500">
                                            <p className="text-sm">
                                                Aucune solution proposée
                                            </p>
                                        </div>

                                    </TabsContent>

                                </Tabs>

                            </CardContent>
                        </Card>

                    </div>

                    {/* Colonne droite */}
                    <div className="col-span-3 space-y-4">

                        <Card>

                            <CardHeader>
                                <CardTitle className="text-base">
                                    Reformulation proposée
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-3">

                                <p className="text-sm bg-blue-50 p-3 rounded border border-blue-200">
                                    Reformulation apparaîtra ici...
                                </p>

                                <div className="flex gap-2">

                                    <button className="flex-1 text-sm px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                                        Valider
                                    </button>

                                    <button className="flex-1 text-sm px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">
                                        Corriger
                                    </button>

                                </div>

                            </CardContent>

                        </Card>

                        <Card>

                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                                    Alertes en direct
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <p className="text-sm text-gray-500">
                                    Aucune alerte en direct
                                </p>
                            </CardContent>

                        </Card>

                    </div>

                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">

                    <Link
                        to="/dashboard/phase1/prepare"
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Retour
                    </Link>

                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Pause
                    </button>

                    <Link
                        to="/dashboard/phase1/control"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                        Fin entretien
                    </Link>

                </div>

            </div>
        </div>
    );
}