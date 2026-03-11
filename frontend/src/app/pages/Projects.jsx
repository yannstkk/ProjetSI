import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export function Projects() {
    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4">

                <div className="max-w-7xl mx-auto flex items-center justify-between">

                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Analyse Checker
                        </h1>
                        <p className="text-sm text-gray-500">
                            Mes projets
                        </p>
                    </div>

                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                        Déconnexion
                    </button>

                </div>

            </header>

            {/* Main */}
            <main className="max-w-7xl mx-auto p-6">

                <div className="flex items-center justify-between mb-6">

                    <h2 className="text-xl font-semibold text-gray-900">
                        Mes projets
                    </h2>

                    <Link
                        to="/projects/new"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Nouveau projet
                    </Link>

                </div>

                {/* Grid projets */}
                <div className="grid grid-cols-3 gap-6">

                    <Link to="/projects/new">

                        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500 h-full">

                            <CardContent className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">

                                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                                    <Plus className="w-8 h-8 text-blue-600" />
                                </div>

                                <h3 className="font-medium text-gray-900 mb-1">
                                    Créer un nouveau projet
                                </h3>

                                <p className="text-sm text-gray-500">
                                    Démarrer une nouvelle analyse
                                </p>

                            </CardContent>

                        </Card>

                    </Link>

                </div>

            </main>

        </div>
    );
}