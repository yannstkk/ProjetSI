import { Users, ArrowRight, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";

export function StatsBarre({ nbActeurs, nbFlux, nbAlertes, nbCoherents }) {
    const stats = [
        {
            label: "Acteurs déclarés",
            value: nbActeurs,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            label: "Flux MFC",
            value: nbFlux,
            icon: ArrowRight,
            color: "text-purple-600",
            bg: "bg-purple-50",
        },
        {
            label: "Acteurs cohérents",
            value: nbCoherents,
            icon: CheckCircle,
            color: "text-green-600",
            bg: "bg-green-50",
        },
        {
            label: "Alertes détectées",
            value: nbAlertes,
            icon: AlertTriangle,
            color: nbAlertes > 0 ? "text-orange-600" : "text-gray-400",
            bg: nbAlertes > 0 ? "bg-orange-50" : "bg-gray-50",
        },
    ];

    return (
        <div className="grid grid-cols-4 gap-4">
            {stats.map((s) => {
                const Icon = s.icon;
                return (
                    <Card key={s.label}>
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">{s.label}</p>
                                    <p className="text-3xl font-semibold text-gray-900">
                                        {s.value}
                                    </p>
                                </div>
                                <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center`}>
                                    <Icon className={`w-5 h-5 ${s.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}