import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
    AlertTriangle,
    ArrowRight,
    MessageSquare,
    Users2,
    Users,
    FileText,
    ListChecks,
    Workflow,
    Database,
    CheckCircle2,
    Clock,
    Sparkles,
    TrendingUp,
    ChevronRight,
} from "lucide-react";
import { loadMCD } from "./phase7/helpers/mcdStorage";
import { getProjetCourant } from "../../services/projetCourant";
import { interviewExistsInDb } from "../../services/interviewService";
import { loadBacklog } from "./phase4/components/usStorage";
import { loadActeurs } from "./phase2/components/helpers/acteurIA";
import { loadMFC } from "./phase2/components/helpers/mfcStorage";
import { loadBpmn } from "./phase6/helpers/bpmnStorage";

function useCountUp(target, duration = 800, delay = 0) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        let start = null;
        let raf;
        const timeout = setTimeout(() => {
            const step = (ts) => {
                if (!start) start = ts;
                const progress = Math.min((ts - start) / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 3);
                setValue(Math.round(ease * target));
                if (progress < 1) raf = requestAnimationFrame(step);
            };
            raf = requestAnimationFrame(step);
        }, delay);
        return () => { clearTimeout(timeout); cancelAnimationFrame(raf); };
    }, [target, duration, delay]);
    return value;
}

function AnimatedBar({ value, color, delay = 0 }) {
    const [width, setWidth] = useState(0);
    useEffect(() => {
        const t = setTimeout(() => setWidth(value), 100 + delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return (
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
                className={`h-full rounded-full transition-all ${color}`}
                style={{ width: `${width}%`, transitionDuration: "900ms", transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
            />
        </div>
    );
}

function computePhaseProgress() {
    const backlog = loadBacklog();
    const acteurs = loadActeurs();
    const mfc = loadMFC();
    const bpmn = loadBpmn();
    const mcd = loadMCD();
    const hasInterview = interviewExistsInDb();

    return [
        {
            id: 1, name: "Interviewer le métier", icon: MessageSquare,
            path: "/dashboard/phase1/interviews",
            progress: hasInterview ? 100 : 0,
            items: hasInterview ? 1 : 0, unit: "interview",
            color: "bg-violet-500",
            accent: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200",
        },
        {
            id: 2, name: "Domaine & Acteurs", icon: Users2,
            path: "/dashboard/phase2/actors",
            progress: acteurs.length > 0 ? Math.min(acteurs.length * 20, 100) : 0,
            items: acteurs.length, unit: "acteur",
            color: "bg-blue-500",
            accent: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200",
        },
        {
            id: 3, name: "Élicitation", icon: Users,
            path: "/dashboard/phase3/classification",
            progress: hasInterview && acteurs.length > 0 ? 40 : 0,
            items: 0, unit: "élément",
            color: "bg-cyan-500",
            accent: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-200",
        },
        {
            id: 4, name: "User Stories", icon: FileText,
            path: "/dashboard/phase4/backlog",
            progress: backlog.length > 0 ? Math.min(backlog.length * 10, 100) : 0,
            items: backlog.length, unit: "US",
            color: "bg-emerald-500",
            accent: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200",
        },
        {
            id: 5, name: "Exigences", icon: ListChecks,
            path: "/dashboard/phase5/generate",
            progress: backlog.length > 0 ? 20 : 0,
            items: 0, unit: "exigence",
            color: "bg-amber-500",
            accent: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200",
        },
        {
            id: 6, name: "BPMN", icon: Workflow,
            path: "/dashboard/phase6/import",
            progress: bpmn?.selected ? 60 : 0,
            items: bpmn?.selected ? 1 : 0, unit: "diagramme",
            color: "bg-orange-500",
            accent: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200",
        },
        {
            id: 7, name: "Données / MCD", icon: Database,
            path: "/dashboard/phase7/import",
            progress: mcd?.code ? 60 : 0,
            items: mcd?.code ? 1 : 0, unit: "MCD",
            color: "bg-rose-500",
            accent: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200",
        },
    ];
}

function PhaseCard({ phase, index }) {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), index * 80);
        return () => clearTimeout(t);
    }, [index]);

    const Icon = phase.icon;
    const done = phase.progress === 100;

    return (
        <Link
            to={phase.path}
            className={`group block rounded-xl border p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${phase.border} ${phase.bg}`}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 400ms ease ${index * 80}ms, transform 400ms ease ${index * 80}ms, box-shadow 200ms, translate 200ms`,
            }}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${phase.bg} ring-1 ring-white shadow-sm`}>
                        <Icon className={`w-4 h-4 ${phase.accent}`} />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide" style={{ fontSize: "10px" }}>
                            Phase {phase.id}
                        </p>
                        <p className="text-sm font-semibold text-gray-800 leading-tight">
                            {phase.name}
                        </p>
                    </div>
                </div>

                {done ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                ) : phase.progress > 0 ? (
                    <Clock className={`w-4 h-4 flex-shrink-0 ${phase.accent}`} />
                ) : (
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
                )}
            </div>

            <AnimatedBar value={phase.progress} color={phase.color} delay={index * 80 + 200} />

            <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">
                    {phase.items > 0
                        ? `${phase.items} ${phase.unit}${phase.items > 1 ? "s" : ""}`
                        : "Non démarré"
                    }
                </span>
                <span className={`text-xs font-bold ${done ? "text-emerald-600" : phase.accent}`}>
                    {phase.progress}%
                </span>
            </div>
        </Link>
    );
}

export function Cockpit() {
    const projet = getProjetCourant();
    const phases = computePhaseProgress();

    const backlog = loadBacklog();
    const acteurs = loadActeurs();

    const globalProgress = Math.round(
        phases.reduce((acc, p) => acc + p.progress, 0) / phases.length
    );

    const phasesActives = phases.filter((p) => p.progress > 0 && p.progress < 100).length;
    const phasesTerminees = phases.filter((p) => p.progress === 100).length;

    const animUS = useCountUp(backlog.length, 700, 300);
    const animActeurs = useCountUp(acteurs.length, 700, 400);
    const animPhases = useCountUp(phasesTerminees, 600, 200);
    const animGlobal = useCountUp(globalProgress, 1000, 100);

    const [globalBarWidth, setGlobalBarWidth] = useState(0);
    useEffect(() => {
        const t = setTimeout(() => setGlobalBarWidth(globalProgress), 300);
        return () => clearTimeout(t);
    }, [globalProgress]);

    return (
        <div className="p-6 space-y-6 min-h-full bg-gray-50">

            <div
                className="rounded-2xl overflow-hidden relative"
                style={{
                    background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)",
                    minHeight: "160px",
                }}
            >
                {/* Motif décoratif */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div style={{
                        position: "absolute", right: "-40px", top: "-40px",
                        width: "240px", height: "240px", borderRadius: "50%",
                        background: "rgba(255,255,255,0.04)",
                    }} />
                    <div style={{
                        position: "absolute", right: "80px", bottom: "-60px",
                        width: "160px", height: "160px", borderRadius: "50%",
                        background: "rgba(255,255,255,0.03)",
                    }} />
                    <svg className="absolute right-0 top-0 opacity-10" width="300" height="160" viewBox="0 0 300 160" fill="none">
                        <circle cx="250" cy="30" r="80" stroke="white" strokeWidth="0.8" />
                        <circle cx="250" cy="30" r="55" stroke="white" strokeWidth="0.8" />
                        <circle cx="250" cy="30" r="30" stroke="white" strokeWidth="0.8" />
                    </svg>
                </div>

                <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-blue-200" />
                                <span className="text-blue-200 text-xs font-semibold uppercase tracking-widest">
                                    Cockpit Global
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold text-white leading-tight" style={{ letterSpacing: "-0.03em" }}>
                                {projet ? projet.nom : "Sélectionnez un projet"}
                            </h1>
                            <p className="text-blue-300 text-sm mt-1">
                                {phasesTerminees === 0
                                    ? "Démarrez l'analyse en Phase 1"
                                    : `${phasesTerminees} phase${phasesTerminees > 1 ? "s" : ""} complétée${phasesTerminees > 1 ? "s" : ""} · ${phasesActives} en cours`
                                }
                            </p>
                        </div>

                        <div className="flex flex-col items-center">
                            <CircularGauge value={animGlobal} size={80} />
                            <p className="text-blue-200 text-xs mt-1.5 font-medium">Progression</p>
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="flex justify-between text-xs text-blue-300 mb-1.5">
                            <span>Avancement global</span>
                            <span className="font-bold text-white">{globalProgress}%</span>
                        </div>
                        <div className="h-2 bg-blue-900/50 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-blue-300 to-white"
                                style={{
                                    width: `${globalBarWidth}%`,
                                    transition: "width 1200ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: "User Stories", value: animUS, icon: FileText, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
                    { label: "Acteurs identifiés", value: animActeurs, icon: Users2, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
                    { label: "Phases complétées", value: animPhases, icon: CheckCircle2, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
                    { label: "Phases en cours", value: phasesActives, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
                ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.label}
                            className={`rounded-xl border p-4 flex items-center gap-4 ${stat.bg} ${stat.border}`}
                            style={{
                                animation: `fadeSlideUp 400ms ease ${i * 80 + 100}ms both`,
                            }}
                        >
                            <div className={`w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm flex-shrink-0`}>
                                <Icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-xs text-gray-500 leading-tight">{stat.label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-gray-900" style={{ letterSpacing: "-0.02em" }}>
                        État des phases
                    </h2>
                    <span className="text-xs text-gray-400 font-medium">
                        {phasesTerminees} / {phases.length} complétées
                    </span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                    {phases.slice(0, 4).map((phase, i) => (
                        <PhaseCard key={phase.id} phase={phase} index={i} />
                    ))}
                </div>
                <div className="grid grid-cols-3 gap-3 mt-3">
                    {phases.slice(4).map((phase, i) => (
                        <PhaseCard key={phase.id} phase={phase} index={i + 4} />
                    ))}
                </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4">
                <h2 className="text-sm font-bold text-gray-700 mb-3">Actions rapides</h2>
                <div className="flex flex-wrap gap-2">
                    {[
                        { label: "Nouvel entretien", to: "/dashboard/phase1/interview/new", primary: true },
                        { label: "Voir le backlog", to: "/dashboard/phase4/backlog" },
                        { label: "Matrice traçabilité", to: "/dashboard/phase5/matrix" },
                        { label: "Contrôle cohérence", to: "/dashboard/phase4/control" },
                    ].map((action) => (
                        <Link
                            key={action.label}
                            to={action.to}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
                                action.primary
                                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            {action.label}
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

function CircularGauge({ value, size = 80 }) {
    const r = (size - 10) / 2;
    const circumference = 2 * Math.PI * r;
    const [dash, setDash] = useState(0);

    useEffect(() => {
        const t = setTimeout(() => {
            setDash((value / 100) * circumference);
        }, 400);
        return () => clearTimeout(t);
    }, [value, circumference]);

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
            <circle
                cx={size / 2} cy={size / 2} r={r}
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="5"
            />
            <circle
                cx={size / 2} cy={size / 2} r={r}
                fill="none"
                stroke="white"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - dash}
                style={{ transition: "stroke-dashoffset 1200ms cubic-bezier(0.34, 1.56, 0.64, 1)" }}
            />
            <text
                x={size / 2} y={size / 2 + 5}
                textAnchor="middle"
                fill="white"
                fontSize="14"
                fontWeight="700"
                style={{ transform: `rotate(90deg)`, transformOrigin: `${size / 2}px ${size / 2}px`, fontFamily: "system-ui" }}
            >
                {value}%
            </text>
        </svg>
    );
}