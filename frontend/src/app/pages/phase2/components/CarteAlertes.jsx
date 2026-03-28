import { AlertTriangle, Ghost, UserX, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

const typeConfig = {
    orphelin: {
        label: "Orphelin",
        description: "Déclaré en Phase 2A mais absent des flux MFC",
        badgeClass: "bg-orange-100 text-orange-700 border-0",
        icon: UserX,
        iconClass: "text-orange-500",
        rowClass: "bg-orange-50 border-orange-100",
    },
    fantome: {
        label: "Fantôme",
        description: "Présent dans les flux MFC mais non déclaré en Phase 2A",
        badgeClass: "bg-red-100 text-red-700 border-0",
        icon: Ghost,
        iconClass: "text-red-500",
        rowClass: "bg-red-50 border-red-100",
    },
    sansRole: {
        label: "Sans rôle",
        description: "Acteur déclaré mais sans rôle défini",
        badgeClass: "bg-yellow-100 text-yellow-700 border-0",
        icon: ShieldAlert,
        iconClass: "text-yellow-500",
        rowClass: "bg-yellow-50 border-yellow-100",
    },
};

export function CarteAlertes({ alertes }) {
    return (
        <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Alertes détectées ({alertes.length})
                </CardTitle>
            </CardHeader>

            <CardContent>
                {alertes.length === 0 ? (
                    <div className="text-center py-6">
                        <p className="text-sm font-medium text-green-700">
                            ✓ Aucune incohérence détectée
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Tous les acteurs sont cohérents
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {alertes.map((alerte, index) => {
                            const config = typeConfig[alerte.type];
                            const Icon = config.icon;
                            return (
                                <div
                                    key={index}
                                    className={`flex items-start gap-3 p-3 rounded-lg border ${config.rowClass}`}
                                >
                                    <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${config.iconClass}`} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-sm font-medium text-gray-900">
                                                {alerte.nom}
                                            </span>
                                            <Badge className={config.badgeClass}>
                                                {config.label}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            {config.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}