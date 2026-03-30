import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";

function ParticleCanvas() {
    const ref = useRef(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let raf;
        let W, H, particles = [];

        function resize() {
            W = canvas.width = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
        }

        function mkParticle() {
            return {
                x: Math.random() * W,
                y: Math.random() * H,
                vx: (Math.random() - 0.5) * 0.28,
                vy: (Math.random() - 0.5) * 0.28,
                r: Math.random() * 1.6 + 0.4,
                op: Math.random() * 0.35 + 0.05,
                pulse: Math.random() * Math.PI * 2,
            };
        }

        resize();
        for (let i = 0; i < 70; i++) particles.push(mkParticle());

        let t = 0;
        function draw() {
            t += 0.01;
            ctx.clearRect(0, 0, W, H);

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(99,102,241,${(1 - d / 120) * 0.12})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = W;
                if (p.x > W) p.x = 0;
                if (p.y < 0) p.y = H;
                if (p.y > H) p.y = 0;

                const pulse = Math.sin(t + p.pulse) * 0.25 + 0.75;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * pulse, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(99,102,241,${p.op * pulse})`;
                ctx.fill();
            });

            raf = requestAnimationFrame(draw);
        }

        draw();
        window.addEventListener("resize", resize);
        return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
    }, []);

    return (
        <canvas
            ref={ref}
            style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                pointerEvents: "none",
            }}
        />
    );
}

function Icon({ d, size = 16, stroke = "currentColor", sw = 2, extra = {} }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
            stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" {...extra}>
            {d}
        </svg>
    );
}
const UserIcon = () => <Icon d={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>}/>;
const LockIcon = () => <Icon d={<><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>}/>;
const EyeIcon = () => <Icon d={<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}/>;
const EyeOffIcon= () => <Icon d={<><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>}/>;

function CheckIcon({ color = "#16a34a" }) {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
    );
}
function AlertIcon({ size = 14 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
            stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
    );
}
function Spinner() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            style={{ animation: "spin 0.75s linear infinite" }}>
            <circle cx="12" cy="12" r="10" stroke="rgba(99,102,241,0.2)" strokeWidth="3"/>
            <path d="M12 2 A10 10 0 0 1 22 12" stroke="#6366f1" strokeWidth="3" strokeLinecap="round"/>
        </svg>
    );
}

function Field({ label, type, value, onChange, placeholder, error, valid, LeftIcon }) {
    const [focused, setFocused] = useState(false);
    const [showPwd, setShowPwd] = useState(false);
    const realType = type === "password" ? (showPwd ? "text" : "password") : type;

    const borderCol = error
        ? "#fca5a5"
        : valid
            ? "#86efac"
            : focused
                ? "#a5b4fc"
                : "#e2e8f0";

    const shadowCol = error
        ? "rgba(239,68,68,0.12)"
        : valid
            ? "rgba(34,197,94,0.10)"
            : focused
                ? "rgba(99,102,241,0.14)"
                : "transparent";

    return (
        <div style={{ marginBottom: "18px" }}>
            <label style={{
                display: "block", marginBottom: "7px",
                fontSize: "12px", fontWeight: 500,
                color: focused ? "#6366f1" : "#64748b",
                letterSpacing: "0.05em", textTransform: "uppercase",
                transition: "color 180ms",
            }}>
                {label}
            </label>

            <div style={{ position: "relative" }}>
                <span style={{
                    position: "absolute", left: "14px", top: "50%",
                    transform: "translateY(-50%)", pointerEvents: "none",
                    color: focused ? "#818cf8" : "#94a3b8",
                    display: "flex", alignItems: "center",
                    transition: "color 180ms",
                }}>
                    <LeftIcon/>
                </span>

                <input
                    type={realType}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={{
                        width: "100%", height: "48px",
                        background: focused ? "#ffffff" : "#f8fafc",
                        border: `1.5px solid ${borderCol}`,
                        borderRadius: "11px",
                        padding: "0 42px",
                        fontSize: "14px", color: "#0f172a",
                        outline: "none",
                        boxShadow: `0 0 0 4px ${shadowCol}`,
                        transition: "all 200ms cubic-bezier(0.4,0,0.2,1)",
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                        boxSizing: "border-box",
                    }}
                />

                <span style={{
                    position: "absolute", right: "12px", top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex", alignItems: "center", gap: "6px",
                }}>
                    {type === "password" && (
                        <button type="button" onClick={() => setShowPwd(v => !v)}
                            style={{
                                background: "none", border: "none", cursor: "pointer",
                                color: "#94a3b8", display: "flex", alignItems: "center",
                                padding: "2px", transition: "color 150ms",
                            }}
                            onMouseEnter={e => e.currentTarget.style.color="#6366f1"}
                            onMouseLeave={e => e.currentTarget.style.color="#94a3b8"}
                        >
                            {showPwd ? <EyeOffIcon/> : <EyeIcon/>}
                        </button>
                    )}
                    {valid && !error && <CheckIcon color="#4ade80"/>}
                    {error && <AlertIcon size={15}/>}
                </span>
            </div>

            {error && (
                <p style={{
                    margin: "5px 0 0", fontSize: "12px", color: "#dc2626",
                    display: "flex", alignItems: "center", gap: "5px",
                    animation: "shake 280ms ease",
                }}>
                    <AlertIcon size={11}/> {error}
                </p>
            )}
        </div>
    );
}

function PwdStrength({ password }) {
    if (!password) return null;

    const checks = [
        { ok: password.length >= 8, label: "8+ caractères" },
        { ok: /[A-Z]/.test(password), label: "Majuscule" },
        { ok: /[!@#$%^&*]/.test(password), label: "Spécial" },
    ];
    const score = checks.filter(c => c.ok).length;
    const colors = ["#f87171", "#fbbf24", "#4ade80"];
    const labels = ["Faible", "Moyen", "Fort"];

    return (
        <div style={{ marginTop: "-10px", marginBottom: "16px" }}>
            <div style={{ display: "flex", gap: "4px", marginBottom: "7px" }}>
                {[0,1,2].map(i => (
                    <div key={i} style={{
                        flex: 1, height: "3px", borderRadius: "99px",
                        background: i < score ? colors[score - 1] : "#e2e8f0",
                        transition: "background 300ms ease",
                    }}/>
                ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: "12px" }}>
                    {checks.map((c, i) => (
                        <span key={i} style={{
                            fontSize: "11px", fontWeight: 400,
                            color: c.ok ? "#16a34a" : "#94a3b8",
                            display: "flex", alignItems: "center", gap: "3px",
                            transition: "color 250ms",
                        }}>
                            <span style={{ fontWeight: 600, fontSize: "10px" }}>
                                {c.ok ? "✓" : "○"}
                            </span>
                            {c.label}
                        </span>
                    ))}
                </div>
                {score > 0 && (
                    <span style={{
                        fontSize: "11px", fontWeight: 600,
                        color: colors[score - 1],
                    }}>
                        {labels[score - 1]}
                    </span>
                )}
            </div>
        </div>
    );
}

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [ready, setReady] = useState(false);
    const navigate = useNavigate();

    useEffect(() => { setTimeout(() => setReady(true), 80); }, []);

    const usernameOk = username.trim().length >= 2;
    const pwdOk = password.length >= 8 && /[A-Z]/.test(password) && /[!@#$%^&*]/.test(password);
    const canSubmit = usernameOk && pwdOk && !loading;

    async function handleSubmit(e) {
        e.preventDefault();
        if (!canSubmit) return;
        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();

            if (!res.ok || data.isError) {
                setError("Identifiants incorrects. Vérifiez et réessayez.");
                setLoading(false);
                return;
            }

            sessionStorage.setItem("username", username);
            sessionStorage.setItem("token", data.content);
            setSuccess(true);
            setTimeout(() => navigate("/projects"), 900);
        } catch {
            setError("Impossible de joindre le serveur.");
            setLoading(false);
        }
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family:'DM Sans',system-ui,sans-serif; }
                input::placeholder { color: #cbd5e1; }

                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes shake {
                    0%,100% { transform: translateX(0); }
                    20%,60% { transform: translateX(-5px); }
                    40%,80% { transform: translateX(5px); }
                }
                @keyframes fadeUp {
                    from { opacity:0; transform:translateY(18px); }
                    to { opacity:1; transform:translateY(0); }
                }
                @keyframes fadeLeft {
                    from { opacity:0; transform:translateX(-20px); }
                    to { opacity:1; transform:translateX(0); }
                }
                @keyframes shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                @keyframes float {
                    0%,100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }
                @keyframes successPop {
                    0% { transform: scale(1); }
                    45% { transform: scale(1.03); }
                    100%{ transform: scale(1); }
                }
                @keyframes orb1 {
                    0%,100% { transform:translate(0,0) scale(1); }
                    50% { transform:translate(30px,20px) scale(1.1); }
                }
                @keyframes orb2 {
                    0%,100% { transform:translate(0,0) scale(1); }
                    33% { transform:translate(-25px,15px) scale(0.95); }
                    66% { transform:translate(20px,-20px) scale(1.08); }
                }

                .login-submit {
                    width:100%; height:48px; border:none; border-radius:11px;
                    font-size:14px; font-weight:600;
                    font-family:'DM Sans',system-ui,sans-serif;
                    cursor:pointer; position:relative; overflow:hidden;
                    letter-spacing:0.01em;
                    transition: all 250ms cubic-bezier(0.4,0,0.2,1);
                }
                .login-submit:not(:disabled):hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 28px rgba(99,102,241,0.38);
                }
                .login-submit:not(:disabled):active {
                    transform: translateY(0) scale(0.98);
                }
                .login-submit::after {
                    content:"";
                    position:absolute; inset:0;
                    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);
                    background-size:200% 100%;
                    opacity:0; transition:opacity 250ms;
                    animation: shimmer 2.2s linear infinite;
                }
                .login-submit:not(:disabled):hover::after { opacity:1; }

                .feature-pill {
                    display:inline-flex; align-items:center; gap:8px;
                    padding:8px 14px; border-radius:999px;
                    background:rgba(99,102,241,0.06);
                    border:1px solid rgba(99,102,241,0.12);
                    font-size:13px; color:#475569; font-weight:400;
                    animation: float 4s ease-in-out infinite;
                }
            `}</style>

            <div style={{
                minHeight: "100vh", width: "100%",
                background: "linear-gradient(145deg, #f0f4ff 0%, #fafafa 50%, #f5f3ff 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative", overflow: "hidden",
                fontFamily: "'DM Sans', system-ui, sans-serif",
            }}>

                <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
                    <div style={{
                        position:"absolute", width:"500px", height:"500px",
                        borderRadius:"50%", top:"-100px", left:"-100px",
                        background:"radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)",
                        animation:"orb1 20s ease-in-out infinite",
                    }}/>
                    <div style={{
                        position:"absolute", width:"420px", height:"420px",
                        borderRadius:"50%", bottom:"-80px", right:"-60px",
                        background:"radial-gradient(circle, rgba(168,85,247,0.09) 0%, transparent 70%)",
                        animation:"orb2 26s ease-in-out infinite",
                    }}/>
                    <div style={{
                        position:"absolute", width:"300px", height:"300px",
                        borderRadius:"50%", top:"40%", right:"15%",
                        background:"radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)",
                        animation:"orb1 16s ease-in-out infinite reverse",
                    }}/>
                </div>

                <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
                    <ParticleCanvas/>
                </div>

                <div style={{
                    position:"absolute", inset:0, pointerEvents:"none",
                    backgroundImage:
                        "linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px)," +
                        "linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)",
                    backgroundSize:"52px 52px",
                    maskImage:"radial-gradient(ellipse 75% 75% at 50% 50%, black 30%, transparent 100%)",
                    WebkitMaskImage:"radial-gradient(ellipse 75% 75% at 50% 50%, black 30%, transparent 100%)",
                }}/>

                <div style={{
                    display:"flex", gap:"72px", alignItems:"center",
                    width:"100%", maxWidth:"960px", padding:"0 24px",
                    position:"relative", zIndex:1,
                }}>

                    <div style={{
                        flex:1,
                        opacity: ready ? 1 : 0,
                        animation: ready ? "fadeLeft 600ms cubic-bezier(0.34,1.56,0.64,1) 100ms both" : "none",
                    }}>
                        <img
                            src={logo}
                            alt="Analyse Checker"
                            style={{
                                height: "72px",
                                marginBottom: "24px",
                                display: "block",
                                filter: "drop-shadow(0 4px 16px rgba(99,102,241,0.18))",
                                animation: "float 6s ease-in-out infinite",
                            }}
                        />

                        <h1 style={{
                            fontSize: "38px", fontWeight: 600, lineHeight: 1.1,
                            letterSpacing: "-0.04em", color: "#0f172a",
                            marginBottom: "12px",
                        }}>
                            Business Analysis<br/>
                            <span style={{
                                background: "linear-gradient(90deg, #6366f1, #a855f7, #6366f1)",
                                backgroundSize: "200%",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                                animation: "shimmer 4s linear infinite",
                            }}>
                                Tool
                            </span>
                        </h1>

                        <p style={{
                            fontSize: "14.5px", color: "#64748b",
                            lineHeight: 1.7, maxWidth: "300px",
                            marginBottom: "32px",
                        }}>
                            Structurez, tracez et validez vos exigences métier avec l'aide de l'intelligence artificielle.
                        </p>

                        <div style={{ display:"flex", flexDirection:"column", gap:"9px" }}>
                            {[
                                { icon:"✦", label:"Analyse IA des entretiens", delay:"0s", dur:"3.8s" },
                                { icon:"◈", label:"Traçabilité complète", delay:"0.6s", dur:"4.2s" },
                                { icon:"⬡", label:"Export Taiga & BPMN", delay:"1.2s", dur:"3.5s" },
                                { icon:"◎", label:"Contrôle de cohérence", delay:"1.8s", dur:"4.6s" },
                            ].map((f, i) => (
                                <div
                                    key={i}
                                    className="feature-pill"
                                    style={{ animationDelay:f.delay, animationDuration:f.dur }}
                                >
                                    <span style={{ fontSize:"13px", color:"#6366f1" }}>{f.icon}</span>
                                    {f.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{
                        width: "370px", flexShrink:0, position:"relative",
                        opacity: ready ? 1 : 0,
                        animation: ready
                            ? `fadeUp 550ms cubic-bezier(0.34,1.56,0.64,1) both ${success ? ", successPop 600ms ease" : ""}`
                            : "none",
                    }}>
                        <div style={{
                            position:"absolute", inset:"-16px", borderRadius:"28px",
                            background:"radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.10) 0%, transparent 70%)",
                            pointerEvents:"none",
                        }}/>

                        <div style={{
                            background:"#ffffff",
                            border:"1px solid rgba(99,102,241,0.12)",
                            borderRadius:"20px",
                            padding:"36px 32px",
                            boxShadow:
                                "0 1px 3px rgba(0,0,0,0.04)," +
                                "0 8px 24px rgba(99,102,241,0.08)," +
                                "0 32px 64px rgba(0,0,0,0.06)",
                            position:"relative",
                        }}>

                            <div style={{
                                position:"absolute", top:0, left:"32px", right:"32px",
                                height:"3px", borderRadius:"0 0 4px 4px",
                                background:"linear-gradient(90deg, #6366f1, #a855f7)",
                                opacity:0.8,
                            }}/>

                            <div style={{ marginBottom:"26px" }}>
                                <h2 style={{
                                    fontSize:"20px", fontWeight:600, color:"#0f172a",
                                    letterSpacing:"-0.03em", marginBottom:"5px",
                                }}>
                                    Bon retour
                                </h2>
                                <p style={{ fontSize:"13.5px", color:"#94a3b8", fontWeight:400 }}>
                                    Connectez-vous à votre espace
                                </p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <Field
                                    label="Identifiant"
                                    type="text"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    placeholder="votre.identifiant"
                                    error={username.length > 0 && !usernameOk ? "2 caractères minimum" : ""}
                                    valid={usernameOk}
                                    LeftIcon={UserIcon}
                                />

                                <Field
                                    label="Mot de passe"
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    error=""
                                    valid={pwdOk}
                                    LeftIcon={LockIcon}
                                />

                                <PwdStrength password={password}/>

                                {error && (
                                    <div style={{
                                        padding:"11px 14px", borderRadius:"10px",
                                        background:"#fef2f2",
                                        border:"1px solid #fecaca",
                                        marginBottom:"16px",
                                        display:"flex", alignItems:"center", gap:"8px",
                                        animation:"shake 280ms ease",
                                    }}>
                                        <AlertIcon size={14}/>
                                        <p style={{ fontSize:"13px", color:"#dc2626", margin:0 }}>
                                            {error}
                                        </p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={!canSubmit}
                                    className="login-submit"
                                    style={{
                                        background: success
                                            ? "linear-gradient(135deg,#22c55e,#16a34a)"
                                            : canSubmit
                                                ? "linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)"
                                                : "#f1f5f9",
                                        color: canSubmit || success ? "white" : "#94a3b8",
                                        boxShadow: canSubmit && !success
                                            ? "0 4px 18px rgba(99,102,241,0.28)"
                                            : success
                                                ? "0 4px 18px rgba(34,197,94,0.28)"
                                                : "none",
                                    }}
                                >
                                    {success ? (
                                        <span style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:"8px" }}>
                                            <CheckIcon color="white"/> Connecté !
                                        </span>
                                    ) : loading ? (
                                        <span style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:"8px" }}>
                                            <Spinner/> Connexion en cours…
                                        </span>
                                    ) : "Se connecter"}
                                </button>
                            </form>

                            <p style={{
                                marginTop:"20px", textAlign:"center",
                                fontSize:"11.5px", color:"#cbd5e1",
                            }}>
                                Authentification sécurisée via LDAP
                            </p>
                        </div>
                    </div>
                </div>

                <p style={{
                    position:"fixed", bottom:"16px", left:"50%",
                    transform:"translateX(-50%)",
                    fontSize:"11px", color:"#94a3b8", zIndex:1,
                    letterSpacing:"0.04em",
                }}>
                    Analyse Checker — v1.0.0
                </p>
            </div>
        </>
    );
}