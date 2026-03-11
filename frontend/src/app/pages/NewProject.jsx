import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

export function NewProject() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Créer un nouveau projet</h1>
                    <p className="text-sm text-gray-500">Définissez les informations de base</p>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Informations du projet</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nom du projet <span className="text-red-600">*</span>
                            </label>
                            <Input placeholder="" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description du projet
                            </label>
                            <Textarea
                                rows={4}
                                placeholder=""
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Client / Organisation
                                </label>
                                <Input placeholder="" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date de début
                                </label>
                                <Input type="date" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                    <Link
                        to="/projects"
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Annuler
                    </Link>
                    <Link
                        to="/dashboard"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium ml-auto"
                    >
                        Créer le projet
                    </Link>
                </div>
            </main>
        </div>
    );
}