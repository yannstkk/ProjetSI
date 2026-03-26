import { CheckCircle, User, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

export function CarteCoherence({ acteurs }) {
    return (
        <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Acteurs cohérents ({acteurs.length})
                </CardTitle>
            </CardHeader>

            <CardContent>
                {acteurs.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                        Aucun acteur cohérent détecté
                    </p>
                ) : (
                    <div className="space-y-2">
                        {acteurs.map((a) => (
                            <div
                                key={a.id}
                                className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100"
                            >
                                <div className="flex items-center gap-2">
                                    {a.type === "internal" ? (
                                        <User className="w-4 h-4 text-blue-500" />
                                    ) : (
                                        <Building className="w-4 h-4 text-gray-500" />
                                    )}
                                    <span className="text-sm font-medium text-gray-900">
                                        {a.nom}
                                    </span>
                                    {a.role && (
                                        <span className="text-xs text-gray-500">
                                            — {a.role}
                                        </span>
                                    )}
                                </div>
                                <Badge className={
                                    a.type === "internal"
                                        ? "bg-blue-100 text-blue-700 border-0"
                                        : "bg-gray-100 text-gray-700 border-0"
                                }>
                                    {a.type === "internal" ? "Interne" : "Externe"}
                                </Badge>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}