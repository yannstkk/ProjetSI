import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

export function AlerteActeursSansRole({ acteurs, onQualifier }) {
    return (
        <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Acteurs sans rôle défini ({acteurs.length})
                </CardTitle>
            </CardHeader>

            <CardContent>
                {acteurs.length === 0 ? (
                    <p className="text-sm text-gray-500">
                        Tous les acteurs ont un rôle défini ✓
                    </p>
                ) : (
                    <div className="space-y-2">
                        <p className="text-sm text-orange-700 mb-3">
                            Ces acteurs nécessitent une qualification avant de passer à la suite.
                        </p>
                        {acteurs.map((a) => (
                            <div
                                key={a.id}
                                className="flex items-center justify-between p-3 bg-orange-50 rounded border border-orange-200"
                            >
                                <div>
                                    <span className="font-medium text-gray-900 text-sm">
                                        {a.nom}
                                    </span>
                                    <span className="ml-2 text-xs text-orange-600">
                                        — rôle manquant
                                    </span>
                                </div>
                                <button
                                    onClick={() => onQualifier(a)}
                                    className="text-xs px-2 py-1 border border-orange-300 rounded hover:bg-orange-100 text-orange-700"
                                >
                                    Qualifier
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}