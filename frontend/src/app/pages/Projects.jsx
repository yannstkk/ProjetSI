import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Calendar, Loader2, LogOut, Search, FolderOpen, ArrowRight, Clock } from "lucide-react";
import logo from "../../assets/logo.png";

import { authFetch } from "../../services/authFetch";
import { setProjetCourant } from "../../services/projetCourant";
import {
    getInterviewByProjet, loadInterviewIntoSession, clearInterviewSession,
} from "../../services/interviewService";
import {
    loadNotesIntoSession, loadParticipantsIntoSession,
    loadNotesStructureesIntoSession, loadQuestionsIntoSession,
} from "../../services/notesService";
import { loadUSFromDb } from "../../services/usService";
import { saveBacklog } from "./phase4/components/usStorage";
import { saveMFC, clearMFC } from "./phase2/components/helpers/mfcStorage";
import { saveBpmn, clearBpmn } from "./phase6/helpers/bpmnStorage";
import { buildPlantUMLUrl } from "./phase2/components/helpers/plantuml";

/* ─── helpers chargement BDD (identiques à l'original) ─────────────────────── */
async function loadActeursIntoSession(idProjet) {
    const res = await authFetch(`/api/acteur/projet/${idProjet}`);
    if (!res.ok) return;
    const acteursDb = await res.json();
    if (!acteursDb.length) return;
    sessionStorage.setItem("phase2_acteurs", JSON.stringify(
        acteursDb.map(a => ({
            id: a.idActeur, nom: a.nom || "", role: a.role || "",
            type: a.type || "internal", source: a.source || "bdd", phraseSource: "",
        }))
    ));
}
async function loadMFCIntoSession(idProjet) {
    const res = await authFetch(`/api/modelisation/mfc/projet/${idProjet}`);
    if (!res.ok) return;
    const liste = await res.json();
    if (!liste.length) return;
    const mfc = liste[liste.length - 1];
    const code = mfc.contenuPlantuml || "";
    saveMFC({
        code, diagramUrl: code ? buildPlantUMLUrl(code) : "",
        fileName: mfc.nom || "MFC importé depuis BDD",
        flux: (mfc.flux || []).map(f => ({ nom:f.nom||"", emetteur:f.emetteur||"", recepteur:f.recepteur||"", description:f.description||"", data:f.data||"" })),
        acteurs: (mfc.acteurs || []).map(a => ({ nom: a.nom || "" })),
        mfcDbId: mfc.id || null,
    });
}
async function loadBpmnIntoSession(idProjet) {
    const res = await authFetch(`/api/bpmn/projet/${idProjet}`);
    if (!res.ok) return;
    const liste = await res.json();
    if (!liste.length) return;
    const bpmn = liste[liste.length - 1];
    const fichier = { id: bpmn.idBpmn, nom: bpmn.titre + ".bpmn", contenu: bpmn.contenu || "", dbId: bpmn.idBpmn };
    saveBpmn({ fichiers: [fichier], selected: fichier, titre: bpmn.titre || "", liens: [], iaResult: null });
}

/* ─── Utilitaire date ───────────────────────────────────────────────────────── */
function formatDate(raw) {
    if (!raw) return "";
    return new Date(raw).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}
function timeAgo(raw) {
    if (!raw) return "";
    const diff = Date.now() - new Date(raw).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "aujourd'hui";
    if (days === 1) return "hier";
    if (days < 7)  return `il y a ${days} jours`;
    return formatDate(raw);
}

/* ─── Composant carte projet ────────────────────────────────────────────────── */
function ProjectCard({ projet, index, onSelect, selecting }) {
    const [hovered, setHovered] = useState(false);
    const isSelecting = selecting === projet.idProjet;

    /* couleur d'accent déterministe par projet */
    const accents = [
        ["#6366f1","#8b5cf6"], ["#0ea5e9","#6366f1"], ["#10b981","#0ea5e9"],
        ["#f59e0b","#ef4444"], ["#ec4899","#8b5cf6"], ["#14b8a6","#6366f1"],
    ];
    const [c1, c2] = accents[projet.idProjet % accents.length];

    return (
        <div
            onClick={() => !selecting && onSelect(projet)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: "#ffffff",
                border: hovered ? `1px solid ${c1}40` : "1px solid #e2e8f0",
                borderRadius: "16px",
                padding: "24px",
                cursor: selecting ? "wait" : "pointer",
                opacity: selecting && !isSelecting ? 0.5 : 1,
                position: "relative",
                overflow: "hidden",
                transition: "all 280ms cubic-bezier(0.4,0,0.2,1)",
                transform: hovered && !selecting ? "translateY(-4px)" : "translateY(0)",
                boxShadow: hovered && !selecting
                    ? `0 12px 40px rgba(0,0,0,0.1), 0 4px 12px ${c1}18`
                    : "0 1px 4px rgba(0,0,0,0.05)",
                animation: `cardIn 420ms cubic-bezier(0.34,1.56,0.64,1) ${index * 60}ms both`,
            }}
        >
            {/* Bande colorée en haut */}
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "3px",
                background: `linear-gradient(90deg, ${c1}, ${c2})`,
                opacity: hovered ? 1 : 0.5,
                transition: "opacity 250ms",
                borderRadius: "16px 16px 0 0",
            }}/>

            {/* Halo d'ambiance */}
            <div style={{
                position: "absolute", top: "-30px", right: "-30px",
                width: "100px", height: "100px", borderRadius: "50%",
                background: `radial-gradient(circle, ${c1}12 0%, transparent 70%)`,
                transition: "opacity 300ms",
                opacity: hovered ? 1 : 0,
                pointerEvents: "none",
            }}/>

            {/* Icône */}
            <div style={{
                width: "42px", height: "42px", borderRadius: "12px",
                background: `linear-gradient(135deg, ${c1}18, ${c2}12)`,
                border: `1px solid ${c1}25`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "14px",
                transition: "all 250ms",
                transform: hovered ? "scale(1.08)" : "scale(1)",
            }}>
                <FolderOpen style={{ width: "18px", height: "18px", color: c1 }}/>
            </div>

            {/* Nom */}
            <h3 style={{
                fontSize: "15px", fontWeight: 600, color: "#0f172a",
                letterSpacing: "-0.025em", marginBottom: "6px", lineHeight: 1.3,
            }}>
                {projet.nom}
            </h3>

            {/* Date */}
            <div style={{
                display: "flex", alignItems: "center", gap: "5px",
                fontSize: "12px", color: "#94a3b8", marginBottom: "16px",
            }}>
                <Clock style={{ width: "11px", height: "11px" }}/>
                {timeAgo(projet.dateCreation)}
            </div>

            {/* Footer */}
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                paddingTop: "12px",
                borderTop: "1px solid #f1f5f9",
            }}>
                <span style={{
                    fontSize: "10px", color: "#cbd5e1",
                    fontVariantNumeric: "tabular-nums", letterSpacing: "0.04em",
                }}>
                    #{projet.idProjet}
                </span>

                <div style={{
                    display: "flex", alignItems: "center", gap: "5px",
                    fontSize: "12px", fontWeight: 500,
                    color: hovered ? c1 : "#94a3b8",
                    transition: "all 200ms",
                }}>
                    {isSelecting ? (
                        <>
                            <Loader2 style={{ width: "13px", height: "13px", animation: "spin 0.8s linear infinite" }}/>
                            Ouverture…
                        </>
                    ) : (
                        <>
                            Ouvrir
                            <ArrowRight style={{
                                width: "13px", height: "13px",
                                transform: hovered ? "translateX(3px)" : "translateX(0)",
                                transition: "transform 200ms",
                            }}/>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ─── Carte "Nouveau projet" ────────────────────────────────────────────────── */
function NewProjectCard({ index }) {
    const [hovered, setHovered] = useState(false);
    return (
        <Link
            to="/projects/new"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: "block", textDecoration: "none",
                background: hovered ? "rgba(99,102,241,0.03)" : "#fafafa",
                border: hovered ? "1.5px dashed #6366f1" : "1.5px dashed #cbd5e1",
                borderRadius: "16px", padding: "24px",
                transition: "all 250ms cubic-bezier(0.4,0,0.2,1)",
                transform: hovered ? "translateY(-4px)" : "translateY(0)",
                boxShadow: hovered ? "0 8px 24px rgba(99,102,241,0.10)" : "none",
                animation: `cardIn 420ms cubic-bezier(0.34,1.56,0.64,1) ${index * 60}ms both`,
                minHeight: "200px", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: "12px",
            }}
        >
            <div style={{
                width: "42px", height: "42px", borderRadius: "12px",
                background: hovered ? "rgba(99,102,241,0.12)" : "#f1f5f9",
                border: hovered ? "1px solid rgba(99,102,241,0.25)" : "1px solid #e2e8f0",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 250ms",
                transform: hovered ? "scale(1.1) rotate(90deg)" : "scale(1) rotate(0deg)",
            }}>
                <Plus style={{ width: "18px", height: "18px", color: hovered ? "#6366f1" : "#94a3b8" }}/>
            </div>
            <div style={{ textAlign: "center" }}>
                <p style={{
                    fontSize: "14px", fontWeight: 500,
                    color: hovered ? "#6366f1" : "#64748b",
                    marginBottom: "3px", transition: "color 200ms",
                }}>
                    Nouveau projet
                </p>
                <p style={{ fontSize: "12px", color: "#94a3b8" }}>
                    Démarrer une nouvelle analyse
                </p>
            </div>
        </Link>
    );
}

/* ─── Page principale ───────────────────────────────────────────────────────── */
export function Projects() {
    const [projets,   setProjets]   = useState([]);
    const [loading,   setLoading]   = useState(true);
    const [error,     setError]     = useState("");
    const [selecting, setSelecting] = useState(null);
    const [search,    setSearch]    = useState("");
    const [ready,     setReady]     = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        authFetch("/api/projets")
            .then(res => { if (!res.ok) throw new Error(); return res.json(); })
            .then(data => setProjets(data))
            .catch(() => setError("Impossible de charger les projets."))
            .finally(() => { setLoading(false); setTimeout(() => setReady(true), 60); });
    }, []);

    const username = sessionStorage.getItem("username") || "Utilisateur";

    const filtered = projets.filter(p =>
        !search || p.nom.toLowerCase().includes(search.toLowerCase())
    );

    const handleLogout = () => { sessionStorage.clear(); navigate("/login"); };

    const handleSelect = async (projet) => {
        setSelecting(projet.idProjet);
        setProjetCourant({ id: projet.idProjet, nom: projet.nom, dateCreation: projet.dateCreation, idUser: projet.idUser });
        clearInterviewSession(); clearMFC(); clearBpmn();
        try {
            const interview = await getInterviewByProjet(projet.idProjet);
            if (interview) {
                loadInterviewIntoSession(interview);
                await loadNotesIntoSession(interview.numeroInterview);
                await loadParticipantsIntoSession(interview.numeroInterview);
                await loadNotesStructureesIntoSession(interview.numeroInterview);
                await loadQuestionsIntoSession(interview.numeroInterview);
            }
            await loadActeursIntoSession(projet.idProjet);
            try { await loadMFCIntoSession(projet.idProjet); }   catch {}
            try { await loadBpmnIntoSession(projet.idProjet); }  catch {}
            try {
                const usDb = await loadUSFromDb(projet.idProjet);
                if (usDb.length > 0) saveBacklog(usDb);
            } catch {}
            navigate("/dashboard");
        } catch { navigate("/dashboard"); }
        finally { setSelecting(null); }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes cardIn {
                    from { opacity:0; transform:translateY(20px) scale(0.97); }
                    to   { opacity:1; transform:translateY(0)     scale(1);    }
                }
                @keyframes fadeDown {
                    from { opacity:0; transform:translateY(-16px); }
                    to   { opacity:1; transform:translateY(0); }
                }
                @keyframes fadeUp {
                    from { opacity:0; transform:translateY(16px); }
                    to   { opacity:1; transform:translateY(0); }
                }
                @keyframes shimmer {
                    0%   { background-position: -200% center; }
                    100% { background-position:  200% center; }
                }
                @keyframes orb1 {
                    0%,100% { transform:translate(0,0) scale(1); }
                    50%     { transform:translate(40px,25px) scale(1.12); }
                }
                @keyframes orb2 {
                    0%,100% { transform:translate(0,0) scale(1); }
                    33%     { transform:translate(-30px,18px) scale(0.94); }
                    66%     { transform:translate(22px,-22px) scale(1.08); }
                }
                @keyframes pulseRing {
                    0%   { box-shadow: 0 0 0 0 rgba(99,102,241,0.25); }
                    70%  { box-shadow: 0 0 0 8px rgba(99,102,241,0); }
                    100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
                }

                .projects-root { font-family:'DM Sans',system-ui,sans-serif; }
                .search-input { outline:none; }
                .nav-btn {
                    background:none; border:1px solid #e2e8f0; border-radius:9px;
                    padding:8px 14px; font-size:13px; cursor:pointer;
                    font-family:'DM Sans',system-ui,sans-serif; transition:all 180ms;
                    display:flex; align-items:center; gap:6px;
                }
                .nav-btn:hover { background:#f8fafc; border-color:#cbd5e1; }
            `}</style>

            <div className="projects-root" style={{
                minHeight: "100vh",
                background: "linear-gradient(145deg, #f0f4ff 0%, #fafafa 45%, #fdf4ff 100%)",
                position: "relative", overflow: "hidden",
            }}>

                {/* ── Orbes d'ambiance ── */}
                <div style={{ position:"fixed", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:0 }}>
                    <div style={{
                        position:"absolute", width:"600px", height:"600px",
                        borderRadius:"50%", top:"-150px", left:"-100px",
                        background:"radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
                        animation:"orb1 22s ease-in-out infinite",
                    }}/>
                    <div style={{
                        position:"absolute", width:"500px", height:"500px",
                        borderRadius:"50%", bottom:"-100px", right:"-80px",
                        background:"radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)",
                        animation:"orb2 28s ease-in-out infinite",
                    }}/>
                    {/* Grille fine */}
                    <div style={{
                        position:"absolute", inset:0,
                        backgroundImage:
                            "linear-gradient(rgba(99,102,241,0.035) 1px, transparent 1px)," +
                            "linear-gradient(90deg, rgba(99,102,241,0.035) 1px, transparent 1px)",
                        backgroundSize:"52px 52px",
                        maskImage:"radial-gradient(ellipse 90% 90% at 50% 30%, black 20%, transparent 100%)",
                        WebkitMaskImage:"radial-gradient(ellipse 90% 90% at 50% 30%, black 20%, transparent 100%)",
                    }}/>
                </div>

                {/* ── Header ────────────────────────────────────────────────── */}
                <header style={{
                    position:"sticky", top:0, zIndex:10,
                    background:"rgba(255,255,255,0.82)",
                    backdropFilter:"blur(20px)",
                    WebkitBackdropFilter:"blur(20px)",
                    borderBottom:"1px solid rgba(99,102,241,0.08)",
                    animation:"fadeDown 500ms cubic-bezier(0.34,1.56,0.64,1) both",
                }}>
                    <div style={{
                        maxWidth:"1100px", margin:"0 auto",
                        padding:"0 24px", height:"60px",
                        display:"flex", alignItems:"center", justifyContent:"space-between",
                    }}>
                        {/* Logo + nom */}
                        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                            <img src={logo} alt="logo" style={{
                                height:"34px",
                                filter:"drop-shadow(0 2px 8px rgba(99,102,241,0.2))",
                            }}/>
                            <div>
                                <p style={{
                                    fontSize:"14px", fontWeight:600, color:"#0f172a",
                                    letterSpacing:"-0.025em", lineHeight:1.2,
                                }}>
                                    Analyse Checker
                                </p>
                                <p style={{ fontSize:"10.5px", color:"#94a3b8", lineHeight:1 }}>
                                    Business Analysis Tool
                                </p>
                            </div>
                        </div>

                        {/* Droite : avatar + déconnexion */}
                        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                            <div style={{
                                display:"flex", alignItems:"center", gap:"8px",
                                padding:"5px 12px 5px 5px",
                                background:"#f8fafc", borderRadius:"999px",
                                border:"1px solid #e2e8f0",
                            }}>
                                <div style={{
                                    width:"28px", height:"28px", borderRadius:"50%",
                                    background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
                                    display:"flex", alignItems:"center", justifyContent:"center",
                                    fontSize:"11px", fontWeight:600, color:"white",
                                }}>
                                    {username.slice(0,2).toUpperCase()}
                                </div>
                                <span style={{ fontSize:"13px", color:"#374151", fontWeight:500 }}>
                                    {username}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="nav-btn"
                                style={{ color:"#ef4444", borderColor:"#fecaca" }}
                                onMouseEnter={e => { e.currentTarget.style.background="#fef2f2"; e.currentTarget.style.borderColor="#fca5a5"; }}
                                onMouseLeave={e => { e.currentTarget.style.background="none"; e.currentTarget.style.borderColor="#fecaca"; }}
                            >
                                <LogOut style={{ width:"13px", height:"13px" }}/>
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </header>

                {/* ── Contenu ────────────────────────────────────────────────── */}
                <main style={{
                    maxWidth:"1100px", margin:"0 auto", padding:"48px 24px",
                    position:"relative", zIndex:1,
                }}>

                    {/* Hero section */}
                    <div style={{
                        marginBottom:"40px", textAlign:"center",
                        animation:"fadeUp 550ms cubic-bezier(0.34,1.56,0.64,1) 100ms both",
                    }}>
                        <div style={{
                            display:"inline-flex", alignItems:"center", gap:"6px",
                            padding:"4px 12px", borderRadius:"999px",
                            background:"rgba(99,102,241,0.07)",
                            border:"1px solid rgba(99,102,241,0.14)",
                            fontSize:"12px", color:"#6366f1", fontWeight:500,
                            marginBottom:"16px",
                        }}>
                            <span style={{
                                width:"6px", height:"6px", borderRadius:"50%",
                                background:"#6366f1",
                                animation:"pulseRing 2s ease-out infinite",
                            }}/>
                            {projets.length} projet{projets.length !== 1 ? "s" : ""} disponible{projets.length !== 1 ? "s" : ""}
                        </div>

                        <h1 style={{
                            fontSize:"36px", fontWeight:600, color:"#0f172a",
                            letterSpacing:"-0.04em", lineHeight:1.1, marginBottom:"10px",
                        }}>
                            Bonjour,{" "}
                            <span style={{
                                background:"linear-gradient(90deg,#6366f1,#a855f7,#6366f1)",
                                backgroundSize:"200%",
                                WebkitBackgroundClip:"text",
                                WebkitTextFillColor:"transparent",
                                backgroundClip:"text",
                                animation:"shimmer 4s linear infinite",
                            }}>
                                {username}
                            </span>{" "}
                            👋
                        </h1>
                        <p style={{ fontSize:"15px", color:"#64748b", lineHeight:1.6 }}>
                            Sélectionnez un projet existant ou créez-en un nouveau pour démarrer l'analyse.
                        </p>
                    </div>

                    {/* Barre de recherche */}
                    <div style={{
                        maxWidth:"440px", margin:"0 auto 36px",
                        animation:"fadeUp 500ms cubic-bezier(0.34,1.56,0.64,1) 180ms both",
                    }}>
                        <div style={{
                            position:"relative",
                            background:"#ffffff",
                            border:`1.5px solid ${searchFocused ? "#a5b4fc" : "#e2e8f0"}`,
                            borderRadius:"12px",
                            boxShadow: searchFocused
                                ? "0 0 0 4px rgba(99,102,241,0.10), 0 2px 8px rgba(0,0,0,0.05)"
                                : "0 1px 4px rgba(0,0,0,0.04)",
                            transition:"all 220ms cubic-bezier(0.4,0,0.2,1)",
                        }}>
                            <Search style={{
                                position:"absolute", left:"14px", top:"50%",
                                transform:"translateY(-50%)",
                                width:"15px", height:"15px",
                                color: searchFocused ? "#6366f1" : "#94a3b8",
                                transition:"color 200ms",
                            }}/>
                            <input
                                className="search-input"
                                type="text"
                                placeholder="Rechercher un projet…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={()  => setSearchFocused(false)}
                                style={{
                                    width:"100%", height:"44px",
                                    background:"transparent", border:"none",
                                    padding:"0 14px 0 40px",
                                    fontSize:"14px", color:"#0f172a",
                                    fontFamily:"'DM Sans',system-ui,sans-serif",
                                    caretColor:"#6366f1",
                                }}
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    style={{
                                        position:"absolute", right:"12px", top:"50%",
                                        transform:"translateY(-50%)",
                                        background:"#f1f5f9", border:"none",
                                        borderRadius:"50%", width:"20px", height:"20px",
                                        cursor:"pointer", fontSize:"11px", color:"#64748b",
                                        display:"flex", alignItems:"center", justifyContent:"center",
                                    }}
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Erreur */}
                    {error && (
                        <div style={{
                            padding:"14px 18px", borderRadius:"12px",
                            background:"#fef2f2", border:"1px solid #fecaca",
                            color:"#dc2626", fontSize:"14px", marginBottom:"24px",
                            textAlign:"center",
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Loading */}
                    {loading && (
                        <div style={{
                            display:"flex", flexDirection:"column",
                            alignItems:"center", justifyContent:"center",
                            padding:"80px 0", gap:"16px",
                        }}>
                            <div style={{
                                width:"44px", height:"44px", borderRadius:"12px",
                                background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
                                display:"flex", alignItems:"center", justifyContent:"center",
                            }}>
                                <Loader2 style={{
                                    width:"22px", height:"22px", color:"white",
                                    animation:"spin 0.9s linear infinite",
                                }}/>
                            </div>
                            <p style={{ fontSize:"14px", color:"#94a3b8" }}>
                                Chargement des projets…
                            </p>
                        </div>
                    )}

                    {/* Grille de projets */}
                    {!loading && (
                        <div style={{
                            display:"grid",
                            gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))",
                            gap:"18px",
                        }}>
                            {/* Nouveau projet en premier */}
                            <NewProjectCard index={0}/>

                            {/* Projets filtrés */}
                            {filtered.map((projet, i) => (
                                <ProjectCard
                                    key={projet.idProjet}
                                    projet={projet}
                                    index={i + 1}
                                    onSelect={handleSelect}
                                    selecting={selecting}
                                />
                            ))}

                            {/* Aucun résultat */}
                            {filtered.length === 0 && !loading && search && (
                                <div style={{
                                    gridColumn:"1/-1", textAlign:"center",
                                    padding:"48px 0", color:"#94a3b8", fontSize:"14px",
                                }}>
                                    Aucun projet ne correspond à « {search} »
                                </div>
                            )}
                        </div>
                    )}

                    {/* Stats footer */}
                    {!loading && projets.length > 0 && (
                        <div style={{
                            marginTop:"48px", textAlign:"center",
                            animation:"fadeUp 500ms ease 600ms both",
                        }}>
                            <p style={{ fontSize:"12px", color:"#cbd5e1" }}>
                                {projets.length} projet{projets.length > 1 ? "s" : ""} au total
                                {search && filtered.length !== projets.length
                                    ? ` · ${filtered.length} résultat${filtered.length > 1 ? "s" : ""}` : ""}
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}