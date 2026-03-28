import { Link } from "react-router";
import { Calendar, Users, Clock } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

export function InterviewCard({
                                  id = "interview-1",
                                  title = "",
                                  date = "",
                                  duration = "",
                                  participants = 0,
                                  status = "planned",
                                  onClick
                              }) {
    const statusColors = {
        planned: "bg-blue-100 text-blue-700",
        completed: "bg-green-100 text-green-700",
        "in-progress": "bg-yellow-100 text-yellow-700"
    };

    const statusLabels = {
        planned: "Planifié",
        completed: "Terminé",
        "in-progress": "En cours"
    };

    return (
        <Link to={`/dashboard/phase1/interview/${id}`}>
            <Card
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={onClick}
            >
                <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                        <h3 className="font-medium text-gray-900">
                            {title || "Entretien sans titre"}
                        </h3>

                        <Badge className={statusColors[status]}>
                            {statusLabels[status]}
                        </Badge>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                        {date && (
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{date}</span>
                            </div>
                        )}

                        {duration && (
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{duration}</span>
                            </div>
                        )}

                        {participants > 0 && (
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span>
                  {participants} participant{participants > 1 ? "s" : ""}
                </span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}