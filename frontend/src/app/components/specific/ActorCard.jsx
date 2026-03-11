import { User, Building, AlertCircle } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

export function ActorCard({
                              id = "actor-1",
                              name = "",
                              type = "internal",
                              description = "",
                              flowsCount = 0,
                              hasAlerts = false,
                              onClick
                          }) {

    const typeConfig = {
        internal: {
            icon: User,
            label: "Interne",
            color: "bg-blue-100 text-blue-700"
        },
        external: {
            icon: Building,
            label: "Externe",
            color: "bg-gray-100 text-gray-700"
        }
    };

    const config = typeConfig[type];
    const Icon = config.icon;

    return (
        <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={onClick}
        >
            <CardContent className="p-4">

                <div className="flex items-start justify-between mb-3">

                    <div className="flex items-center gap-2">

                        <div
                            className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center`}
                        >
                            <Icon className="w-5 h-5" />
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-900">
                                {name || "Acteur sans nom"}
                            </h3>

                            <Badge className={config.color}>
                                {config.label}
                            </Badge>
                        </div>

                    </div>

                    {hasAlerts && (
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                    )}

                </div>

                {description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {description}
                    </p>
                )}

                {flowsCount > 0 && (
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">{flowsCount}</span>{" "}
                        flux associé{flowsCount > 1 ? "s" : ""}
                    </div>
                )}

            </CardContent>
        </Card>
    );
}