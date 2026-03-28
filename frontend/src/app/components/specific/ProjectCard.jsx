import { Link } from "react-router";
import { Calendar, FileText, AlertCircle } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

export function ProjectCard({
                                id = "project-1",
                                name = "Projet",
                                description = "",
                                date = "",
                                progress = 0,
                                alerts = 0,
                                status = "in-progress"
                            }) {
    const statusColors = {
        "in-progress": "bg-blue-100 text-blue-700",
        completed: "bg-green-100 text-green-700",
        pending: "bg-gray-100 text-gray-700"
    };

    const statusLabels = {
        "in-progress": "En cours",
        completed: "Terminé",
        pending: "En attente"
    };

    return (
        <Link to="/dashboard">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-5">

                    <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg text-gray-900">
                            {name}
                        </h3>

                        <Badge className={statusColors[status]}>
                            {statusLabels[status]}
                        </Badge>
                    </div>

                    {description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {description}
                        </p>
                    )}

                    <div className="space-y-2">

                        {date && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>{date}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FileText className="w-4 h-4" />
                            <span>Progression : {progress}%</span>
                        </div>

                        {alerts > 0 && (
                            <div className="flex items-center gap-2 text-sm text-red-600">
                                <AlertCircle className="w-4 h-4" />
                                <span>
                  {alerts} alerte{alerts > 1 ? "s" : ""}
                </span>
                            </div>
                        )}

                    </div>

                    {progress > 0 && (
                        <div className="mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">

                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                    style={{ width: `${progress}%` }}
                                />

                            </div>
                        </div>
                    )}

                </CardContent>
            </Card>
        </Link>
    );
}