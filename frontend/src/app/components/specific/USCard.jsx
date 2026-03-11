import { Link } from "react-router";
import { CheckCircle, Edit, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

export function USCard({
                           id = "us-1",
                           code = "",
                           actor = "",
                           want = "",
                           goal = "",
                           priority = "medium",
                           status = "draft",
                           criteriaCount = 0,
                           hasAlerts = false,
                           onClick
                       }) {
    const priorityColors = {
        high: "bg-red-100 text-red-700",
        medium: "bg-yellow-100 text-yellow-700",
        low: "bg-green-100 text-green-700"
    };

    const priorityLabels = {
        high: "Haute",
        medium: "Moyenne",
        low: "Basse"
    };

    const statusColors = {
        draft: "bg-gray-100 text-gray-700",
        validated: "bg-green-100 text-green-700",
        "in-review": "bg-blue-100 text-blue-700"
    };

    const statusLabels = {
        draft: "Brouillon",
        validated: "Validée",
        "in-review": "En révision"
    };

    return (
        <Card
            className="hover:shadow-md transition-shadow cursor-pointer group"
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

                        <Badge className={statusColors[status]}>
                            {statusLabels[status]}
                        </Badge>

                    </div>

                    <div className="flex items-center gap-2">

                        {hasAlerts && (
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        )}

                        <Badge className={priorityColors[priority]}>
                            {priorityLabels[priority]}
                        </Badge>

                    </div>

                </div>

                <div className="space-y-2 text-sm">

                    {actor && (
                        <p className="text-gray-700">
                            <span className="font-medium">En tant que</span> {actor}
                        </p>
                    )}

                    {want && (
                        <p className="text-gray-700">
                            <span className="font-medium">Je veux</span> {want}
                        </p>
                    )}

                    {goal && (
                        <p className="text-gray-700">
                            <span className="font-medium">Afin de</span> {goal}
                        </p>
                    )}

                </div>

                {criteriaCount > 0 && (
                    <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">

                        <CheckCircle className="w-4 h-4 text-green-600" />

                        <span>
              {criteriaCount} critère{criteriaCount > 1 ? "s" : ""} d'acceptation
            </span>

                    </div>
                )}

                <div className="flex justify-end mt-3 opacity-0 group-hover:opacity-100 transition-opacity">

                    <Link
                        to={`/dashboard/phase4/form?id=${id}`}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                    >

                        <Edit className="w-4 h-4" />
                        Modifier

                    </Link>

                </div>

            </CardContent>
        </Card>
    );
}