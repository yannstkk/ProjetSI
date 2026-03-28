import { FileText, Link as LinkIcon, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

export function RequirementCard({
                                    id = "req-1",
                                    code = "",
                                    title = "",
                                    description = "",
                                    type = "functional",
                                    classification = "internal",
                                    source = "",
                                    priority = "medium",
                                    hasAlerts = false,
                                    onClick
                                }) {
    const priorityColors = {
        high: "bg-red-100 text-red-700",
        medium: "bg-yellow-100 text-yellow-700",
        low: "bg-green-100 text-green-700"
    };

    const typeColors = {
        functional: "bg-blue-100 text-blue-700",
        "non-functional": "bg-purple-100 text-purple-700"
    };

    const classificationColors = {
        internal: "bg-blue-100 text-blue-700",
        external: "bg-gray-100 text-gray-700"
    };

    return (
        <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={onClick}
        >
            <CardContent className="p-4">

                <div className="flex items-start justify-between mb-3">

                    <div className="flex items-center gap-2">

                        {code && (
                            <Badge variant="outline" className="font-mono text-xs">
                                {code}
                            </Badge>
                        )}

                        <Badge className={typeColors[type]}>
                            {type === "functional" ? "Fonctionnelle" : "Non-fonctionnelle"}
                        </Badge>

                        <Badge className={classificationColors[classification]}>
                            {classification === "internal" ? "Interne" : "Externe"}
                        </Badge>

                    </div>

                    <div className="flex items-center gap-2">

                        {hasAlerts && (
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        )}

                        <Badge className={priorityColors[priority]}>
                            {priority === "high"
                                ? "Haute"
                                : priority === "medium"
                                    ? "Moyenne"
                                    : "Basse"}
                        </Badge>

                    </div>

                </div>

                {title && (
                    <h3 className="font-medium text-gray-900 mb-2">
                        {title}
                    </h3>
                )}

                {description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {description}
                    </p>
                )}

                {source && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <LinkIcon className="w-4 h-4" />
                        <span>Source : {source}</span>
                    </div>
                )}

            </CardContent>
        </Card>
    );
}