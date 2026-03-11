import { AlertTriangle, AlertCircle, Info, CheckCircle } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

export function AlertCard({
                              id = "alert-1",
                              type = "warning",
                              title = "",
                              message = "",
                              source = "",
                              timestamp = "",
                              onClick,
                          }) {
    const typeConfig = {
        error: {
            icon: AlertCircle,
            color: "bg-red-50 border-red-200",
            iconColor: "text-red-600",
            badgeColor: "bg-red-100 text-red-700",
        },
        warning: {
            icon: AlertTriangle,
            color: "bg-yellow-50 border-yellow-200",
            iconColor: "text-yellow-600",
            badgeColor: "bg-yellow-100 text-yellow-700",
        },
        info: {
            icon: Info,
            color: "bg-blue-50 border-blue-200",
            iconColor: "text-blue-600",
            badgeColor: "bg-blue-100 text-blue-700",
        },
        success: {
            icon: CheckCircle,
            color: "bg-green-50 border-green-200",
            iconColor: "text-green-600",
            badgeColor: "bg-green-100 text-green-700",
        },
    };

    const config = typeConfig[type];
    const Icon = config.icon;

    return (
        <Card
            className={`${config.color} border cursor-pointer hover:shadow-md transition-shadow`}
            onClick={onClick}
        >
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-medium text-gray-900">
                                {title || "Alerte"}
                            </h4>

                            <Badge className={config.badgeColor}>
                                {type === "error"
                                    ? "Erreur"
                                    : type === "warning"
                                        ? "Attention"
                                        : type === "info"
                                            ? "Info"
                                            : "Validé"}
                            </Badge>
                        </div>

                        {message && (
                            <p className="text-sm text-gray-700 mb-2">
                                {message}
                            </p>
                        )}

                        <div className="flex items-center gap-3 text-xs text-gray-600">
                            {source && <span>Source : {source}</span>}
                            {timestamp && <span>{timestamp}</span>}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}