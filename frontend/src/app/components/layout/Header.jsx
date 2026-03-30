import { useLocation } from "react-router";
import { useEffect, useState, useRef } from "react";
import {
    MessageSquare, Users2, Users, FileText,
    ListChecks, Workflow, Database, LayoutDashboard,
} from "lucide-react";
import { getProjetCourant } from "../../../services/projetCourant";

const phases = [
    { id: 1, name: "Interviewer le métier", icon: MessageSquare, screens: ["/dashboard/phase1"], hue: "258,72%,62%" },
    { id: 2, name: "Domaine & Acteurs", icon: Users2, screens: ["/dashboard/phase2"], hue: "217,87%,60%" },
    { id: 3, name: "Élicitation", icon: Users, screens: ["/dashboard/phase3"], hue: "188,78%,41%" },
    { id: 4, name: "User Stories", icon: FileText, screens: ["/dashboard/phase4"], hue: "152,60%,40%" },
    { id: 5, name: "Exigences", icon: ListChecks, screens: ["/dashboard/phase5"], hue: "38,92%,52%" },
    { id: 6, name: "BPMN", icon: Workflow, screens: ["/dashboard/phase6"], hue: "24,90%,55%" },
    { id: 7, name: "Données & MCD", icon: Database, screens: ["/dashboard/phase7"], hue: "349,75%,55%" },
];

export function Header() {
    const location = useLocation();
    const projet = getProjetCourant();

    const isCockpit = location.pathname === "/dashboard";
    const currentPhase = phases.find((p) =>
        p.screens.some((s) => location.pathname.startsWith(s))
    );

    const [displayed, setDisplayed] = useState({ phase: currentPhase, isCockpit });
    const [visible, setVisible] = useState(true);
    const prevPath = useRef(location.pathname);

    useEffect(() => {
        if (location.pathname === prevPath.current) return;
        prevPath.current = location.pathname;
        setVisible(false);
        const t = setTimeout(() => {
            setDisplayed({ phase: currentPhase, isCockpit });
            setVisible(true);
        }, 120);
        return () => clearTimeout(t);
    }, [location.pathname]);

    useEffect(() => { setVisible(true); }, []);

    const dp = displayed.phase;
    const hue = dp?.hue ?? "217,87%,60%";
    const color = `hsl(${hue})`;

    return (
        <header style={{
            height: "60px",
            background: "var(--color-background-primary)",
            borderBottom: "0.5px solid var(--color-border-tertiary)",
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            position: "relative",
            overflow: "hidden",
        }}>

            <div style={{
                position: "absolute",
                inset: 0,
                background: dp
                    ? `radial-gradient(ellipse 360px 60px at -40px 50%, hsla(${hue},0.06) 0%, transparent 100%)`
                    : "none",
                transition: "background 600ms ease",
                pointerEvents: "none",
            }} />

            <div style={{
                position: "absolute",
                left: 0,
                top: "14px",
                bottom: "14px",
                width: "3px",
                borderRadius: "0 3px 3px 0",
                background: dp ? color : "transparent",
                boxShadow: dp ? `1px 0 10px hsla(${hue},0.45)` : "none",
                transition: "background 400ms ease, box-shadow 400ms ease",
            }} />

            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateX(0)" : "translateX(-10px)",
                transition: "opacity 280ms ease, transform 280ms ease",
            }}>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>

                    <div style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        background: dp ? `hsla(${hue},0.10)` : "var(--color-background-secondary)",
                        border: dp
                            ? `0.5px solid hsla(${hue},0.22)`
                            : "0.5px solid var(--color-border-tertiary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "background 400ms, border 400ms",
                    }}>
                        {dp
                            ? <dp.icon style={{ width: "15px", height: "15px", color }} />
                            : <LayoutDashboard style={{ width: "15px", height: "15px", color: "var(--color-text-secondary)" }} />
                        }
                    </div>

                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                            <span style={{
                                fontSize: "14px",
                                fontWeight: 500,
                                color: "var(--color-text-primary)",
                                letterSpacing: "-0.02em",
                                lineHeight: 1,
                            }}>
                                {projet?.nom ?? "Aucun projet"}
                            </span>

                            {dp && (
                                <span style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    padding: "2px 8px 2px 6px",
                                    borderRadius: "999px",
                                    fontSize: "11px",
                                    fontWeight: 500,
                                    lineHeight: 1,
                                    background: `hsla(${hue},0.09)`,
                                    color,
                                    border: `0.5px solid hsla(${hue},0.22)`,
                                    transition: "all 400ms",
                                }}>
                                    <span style={{
                                        width: "5px",
                                        height: "5px",
                                        borderRadius: "50%",
                                        background: color,
                                        flexShrink: 0,
                                        boxShadow: `0 0 4px hsla(${hue},0.5)`,
                                    }} />
                                    Phase {dp.id}
                                </span>
                            )}

                            {displayed.isCockpit && !dp && (
                                <span style={{
                                    padding: "2px 8px",
                                    borderRadius: "999px",
                                    fontSize: "11px",
                                    fontWeight: 500,
                                    lineHeight: 1,
                                    background: "var(--color-background-secondary)",
                                    color: "var(--color-text-secondary)",
                                    border: "0.5px solid var(--color-border-tertiary)",
                                }}>
                                    Vue globale
                                </span>
                            )}
                        </div>

                        <p style={{
                            fontSize: "12px",
                            color: "var(--color-text-secondary)",
                            margin: "3px 0 0",
                            lineHeight: 1,
                        }}>
                            {dp ? dp.name : "Cockpit global"}
                        </p>
                    </div>
                </div>

                <PhaseStepper currentId={dp?.id} />
            </div>

            <ProgressBar currentPhase={dp} />
        </header>
    );
}

function ProgressBar({ currentPhase }) {
    const [w, setW] = useState(0);

    useEffect(() => {
        const target = currentPhase ? Math.round((currentPhase.id / 7) * 100) : 0;
        setW(0);
        const t = setTimeout(() => setW(target), 60);
        return () => clearTimeout(t);
    }, [currentPhase?.id]);

    return (
        <div style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: "2px",
            background: "var(--color-border-tertiary)",
        }}>
            {currentPhase && (
                <div style={{
                    height: "100%",
                    width: `${w}%`,
                    background: `linear-gradient(90deg,
                        hsla(${currentPhase.hue},0.25) 0%,
                        hsl(${currentPhase.hue}) 100%)`,
                    borderRadius: "0 2px 2px 0",
                    transition: "width 700ms cubic-bezier(0.34,1.56,0.64,1)",
                }} />
            )}
        </div>
    );
}

function PhaseStepper({ currentId }) {
    return (
        <nav style={{ display: "flex", alignItems: "center", gap: "1px", flexShrink: 0 }}>
            {phases.map((phase, i) => {
                const done = currentId !== undefined && phase.id < currentId;
                const active = phase.id === currentId;
                const hue = phase.hue;

                return (
                    <div key={phase.id} style={{ display: "flex", alignItems: "center" }}>

                        <div
                            title={`Phase ${phase.id} — ${phase.name}`}
                            style={{
                                width: active ? "30px" : done ? "22px" : "16px",
                                height: active ? "30px" : done ? "22px" : "16px",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                cursor: "default",
                                transition: "all 380ms cubic-bezier(0.34,1.56,0.64,1)",
                                background: active
                                    ? `hsl(${hue})`
                                    : done
                                        ? `hsla(${hue},0.12)`
                                        : "var(--color-background-secondary)",
                                border: active
                                    ? `1.5px solid hsla(${hue},0.4)`
                                    : done
                                        ? `0.5px solid hsla(${hue},0.35)`
                                        : "0.5px solid var(--color-border-tertiary)",
                                boxShadow: active
                                    ? `0 0 0 4px hsla(${hue},0.12), 0 2px 8px hsla(${hue},0.35)`
                                    : "none",
                            }}
                        >
                            {active && (
                                <span style={{
                                    fontSize: "10px",
                                    fontWeight: 500,
                                    color: "white",
                                    lineHeight: 1,
                                }}>
                                    {phase.id}
                                </span>
                            )}
                            {done && (
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                    <polyline
                                        points="2,5 4,7 8,3"
                                        stroke={`hsl(${hue})`}
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            )}
                        </div>

                        {i < phases.length - 1 && (
                            <div style={{
                                width: "10px",
                                height: "1px",
                                margin: "0 1px",
                                background: done
                                    ? `hsla(${hue},0.3)`
                                    : "var(--color-border-tertiary)",
                                transition: "background 400ms",
                            }} />
                        )}
                    </div>
                );
            })}
        </nav>
    );
}