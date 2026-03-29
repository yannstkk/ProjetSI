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
            { path: "/dashboard/phase4/form", label: "Formulaire" },
            { path: "/dashboard/phase4/backlog", label: "Backlog" },
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

/* ── Logo SVG de l'app ────────────────────────────────────────────────────── */
function AppLogo({ size = 36 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ flexShrink: 0 }}
        >
            {/* Fond dégradé */}
            <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
            </defs>
            <rect width="36" height="36" rx="10" fill="url(#logoGrad)" />

            {/* Carré de validation (checkmark stylisé) */}
            <rect x="7" y="9" width="14" height="14" rx="3" fill="white" fillOpacity="0.2" />
            <polyline
                points="9,16 12.5,19.5 19,12"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />

            {/* Lignes de données / analyse */}
            <line x1="7" y1="26" x2="15" y2="26" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.9" />
            <line x1="7" y1="29" x2="29" y2="29" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />

            {/* Indicateur de progression (arc partiel) */}
            <circle cx="25" cy="13" r="6" stroke="white" strokeWidth="2" strokeOpacity="0.3" fill="none" />
            <path
                d="M25 7 A6 6 0 0 1 31 13"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
            />
        </svg>
    );
}

export function Sidebar() {
    const location = useLocation();

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

            {/* ── Logo + nom de l'app ───────────────────────────────────────── */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <AppLogo size={36} />
                    <div>
                        <h1
                            className="font-bold text-gray-900 leading-tight tracking-tight"
                            style={{ fontSize: "15px", letterSpacing: "-0.02em" }}
                        >
                            Analyse Checker
                        </h1>
                        <p className="text-xs text-gray-400 font-medium" style={{ fontSize: "11px" }}>
                            Business Analysis Tool
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Navigation ───────────────────────────────────────────────── */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                <Link
                    to="/dashboard"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        location.pathname === "/dashboard"
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="text-sm">Cockpit global</span>
                </Link>

                <div className="pt-3 space-y-4">
                    {phases.map((phase) => {
                        const Icon = phase.icon;
                        const isPhaseActive =
                            currentPhase?.id === phase.id ||
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

                                    {/* Badge phase active */}
                                    {isPhaseActive && (
                                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    )}
                                </Link>

                                <div className="ml-6 mt-1 space-y-0.5">
                                    {phase.screens.map((screen) => (
                                        <Link
                                            key={screen.path}
                                            to={resolvePath(screen.path)}
                                            className={`block px-3 py-1.5 text-sm rounded transition-colors ${
                                                isActive(screen.path)
                                                    ? "bg-gray-100 text-gray-900 font-medium"
                                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
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

            {/* ── Footer version ───────────────────────────────────────────── */}
            <div className="px-4 py-2 border-t border-gray-100">
                <p className="text-xs text-gray-300 text-center">v1.0.0</p>
            </div>
        </aside>
    );
}