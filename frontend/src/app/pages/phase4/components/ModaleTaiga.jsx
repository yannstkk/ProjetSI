import { useState } from "react";
import { X, LogIn, FolderOpen, CheckCircle, AlertTriangle, Loader2, ExternalLink } from "lucide-react";
import { TAIGA_STEP } from "../../../../hooks/useTaiga";


export function ModaleTaiga({ taiga }) {
    const { step, session, projets, projetChoisi, usAExporter, loading, error,
            fermer, login, choisirProjet, exporterUS, deconnecter } = taiga;

    if (step === TAIGA_STEP.CLOSED) return null;

    return (
        <div
            style={{
                position: "fixed", inset: 0,
                background: "rgba(0,0,0,0.5)",
                zIndex: 50,
                display: "flex", alignItems: "center", justifyContent: "center",
            }}
            onClick={(e) => e.target === e.currentTarget && fermer()}
        >
            <div style={{
                background: "var(--color-background-primary)",
                borderRadius: "var(--border-radius-lg)",
                border: "1px solid var(--color-border-tertiary)",
                width: "100%", maxWidth: 460,
                margin: "0 16px",
                overflow: "hidden",
            }}>
                {/* Header */}
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "16px 20px",
                    borderBottom: "1px solid var(--color-border-tertiary)",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: 8,
                            background: "#0D9F6E",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                            </svg>
                        </div>
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>
                                {step === TAIGA_STEP.LOGIN   && "Connexion Taiga"}
                                {step === TAIGA_STEP.PROJETS && "Choisir un projet"}
                                {step === TAIGA_STEP.EXPORT  && "Confirmer l'export"}
                            </div>
                            {session && (
                                <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
                                    Connecté : {session.username}
                                </div>
                            )}
                        </div>
                    </div>
                    <button onClick={fermer} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--color-text-secondary)" }}>
                        <X size={18} />
                    </button>
                </div>

                {/* Corps */}
                <div style={{ padding: "20px" }}>

                    {/* Erreur */}
                    {error && (
                        <div style={{
                            display: "flex", alignItems: "center", gap: 8,
                            padding: "10px 14px",
                            background: "var(--color-background-danger)",
                            border: "1px solid var(--color-border-danger)",
                            borderRadius: "var(--border-radius-md)",
                            marginBottom: 16,
                            fontSize: 13, color: "var(--color-text-danger)",
                        }}>
                            <AlertTriangle size={14} style={{ flexShrink: 0 }} />
                            {error}
                        </div>
                    )}

                    {/* Étape LOGIN */}
                    {step === TAIGA_STEP.LOGIN && (
                        <FormLogin onSubmit={login} loading={loading} />
                    )}

                    {/* Étape PROJETS */}
                    {step === TAIGA_STEP.PROJETS && (
                        <ListeProjets projets={projets} loading={loading} onChoisir={choisirProjet} />
                    )}

                    {/* Étape EXPORT */}
                    {step === TAIGA_STEP.EXPORT && (
                        <ConfirmExport
                            us={usAExporter}
                            projet={projetChoisi}
                            loading={loading}
                            onConfirmer={() => exporterUS(usAExporter)}
                            onRetour={() => taiga.step !== TAIGA_STEP.EXPORT && null}
                        />
                    )}
                </div>

                {/* Footer */}
                {session && (
                    <div style={{
                        padding: "12px 20px",
                        borderTop: "1px solid var(--color-border-tertiary)",
                        display: "flex", justifyContent: "flex-end",
                    }}>
                        <button
                            onClick={deconnecter}
                            style={{
                                fontSize: 12, color: "var(--color-text-tertiary)",
                                background: "none", border: "none", cursor: "pointer",
                                textDecoration: "underline",
                            }}
                        >
                            Se déconnecter de Taiga
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Formulaire de login ───────────────────────────────────────────────────────

function FormLogin({ onSubmit, loading }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        if (!username.trim() || !password.trim()) return;
        onSubmit(username.trim(), password);
    }

    const inputStyle = {
        width: "100%", boxSizing: "border-box",
        border: "1px solid var(--color-border-secondary)",
        borderRadius: "var(--border-radius-md)",
        padding: "9px 12px", fontSize: 14,
        background: "var(--color-background-primary)",
        color: "var(--color-text-primary)",
        outline: "none",
    };
    const labelStyle = {
        display: "block", fontSize: 13, fontWeight: 500,
        color: "var(--color-text-secondary)", marginBottom: 6,
    };

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Identifiant Taiga</label>
                <input
                    style={inputStyle} type="text" value={username} autoFocus
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="votre.identifiant"
                />
            </div>
            <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Mot de passe</label>
                <input
                    style={inputStyle} type="password" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                />
            </div>
            <button
                type="submit"
                disabled={loading || !username.trim() || !password.trim()}
                style={{
                    width: "100%", padding: "10px 0",
                    background: loading ? "var(--color-border-secondary)" : "#0D9F6E",
                    color: "white", border: "none",
                    borderRadius: "var(--border-radius-md)",
                    fontSize: 14, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
            >
                {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <LogIn size={16} />}
                {loading ? "Connexion..." : "Se connecter"}
            </button>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </form>
    );
}

// ── Liste des projets ─────────────────────────────────────────────────────────

function ListeProjets({ projets, loading, onChoisir }) {
    if (loading) return (
        <div style={{ textAlign: "center", padding: "24px 0", color: "var(--color-text-secondary)", fontSize: 13 }}>
            <Loader2 size={20} style={{ animation: "spin 1s linear infinite", marginBottom: 8 }} />
            <div>Chargement des projets...</div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    if (projets.length === 0) return (
        <div style={{ textAlign: "center", padding: "24px 0", color: "var(--color-text-secondary)", fontSize: 13 }}>
            Aucun projet Taiga trouvé pour ce compte.
        </div>
    );

    return (
        <div>
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 12, margin: "0 0 12px" }}>
                Vers quel projet souhaitez-vous exporter ?
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 280, overflowY: "auto" }}>
                {projets.map((p) => (
                    <button
                        key={p.id}
                        onClick={() => onChoisir(p)}
                        style={{
                            display: "flex", alignItems: "center", gap: 12,
                            padding: "12px 14px", textAlign: "left",
                            background: "var(--color-background-secondary)",
                            border: "1px solid var(--color-border-tertiary)",
                            borderRadius: "var(--border-radius-md)",
                            cursor: "pointer", transition: "border-color 0.15s",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = "#0D9F6E"}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--color-border-tertiary)"}
                    >
                        <FolderOpen size={16} style={{ color: "#0D9F6E", flexShrink: 0 }} />
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>{p.nom}</div>
                            <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>/{p.slug}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

// ── Confirmation d'export ─────────────────────────────────────────────────────

function ConfirmExport({ us, projet, loading, onConfirmer }) {
    if (!us || !projet) return null;

    return (
        <div>
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 16, margin: "0 0 16px" }}>
                Cette User Story sera exportée vers le projet <strong style={{ color: "var(--color-text-primary)" }}>{projet.nom}</strong> sur Taiga.
            </p>

            <div style={{
                background: "var(--color-background-secondary)",
                border: "1px solid var(--color-border-tertiary)",
                borderRadius: "var(--border-radius-md)",
                padding: "14px", marginBottom: 20,
            }}>
                <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 4 }}>{us.id}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 4 }}>
                    En tant que {us.acteur}
                </div>
                <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
                    Je veux {us.veux}
                </div>
                {us.afin && (
                    <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
                        Afin de {us.afin}
                    </div>
                )}
                {us.criteres?.length > 0 && (
                    <div style={{ marginTop: 8, fontSize: 12, color: "var(--color-text-tertiary)" }}>
                        {us.criteres.length} critère{us.criteres.length > 1 ? "s" : ""} d'acceptation
                    </div>
                )}
            </div>

            <button
                onClick={onConfirmer}
                disabled={loading}
                style={{
                    width: "100%", padding: "10px 0",
                    background: loading ? "var(--color-border-secondary)" : "#0D9F6E",
                    color: "white", border: "none",
                    borderRadius: "var(--border-radius-md)",
                    fontSize: 14, fontWeight: 500,
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
            >
                {loading
                    ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Export en cours...</>
                    : <><ExternalLink size={16} /> Confirmer l'export</>
                }
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </button>
        </div>
    );
}