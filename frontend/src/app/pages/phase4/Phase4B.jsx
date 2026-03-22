import { Link } from "react-router-dom";
import { CheckCircle, Plus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";

export function Phase4B() {
    return (
        <div className="p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Formulaire User Story
                    </h1>
                    <p className="text-gray-600">Phase 4B — Création / Édition</p>
                </div>

                <Card className="border-l-4 border-l-blue-600">
                    <CardHeader>
                        <CardTitle>Format User Story</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                En tant que <span className="text-red-600">*</span>
                            </label>

                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner un acteur" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="placeholder">
                                        Aucun acteur disponible
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Je veux <span className="text-red-600">*</span>
                            </label>
                            <Input placeholder="Décrire le besoin..." />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Afin de <span className="text-red-600">*</span>
                            </label>
                            <Input placeholder="Décrire la valeur métier..." />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Je suis satisfait si (critères de satisfaction)
                            </label>

                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                                    <Input placeholder="Critère 1" />
                                </div>

                                <div className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                                    <Input placeholder="Critère 2" />
                                </div>

                                <div className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                                    <Input placeholder="Critère 3" />
                                </div>

                                <div className="flex gap-2 mt-2">
                                    <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                                        <Plus className="w-4 h-4" />
                                        Ajouter un critère
                                    </button>

                                    <button className="flex items-center gap-2 text-sm px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700">
                                        Générer avec IA
                                    </button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center justify-between">
                                <span>Acteurs impliqués</span>
                                <Badge variant="secondary" className="text-xs">
                                    Auto
                                </Badge>
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-500">Aucun acteur lié</p>
                                <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                                    <Plus className="w-4 h-4" />
                                    Ajouter un acteur
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center justify-between">
                                <span>Flux concernés</span>
                                <Badge variant="secondary" className="text-xs">
                                    Auto
                                </Badge>
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-500">Aucun flux lié</p>
                                <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                                    <Plus className="w-4 h-4" />
                                    Ajouter un flux
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center justify-between">
                                <span>Données / Objets métier</span>
                                <Badge variant="secondary" className="text-xs">
                                    Auto
                                </Badge>
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-500">Aucune donnée liée</p>
                                <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                                    <Plus className="w-4 h-4" />
                                    Ajouter une donnée
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center justify-between">
                                <span>Règles métier</span>
                                <Badge variant="secondary" className="text-xs">
                                    Auto
                                </Badge>
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-500">Aucune règle liée</p>
                                <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                                    <Plus className="w-4 h-4" />
                                    Ajouter une règle
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-2">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center justify-between">
                                <span>Processus concernés</span>
                                <Badge variant="secondary" className="text-xs">
                                    Auto
                                </Badge>
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-500">Aucun processus lié</p>
                                <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                                    <Plus className="w-4 h-4" />
                                    Ajouter un processus
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-l-4 border-l-green-600">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center justify-between">
                            <span>Compiler pour le dictionnaire de données</span>
                            <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                                Exporter vers dictionnaire
                            </button>
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <p className="text-sm text-gray-600">
                            Les éléments listés ci-dessus (acteurs, flux, données, règles,
                            processus) peuvent être compilés automatiquement vers votre
                            dictionnaire de données.
                        </p>
                    </CardContent>
                </Card>

                <div className="flex gap-3">
                    <Link
                        to="/dashboard/phase4/backlog"
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        ← Retour au backlog
                    </Link>

                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Vérifier INVEST
                    </button>

                    <button className="ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                        <CheckCircle className="w-4 h-4 inline mr-2" />
                        Valider
                    </button>
                </div>
            </div>
        </div>
    );
}