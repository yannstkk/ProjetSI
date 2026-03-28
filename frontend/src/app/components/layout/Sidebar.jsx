import { Link, useLocation } from "react-router";
import {
    Users,
    MessageSquare,
    Users2,
    FileText,
    ListChecks,
    Workflow,
    Database,
    LayoutDashboard,
} from "lucide-react";
import { interviewExistsInDb } from "../../../services/interviewService";

const phases = [
    {
        id: 1,
        name: "Interviewer le métier",
        icon: MessageSquare,
        screens: [
            { path: "/dashboard/phase1/interviews", label: "Interviews" },
        ],
    },
    {
        id: 2,
        name: "Domaine",
        icon: Users2,
        screens: [
            { path: "/dashboard/phase2/actors", label: "Acteurs" },
            { path: "/dashboard/phase2/flows", label: "Flux MFC" },
            { path: "/dashboard/phase2/coherence", label: "Cohérence" },
        ],
    },
    {
        id: 3,
        name: "Élicitation",
        icon: Users,
        screens: [
            { path: "/dashboard/phase3/classification", label: "Classification" },
        ],
    },
    {
        id: 4,
        name: "User Stories",
        icon: FileText,
        screens: [
            { path: "/dashboard/phase4/backlog", label: "Backlog" },
            { path: "/dashboard/phase4/form", label: "Formulaire" },
            { path: "/dashboard/phase4/control", label: "Cohérence" },
        ],
    },
    {
        id: 5,
        name: "Exigences",
        icon: ListChecks,
        screens: [
            { path: "/dashboard/phase5/generate", label: "Générer" },
            { path: "/dashboard/phase5/matrix", label: "Matrice" },
        ],
    },
    {
        id: 6,
        name: "BPMN",
        icon: Workflow,
        screens: [
            { path: "/dashboard/phase6/import", label: "Import" },
            { path: "/dashboard/phase6/viewer", label: "Viewer" },
            { path: "/dashboard/phase6/coverage", label: "Couverture" },
        ],
    },
    {
        id: 7,
        name: "Données / MCD",
        icon: Database,
        screens: [
            { path: "/dashboard/phase7/import", label: "Import" },
            { path: "/dashboard/phase7/viewer", label: "Viewer" },
            { path: "/dashboard/phase7/control", label: "Contrôle" },
        ],
    },
];

export function Sidebar() {
    const location = useLocation();

    // Décision intelligente pour le lien Interviews
    const interviewPath = interviewExistsInDb()
        ? "/dashboard/phase1/interview"
        : "/dashboard/phase1/interviews";

    const currentPhase = phases.find((phase) =>
        phase.screens.some((screen) =>
            location.pathname.startsWith(screen.path)
        )
    );

    function resolvePath(screenPath) {
        if (screenPath === "/dashboard/phase1/interviews") {
            return interviewPath;
        }
        return screenPath;
    }

    function isActive(screenPath) {
        if (screenPath === "/dashboard/phase1/interviews") {
            return location.pathname.startsWith("/dashboard/phase1/interview");
        }
        return location.pathname.startsWith(screenPath);
    }

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <h1 className="font-semibold text-lg">Analyse Checker</h1>
                <p className="text-sm text-gray-500">Business Analysis Tool</p>
            </div>

            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                <Link
                    to="/dashboard"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        location.pathname === "/dashboard"
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Cockpit global</span>
                </Link>

                <div className="pt-4 space-y-4">
                    {phases.map((phase) => {
                        const Icon = phase.icon;
                        const isPhaseActive = currentPhase?.id === phase.id ||
                            (phase.id === 1 && location.pathname.startsWith("/dashboard/phase1"));

                        return (
                            <div key={phase.id}>
                                <Link
                                    to={resolvePath(phase.screens[0].path)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                                        isPhaseActive
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="text-sm">Phase {phase.id}</span>
                                </Link>

                                <div className="ml-6 mt-1 space-y-0.5">
                                    {phase.screens.map((screen) => (
                                        <Link
                                            key={screen.path}
                                            to={resolvePath(screen.path)}
                                            className={`block px-3 py-1.5 text-sm rounded transition-colors ${
                                                isActive(screen.path)
                                                    ? "bg-gray-100 text-gray-900"
                                                    : "text-gray-600 hover:bg-gray-50"
                                            }`}
                                        >
                                            {screen.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </nav>
        </aside>
    );
}