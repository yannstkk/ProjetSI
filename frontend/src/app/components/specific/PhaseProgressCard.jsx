import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

export function PhaseProgressCard({
                                      phaseNumber,
                                      phaseName,
                                      icon: Icon,
                                      progress,
                                      status,
                                      itemsCount = 0,
                                      alertsCount = 0
                                  }) {
    const statusConfig = {
        "not-started": {
            label: "Non démarré",
            color: "bg-gray-100 text-gray-700"
        },
        "in-progress": {
            label: "En cours",
            color: "bg-blue-100 text-blue-700"
        },
        completed: {
            label: "Terminé",
            color: "bg-green-100 text-green-700"
        }
    };

    const config = statusConfig[status];

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">

                    <div className="flex items-center gap-3">

                        <div
                            className={`w-12 h-12 rounded-lg ${
                                progress === 100 ? "bg-green-100" : "bg-blue-100"
                            } flex items-center justify-center`}
                        >
                            <Icon
                                className={`w-6 h-6 ${
                                    progress === 100 ? "text-green-700" : "text-blue-700"
                                }`}
                            />
                        </div>

                        <div>
                            <div className="text-sm text-gray-600 font-medium">
                                Phase {phaseNumber}
                            </div>

                            <h3 className="font-semibold text-gray-900">
                                {phaseName}
                            </h3>
                        </div>

                    </div>

                    <Badge className={config.color}>
                        {config.label}
                    </Badge>

                </div>

                <div className="space-y-3">

                    {/* Progress bar */}
                    <div>

                        <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">Progression</span>
                            <span className="font-medium text-gray-900">
                {progress}%
              </span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all ${
                                    progress === 100 ? "bg-green-600" : "bg-blue-600"
                                }`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm">

            <span className="text-gray-600">
              {itemsCount} élément{itemsCount > 1 ? "s" : ""}
            </span>

                        {alertsCount > 0 && (
                            <span className="text-red-600">
                {alertsCount} alerte{alertsCount > 1 ? "s" : ""}
              </span>
                        )}

                    </div>

                </div>
            </CardContent>
        </Card>
    );
}