import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export function StatCard({
                             title,
                             value,
                             icon: Icon,
                             trend,
                             color = "blue"
                         }) {
    const colorClasses = {
        blue: "bg-blue-100 text-blue-700",
        green: "bg-green-100 text-green-700",
        red: "bg-red-100 text-red-700",
        yellow: "bg-yellow-100 text-yellow-700",
        gray: "bg-gray-100 text-gray-700"
    };

    return (
        <Card>
            <CardContent className="p-6">

                <div className="flex items-start justify-between">

                    <div className="flex-1">

                        <p className="text-sm text-gray-600 mb-1">
                            {title}
                        </p>

                        <p className="text-3xl font-semibold text-gray-900">
                            {value}
                        </p>

                        {trend && (
                            <div
                                className={`flex items-center gap-1 mt-2 text-sm ${
                                    trend.isPositive ? "text-green-600" : "text-red-600"
                                }`}
                            >

                                {trend.isPositive ? (
                                    <TrendingUp className="w-4 h-4" />
                                ) : (
                                    <TrendingDown className="w-4 h-4" />
                                )}

                                <span>
                  {Math.abs(trend.value)}%
                </span>

                            </div>
                        )}

                    </div>

                    {Icon && (
                        <div
                            className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center flex-shrink-0`}
                        >
                            <Icon className="w-6 h-6" />
                        </div>
                    )}

                </div>

            </CardContent>
        </Card>
    );
}