import { Link } from "react-router-dom";
import { Plus, FileText } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { useEffect } from "react";


    export default function InterviewsList() {
        useEffect(() => {
                sessionStorage.setItem("phase1_last", window.location.pathname);
            }, []);


    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto space-y-6">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Interviews métier
                        </h1>
                        <p className="text-gray-600">
                            Phase 1 : Gestion des entretiens
                        </p>
                    </div>

                    <Link
                        to="/dashboard/phase1/interview/new"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Nouvel entretien
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <Card className="col-span-2 border-2 border-dashed border-gray-300">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <FileText className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="font-medium text-gray-900 mb-1">
                                Aucun entretien
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Commencez par créer votre premier entretien métier
                            </p>
                            <Link
                                to="/dashboard/phase1/interview/new"
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                <Plus className="w-4 h-4" />
                                Nouvel entretien
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}