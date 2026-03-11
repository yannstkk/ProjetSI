import { useLocation } from "react-router";
import {
    MessageSquare,
    Users2,
    Users,
    FileText,
    ListChecks,
    Workflow,
    Database,
    FileDown,
    AlertCircle
} from "lucide-react";

import { Badge } from "../ui/badge";

const phases = [
    { id: 1, name: "Interviewer le métier", icon: MessageSquare, screens: ["/dashboard/phase1"] },
    { id: 2, name: "Domaine", icon: Users2, screens: ["/dashboard/phase2"] },
    { id: 3, name: "Élicitation", icon: Users, screens: ["/dashboard/phase3"] },
    { id: 4, name: "User Stories", icon: FileText, screens: ["/dashboard/phase4"] },
    { id: 5, name: "Exigences", icon: ListChecks, screens: ["/dashboard/phase5"] },
    { id: 6, name: "BPMN", icon: Workflow, screens: ["/dashboard/phase6"] },
    { id: 7, name: "Données / MCD", icon: Database, screens: ["/dashboard/phase7"] }
];

export function Header() {

    const location = useLocation();

    const currentPhase = phases.find(phase =>
        phase.screens.some(screen =>
            location.pathname.startsWith(screen)
        )
    );

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="font-semibold text-xl text-gray-900">
                        Projet X
                    </h2>

                    <p className="text-sm text-gray-500">
                        {currentPhase
                            ? `Phase ${currentPhase.id} — ${currentPhase.name}`
                            : "Cockpit global"}
                    </p>

                </div>

                <div className="flex items-center gap-3">

                    <Badge variant="destructive" className="gap-1">

                        <AlertCircle className="w-3 h-3" />
                        3 alertes

                    </Badge>

                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">

                        <FileDown className="w-4 h-4" />
                        Exporter

                    </button>

                </div>

            </div>

        </header>
    );
}