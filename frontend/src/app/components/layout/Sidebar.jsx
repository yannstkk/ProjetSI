import { Link, useLocation } from "react-router";
import { useState, useEffect, useRef } from "react";
import {
    Users, MessageSquare, Users2, FileText,
    ListChecks, Workflow, Database, LayoutDashboard,
    ChevronRight,
} from "lucide-react";
import { interviewExistsInDb } from "../../../services/interviewService";
import logo from "../../../assets/logo.png";



/* ── Couleurs HSL par phase (cohérentes avec le Header) ─────────────────── */
const PHASE_COLORS = {
    1: { hue: "258,72%,62%", hex: "#7c6ef0" },
    2: { hue: "217,87%,60%", hex: "#4a90e2" },
    3: { hue: "188,78%,41%", hex: "#17a2b8" },
    4: { hue: "152,60%,40%", hex: "#2e9e6e" },
    5: { hue: "38,92%,52%", hex: "#f5a623" },
    6: { hue: "24,90%,55%", hex: "#f06a28" },
    7: { hue: "349,75%,55%", hex: "#e84057" },
};

const phases = [
    {
        id: 1, name: "Interviewer le métier", shortName: "Entretien",
        icon: MessageSquare,
        screens: [{ path: "/dashboard/phase1/interviews", label: "Interviews" }],
    },
    {
        id: 2, name: "Domaine", shortName: "Domaine",
        icon: Users2,
        screens: [
            { path: "/dashboard/phase2/actors", label: "Acteurs" },
            { path: "/dashboard/phase2/flows", label: "Flux MFC" },
            { path: "/dashboard/phase2/coherence", label: "Cohérence" },
        ],
    },
    {
        id: 3, name: "Élicitation", shortName: "Élicitation",
        icon: Users,
        screens: [{ path: "/dashboard/phase3/classification", label: "Classification" }],
    },
    {
        id: 4, name: "User Stories", shortName: "User Stories",
        icon: FileText,
        screens: [
            { path: "/dashboard/phase4/form", label: "Formulaire" },
            { path: "/dashboard/phase4/backlog", label: "Backlog" },
            { path: "/dashboard/phase4/control", label: "Cohérence" },
        ],
    },
    {
        id: 5, name: "Exigences", shortName: "Exigences",
        icon: ListChecks,
        screens: [
            { path: "/dashboard/phase5/generate", label: "Générer" },
            { path: "/dashboard/phase5/matrix", label: "Matrice" },
        ],
    },
    {
        id: 6, name: "BPMN", shortName: "BPMN",
        icon: Workflow,
        screens: [
            { path: "/dashboard/phase6/import", label: "Import" },
            { path: "/dashboard/phase6/viewer", label: "Viewer" },
            { path: "/dashboard/phase6/coverage", label: "Couverture" },
        ],
    },
    {
        id: 7, name: "Données / MCD", shortName: "Données",
        icon: Database,
        screens: [
            { path: "/dashboard/phase7/import", label: "Import" },
            { path: "/dashboard/phase7/viewer", label: "Viewer" },
            { path: "/dashboard/phase7/control", label: "Contrôle" },
        ],
    },
];



/* ── Item sous-nav avec animation de hauteur ─────────────────────────────── */
function SubNav({ screens, isOpen, resolvePath, isActive, phaseHue }) {
    const ref = useRef(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (ref.current) setHeight(isOpen ? ref.current.scrollHeight : 0);
    }, [isOpen]);

    return (
        <div style={{
            overflow: "hidden",
            height: `${height}px`,
            transition: "height 320ms cubic-bezier(0.4,0,0.2,1)",
        }}>
            <div ref={ref} style={{ paddingTop: "2px", paddingBottom: "4px" }}>
                {screens.map((screen, idx) => {
                    const active = isActive(screen.path);
                    return (
                        <Link
                            key={screen.path}
                            to={resolvePath(screen.path)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "6px 10px 6px 36px",
                                borderRadius: "8px",
                                fontSize: "12.5px",
                                fontWeight: active ? 500 : 400,
                                color: active
                                    ? `hsl(${phaseHue})`
                                    : "var(--color-text-secondary)",
                                background: active
                                    ? `hsla(${phaseHue},0.08)`
                                    : "transparent",
                                textDecoration: "none",
                                transition: "all 200ms ease",
                                position: "relative",
                                animationDelay: `${idx * 40}ms`,
                            }}
                            onMouseEnter={e => {
                                if (!active) {
                                    e.currentTarget.style.background = "var(--color-background-secondary)";
                                    e.currentTarget.style.color = "var(--color-text-primary)";
                                }
                            }}
                            onMouseLeave={e => {
                                if (!active) {
                                    e.currentTarget.style.background = "transparent";
                                    e.currentTarget.style.color = "var(--color-text-secondary)";
                                }
                            }}
                        >
                            {/* Tiret remplacé par un petit rond */}
                            <span style={{
                                width: "5px",
                                height: "5px",
                                borderRadius: "50%",
                                flexShrink: 0,
                                background: active ? `hsl(${phaseHue})` : "var(--color-border-secondary)",
                                transition: "background 200ms",
                            }} />
                            {screen.label}

                            {/* Pill "actif" */}
                            {active && (
                                <span style={{
                                    marginLeft: "auto",
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    background: `hsl(${phaseHue})`,
                                    boxShadow: `0 0 6px hsla(${phaseHue},0.6)`,
                                }} />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

/* ── Ligne de jauge de progression en bas de la sidebar ─────────────────── */
function SidebarProgressBar({ currentPhaseId }) {
    const [w, setW] = useState(0);
    const hue = currentPhaseId ? PHASE_COLORS[currentPhaseId].hue : "217,87%,60%";

    useEffect(() => {
        const t = setTimeout(() => {
            setW(currentPhaseId ? Math.round((currentPhaseId / 7) * 100) : 0);
        }, 200);
        return () => clearTimeout(t);
    }, [currentPhaseId]);

    return (
        <div style={{
            padding: "8px 12px",
            borderTop: "0.5px solid var(--color-border-tertiary)",
        }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "5px",
            }}>
                <span style={{ fontSize: "10px", color: "var(--color-text-secondary)", fontWeight: 500 }}>
                    Progression
                </span>
                <span style={{
                    fontSize: "10px",
                    fontWeight: 500,
                    color: currentPhaseId ? `hsl(${hue})` : "var(--color-text-secondary)",
                }}>
                    {w}%
                </span>
            </div>
            <div style={{
                height: "3px",
                borderRadius: "99px",
                background: "var(--color-border-tertiary)",
                overflow: "hidden",
            }}>
                <div style={{
                    height: "100%",
                    width: `${w}%`,
                    borderRadius: "99px",
                    background: currentPhaseId
                        ? `linear-gradient(90deg, hsla(${hue},0.5), hsl(${hue}))`
                        : "var(--color-border-secondary)",
                    transition: "width 800ms cubic-bezier(0.34,1.56,0.64,1), background 600ms ease",
                }} />
            </div>
            <p style={{
                fontSize: "10px",
                color: "var(--color-text-secondary)",
                textAlign: "center",
                marginTop: "6px",
                opacity: 0.5,
            }}>
                v1.0.0
            </p>
        </div>
    );
}

/* ── Composant principal ─────────────────────────────────────────────────── */
export function Sidebar() {
    const location = useLocation();

    const interviewPath = interviewExistsInDb()
        ? "/dashboard/phase1/interview"
        : "/dashboard/phase1/interviews";

    const currentPhase = phases.find((phase) =>
        phase.screens.some((screen) =>
            location.pathname.startsWith(screen.path)
        )
    ) ?? (location.pathname.startsWith("/dashboard/phase1/interview") ? phases[0] : null);

    /* Phases ouvertes : la phase active s'ouvre automatiquement */
    const [openPhases, setOpenPhases] = useState(() => {
        const set = new Set();
        if (currentPhase) set.add(currentPhase.id);
        return set;
    });

    useEffect(() => {
        if (currentPhase) {
            setOpenPhases(prev => new Set([...prev, currentPhase.id]));
        }
    }, [currentPhase?.id]);

    function togglePhase(id) {
        setOpenPhases(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }

    function resolvePath(screenPath) {
        if (screenPath === "/dashboard/phase1/interviews") return interviewPath;
        return screenPath;
    }

    function isActive(screenPath) {
        if (screenPath === "/dashboard/phase1/interviews")
            return location.pathname.startsWith("/dashboard/phase1/interview");
        return location.pathname.startsWith(screenPath);
    }

    const isCockpit = location.pathname === "/dashboard";

    return (
        <aside style={{
            width: "240px",
            minWidth: "240px",
            display: "flex",
            flexDirection: "column",
            background: "var(--color-background-primary)",
            borderRight: "0.5px solid var(--color-border-tertiary)",
            height: "100%",
        }}>

            {/* ── Logo ──────────────────────────────────────────────────────── */}
            <div style={{
                padding: "14px 16px",
                borderBottom: "0.5px solid var(--color-border-tertiary)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexShrink: 0,
            }}>
                <img
                    src={logo}
                    alt="Analyse Checker"
                    style={{
                        height: "32px",
                        width: "auto",
                        flexShrink: 0,
                        filter: "brightness(1.05) drop-shadow(0 2px 8px rgba(99,102,241,0.4))",
                    }}
                />
                <div>
                    <p style={{
                        fontSize: "13.5px",
                        fontWeight: 500,
                        color: "var(--color-text-primary)",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.2,
                        margin: 0,
                    }}>
                        Analyse Checker
                    </p>
                    <p style={{
                        fontSize: "10.5px",
                        color: "var(--color-text-secondary)",
                        margin: 0,
                        lineHeight: 1,
                        marginTop: "2px",
                    }}>
                        Business Analysis Tool
                    </p>
                </div>
            </div>

            {/* ── Navigation ────────────────────────────────────────────────── */}
            <nav style={{
                flex: 1,
                overflowY: "auto",
                padding: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
            }}>

                {/* Cockpit */}
                <Link
                    to="/dashboard"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "9px",
                        padding: "8px 10px",
                        borderRadius: "9px",
                        fontSize: "13px",
                        fontWeight: isCockpit ? 500 : 400,
                        color: isCockpit ? "hsl(217,87%,55%)" : "var(--color-text-secondary)",
                        background: isCockpit ? "hsla(217,87%,60%,0.08)" : "transparent",
                        textDecoration: "none",
                        transition: "all 200ms ease",
                        marginBottom: "4px",
                    }}
                    onMouseEnter={e => {
                        if (!isCockpit) {
                            e.currentTarget.style.background = "var(--color-background-secondary)";
                            e.currentTarget.style.color = "var(--color-text-primary)";
                        }
                    }}
                    onMouseLeave={e => {
                        if (!isCockpit) {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "var(--color-text-secondary)";
                        }
                    }}
                >
                    <div style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "7px",
                        background: isCockpit ? "hsla(217,87%,60%,0.12)" : "var(--color-background-secondary)",
                        border: isCockpit ? "0.5px solid hsla(217,87%,60%,0.25)" : "0.5px solid var(--color-border-tertiary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "all 200ms",
                    }}>
                        <LayoutDashboard style={{
                            width: "13px", height: "13px",
                            color: isCockpit ? "hsl(217,87%,55%)" : "var(--color-text-secondary)",
                        }} />
                    </div>
                    Cockpit global
                    {isCockpit && (
                        <span style={{
                            marginLeft: "auto",
                            width: "6px", height: "6px",
                            borderRadius: "50%",
                            background: "hsl(217,87%,60%)",
                            boxShadow: "0 0 6px hsla(217,87%,60%,0.5)",
                        }} />
                    )}
                </Link>

                {/* Séparateur */}
                <div style={{
                    height: "0.5px",
                    background: "var(--color-border-tertiary)",
                    margin: "4px 2px 6px",
                }} />

                {/* Phases */}
                {phases.map((phase, idx) => {
                    const Icon = phase.icon;
                    const colors = PHASE_COLORS[phase.id];
                    const hue = colors.hue;
                    const isOpen = openPhases.has(phase.id);
                    const isPhaseActive =
                        currentPhase?.id === phase.id ||
                        (phase.id === 1 && location.pathname.startsWith("/dashboard/phase1/interview"));
                    const hasActiveChild = phase.screens.some(s => isActive(s.path));

                    return (
                        <div key={phase.id} style={{ marginBottom: "1px" }}>

                            {/* Bouton de phase */}
                            <button
                                onClick={() => togglePhase(phase.id)}
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "9px",
                                    padding: "7px 10px",
                                    borderRadius: "9px",
                                    border: "none",
                                    cursor: "pointer",
                                    textAlign: "left",
                                    background: isPhaseActive
                                        ? `hsla(${hue},0.08)`
                                        : "transparent",
                                    transition: "all 200ms ease",
                                    position: "relative",
                                }}
                                onMouseEnter={e => {
                                    if (!isPhaseActive) {
                                        e.currentTarget.style.background = "var(--color-background-secondary)";
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!isPhaseActive) {
                                        e.currentTarget.style.background = "transparent";
                                    }
                                }}
                            >
                                {/* Icône colorée */}
                                <div style={{
                                    width: "28px",
                                    height: "28px",
                                    borderRadius: "7px",
                                    flexShrink: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: isPhaseActive
                                        ? `hsla(${hue},0.15)`
                                        : "var(--color-background-secondary)",
                                    border: isPhaseActive
                                        ? `0.5px solid hsla(${hue},0.3)`
                                        : "0.5px solid var(--color-border-tertiary)",
                                    transition: "all 250ms ease",
                                }}>
                                    <Icon style={{
                                        width: "13px",
                                        height: "13px",
                                        color: isPhaseActive ? `hsl(${hue})` : "var(--color-text-secondary)",
                                        transition: "color 250ms",
                                    }} />
                                </div>

                                {/* Textes */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontSize: "10px",
                                        fontWeight: 500,
                                        color: isPhaseActive ? `hsl(${hue})` : "var(--color-text-secondary)",
                                        lineHeight: 1,
                                        marginBottom: "1px",
                                        opacity: isPhaseActive ? 0.7 : 0.5,
                                        letterSpacing: "0.04em",
                                        textTransform: "uppercase",
                                    }}>
                                        Phase {phase.id}
                                    </div>
                                    <div style={{
                                        fontSize: "12.5px",
                                        fontWeight: isPhaseActive ? 500 : 400,
                                        color: isPhaseActive
                                            ? `hsl(${hue})`
                                            : "var(--color-text-primary)",
                                        lineHeight: 1.2,
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        transition: "color 250ms",
                                    }}>
                                        {phase.name}
                                    </div>
                                </div>

                                {/* Flèche rotation */}
                                <ChevronRight style={{
                                    width: "13px",
                                    height: "13px",
                                    flexShrink: 0,
                                    color: isPhaseActive ? `hsl(${hue})` : "var(--color-text-secondary)",
                                    opacity: 0.6,
                                    transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                                    transition: "transform 280ms cubic-bezier(0.4,0,0.2,1), color 250ms",
                                }} />
                            </button>

                            {/* Sous-nav animée */}
                            <SubNav
                                screens={phase.screens}
                                isOpen={isOpen}
                                resolvePath={resolvePath}
                                isActive={isActive}
                                phaseHue={hue}
                            />
                        </div>
                    );
                })}
            </nav>

            <SidebarProgressBar currentPhaseId={currentPhase?.id ?? null} />
        </aside>
    );
}