import { useState } from "react";
import { X, LogIn, FolderOpen, ExternalLink, Loader2, AlertTriangle, ChevronRight, Check, ArrowLeft, RefreshCw } from "lucide-react";
import { TAIGA_STEP } from "../../../../hooks/useTaiga";


const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

.taiga-overlay {
    position: fixed;
    inset: 0;
    background: rgba(8, 12, 20, 0.75);
    backdrop-filter: blur(8px);
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: overlayIn 0.2s ease;
}

@keyframes overlayIn {
    from { opacity: 0; }
    to   { opacity: 1; }
}

.taiga-modal {
    font-family: 'DM Sans', sans-serif;
    background: #0d1117;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    width: 100%;
    max-width: 460px;
    margin: 0 16px;
    overflow: hidden;
    box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04);
    animation: modalIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalIn {
    from { opacity: 0; transform: translateY(20px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
}

.taiga-header {
    padding: 22px 24px 18px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(135deg, rgba(13,159,110,0.12) 0%, transparent 60%);
}

.taiga-logo {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: linear-gradient(135deg, #0D9F6E 0%, #059669 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(13,159,110,0.4);
    flex-shrink: 0;
}

.taiga-header-info {
    flex: 1;
    margin-left: 12px;
}

.taiga-header-title {
    font-size: 15px;
    font-weight: 600;
    color: #f0f6fc;
    letter-spacing: -0.01em;
}

.taiga-header-sub {
    font-size: 12px;
    color: rgba(240,246,252,0.45);
    margin-top: 1px;
    font-family: 'DM Mono', monospace;
}

.taiga-close-btn {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: rgba(240,246,252,0.5);
    transition: all 0.15s;
    flex-shrink: 0;
}
.taiga-close-btn:hover {
    background: rgba(255,255,255,0.1);
    color: #f0f6fc;
}

.taiga-body {
    padding: 24px;
}

.taiga-error {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 14px;
    background: rgba(220, 38, 38, 0.1);
    border: 1px solid rgba(220, 38, 38, 0.25);
    border-radius: 10px;
    margin-bottom: 18px;
    font-size: 13px;
    color: #fca5a5;
    line-height: 1.5;
}

/* ── Formulaire login ── */
.taiga-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(240,246,252,0.4);
    margin-bottom: 8px;
}

.taiga-input {
    width: 100%;
    box-sizing: border-box;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 11px 14px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: #f0f6fc;
    outline: none;
    transition: all 0.2s;
}
.taiga-input::placeholder {
    color: rgba(240,246,252,0.25);
}
.taiga-input:focus {
    border-color: rgba(13,159,110,0.6);
    background: rgba(13,159,110,0.06);
    box-shadow: 0 0 0 3px rgba(13,159,110,0.12);
}

.taiga-field {
    margin-bottom: 16px;
}

.taiga-btn-primary {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #0D9F6E 0%, #059669 100%);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
    box-shadow: 0 4px 16px rgba(13,159,110,0.3);
    margin-top: 8px;
}
.taiga-btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(13,159,110,0.4);
}
.taiga-btn-primary:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

/* ── Liste projets ── */
.taiga-projects-hint {
    font-size: 13px;
    color: rgba(240,246,252,0.45);
    margin: 0 0 16px;
    line-height: 1.5;
}

.taiga-projects-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 300px;
    overflow-y: auto;
    padding-right: 4px;
}

.taiga-projects-list::-webkit-scrollbar {
    width: 4px;
}
.taiga-projects-list::-webkit-scrollbar-track {
    background: transparent;
}
.taiga-projects-list::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.1);
    border-radius: 2px;
}

.taiga-project-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    width: 100%;
    box-sizing: border-box;
}
.taiga-project-card:hover {
    background: rgba(13,159,110,0.08);
    border-color: rgba(13,159,110,0.3);
    transform: translateX(3px);
}
.taiga-project-card.selected {
    background: rgba(13,159,110,0.12);
    border-color: rgba(13,159,110,0.5);
}

.taiga-project-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: linear-gradient(135deg, rgba(13,159,110,0.2) 0%, rgba(5,150,105,0.2) 100%);
    border: 1px solid rgba(13,159,110,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: #34d399;
}

.taiga-project-name {
    font-size: 14px;
    font-weight: 500;
    color: #f0f6fc;
    line-height: 1.3;
}

.taiga-project-slug {
    font-size: 11px;
    color: rgba(240,246,252,0.35);
    font-family: 'DM Mono', monospace;
    margin-top: 2px;
}

.taiga-project-chevron {
    margin-left: auto;
    color: rgba(240,246,252,0.2);
    transition: all 0.2s;
    flex-shrink: 0;
}
.taiga-project-card:hover .taiga-project-chevron {
    color: #34d399;
    transform: translateX(2px);
}

/* ── Export confirmation ── */
.taiga-export-project-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px;
    background: rgba(13,159,110,0.12);
    border: 1px solid rgba(13,159,110,0.25);
    border-radius: 20px;
    font-size: 12px;
    color: #34d399;
    font-weight: 500;
    margin-bottom: 16px;
}

.taiga-us-preview {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 20px;
}

.taiga-us-id {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: rgba(240,246,252,0.3);
    margin-bottom: 8px;
}

.taiga-us-actor {
    font-size: 14px;
    font-weight: 500;
    color: #f0f6fc;
    margin-bottom: 4px;
    line-height: 1.4;
}

.taiga-us-actor span {
    color: #34d399;
}

.taiga-us-detail {
    font-size: 13px;
    color: rgba(240,246,252,0.55);
    line-height: 1.5;
}

.taiga-us-criterias {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid rgba(255,255,255,0.06);
    font-size: 12px;
    color: rgba(240,246,252,0.35);
}

/* ── Footer ── */
.taiga-footer {
    padding: 14px 24px;
    border-top: 1px solid rgba(255,255,255,0.06);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.taiga-session-info {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: rgba(240,246,252,0.35);
}

.taiga-session-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #34d399;
    box-shadow: 0 0 6px #34d399;
    flex-shrink: 0;
}

.taiga-logout-btn {
    font-size: 12px;
    color: rgba(240,246,252,0.3);
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: underline;
    font-family: 'DM Sans', sans-serif;
    transition: color 0.15s;
    padding: 0;
}
.taiga-logout-btn:hover {
    color: #fca5a5;
}

.taiga-back-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: rgba(240,246,252,0.35);
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: color 0.15s;
    padding: 4px 0;
}
.taiga-back-btn:hover {
    color: rgba(240,246,252,0.7);
}

.taiga-loading-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    gap: 14px;
    color: rgba(240,246,252,0.4);
    font-size: 13px;
}

.taiga-spinner {
    animation: spin 0.8s linear infinite;
    color: #34d399;
}
@keyframes spin { to { transform: rotate(360deg); } }

.taiga-steps {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 20px;
}
.taiga-step-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255,255,255,0.12);
    transition: all 0.2s;
}
.taiga-step-dot.active {
    background: #0D9F6E;
    box-shadow: 0 0 8px rgba(13,159,110,0.5);
    width: 20px;
    border-radius: 3px;
}
.taiga-step-line {
    width: 20px;
    height: 1px;
    background: rgba(255,255,255,0.08);
}

.taiga-empty {
    text-align: center;
    padding: 32px 0;
    color: rgba(240,246,252,0.3);
    font-size: 13px;
}
`;


export function ModaleTaiga({ taiga }) {
    const {
        step, session, projets, projetChoisi, usAExporter,
        loading, error,
        fermer, login, choisirProjet, exporterUS, deconnecter, changerProjet,
    } = taiga;

    if (step === TAIGA_STEP.CLOSED) return null;

    const stepIndex = {
        [TAIGA_STEP.LOGIN]:   0,
        [TAIGA_STEP.PROJETS]: 1,
        [TAIGA_STEP.EXPORT]:  2,
    }[step] ?? 0;

    const headerTitle = {
        [TAIGA_STEP.LOGIN]:   "Connexion à Taiga",
        [TAIGA_STEP.PROJETS]: "Choisir un projet",
        [TAIGA_STEP.EXPORT]:  "Confirmer l'export",
    }[step];

    return (
        <>
            <style>{STYLES}</style>
            <div className="taiga-overlay" onClick={(e) => e.target === e.currentTarget && fermer()}>
                <div className="taiga-modal">

                    <div className="taiga-header">
                        <div className="taiga-logo">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                            </svg>
                        </div>
                        <div className="taiga-header-info">
                            <div className="taiga-header-title">{headerTitle}</div>
                            {session && (
                                <div className="taiga-header-sub">@{session.username}</div>
                            )}
                        </div>
                        <button className="taiga-close-btn" onClick={fermer}>
                            <X size={14} />
                        </button>
                    </div>

                    <div className="taiga-body">

                        <div className="taiga-steps">
                            {[0, 1, 2].map((i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <div className={`taiga-step-dot ${i === stepIndex ? "active" : ""}`} />
                                    {i < 2 && <div className="taiga-step-line" />}
                                </div>
                            ))}
                        </div>

                        {error && (
                            <div className="taiga-error">
                                <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                                {error}
                            </div>
                        )}

                        {step === TAIGA_STEP.LOGIN && (
                            <FormLogin onSubmit={login} loading={loading} />
                        )}

                        {step === TAIGA_STEP.PROJETS && (
                            <ListeProjets
                                projets={projets}
                                loading={loading}
                                projetActuel={projetChoisi}
                                onChoisir={choisirProjet}
                            />
                        )}

                        {step === TAIGA_STEP.EXPORT && (
                            <ConfirmExport
                                us={usAExporter}
                                projet={projetChoisi}
                                loading={loading}
                                onConfirmer={() => exporterUS(usAExporter)}
                                onChangerProjet={changerProjet}
                            />
                        )}
                    </div>

                    {/* Footer */}
                    {session && (
                        <div className="taiga-footer">
                            <div className="taiga-session-info">
                                <div className="taiga-session-dot" />
                                Connecté
                            </div>
                            <button className="taiga-logout-btn" onClick={deconnecter}>
                                Déconnecter
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}


function FormLogin({ onSubmit, loading }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        if (!username.trim() || !password.trim()) return;
        onSubmit(username.trim(), password);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="taiga-field">
                <label className="taiga-label">Identifiant</label>
                <input
                    className="taiga-input"
                    type="text"
                    value={username}
                    autoFocus
                    autoComplete="username"
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="votre.identifiant"
                />
            </div>
            <div className="taiga-field">
                <label className="taiga-label">Mot de passe</label>
                <input
                    className="taiga-input"
                    type="password"
                    value={password}
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                />
            </div>
            <button
                type="submit"
                className="taiga-btn-primary"
                disabled={loading || !username.trim() || !password.trim()}
            >
                {loading
                    ? <><Loader2 size={16} className="taiga-spinner" /> Connexion...</>
                    : <><LogIn size={16} /> Se connecter à Taiga</>
                }
            </button>
        </form>
    );
}


function ListeProjets({ projets, loading, projetActuel, onChoisir }) {
    if (loading) {
        return (
            <div className="taiga-loading-center">
                <Loader2 size={24} className="taiga-spinner" />
                <span>Chargement des projets...</span>
            </div>
        );
    }

    if (projets.length === 0) {
        return (
            <div className="taiga-empty">
                Aucun projet Taiga trouvé pour ce compte.
            </div>
        );
    }

    return (
        <div>
            <p className="taiga-projects-hint">
                Sélectionnez le projet vers lequel exporter vos User Stories.
            </p>
            <div className="taiga-projects-list">
                {projets.map((p) => (
                    <button
                        key={p.id}
                        className={`taiga-project-card ${projetActuel?.id === p.id ? "selected" : ""}`}
                        onClick={() => onChoisir(p)}
                    >
                        <div className="taiga-project-icon">
                            <FolderOpen size={16} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                            <div className="taiga-project-name">{p.nom}</div>
                            <div className="taiga-project-slug">/{p.slug}</div>
                        </div>
                        {projetActuel?.id === p.id
                            ? <Check size={15} style={{ color: "#34d399", flexShrink: 0 }} />
                            : <ChevronRight size={15} className="taiga-project-chevron" />
                        }
                    </button>
                ))}
            </div>
        </div>
    );
}


function ConfirmExport({ us, projet, loading, onConfirmer, onChangerProjet }) {
    if (!us || !projet) return null;

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <div className="taiga-export-project-badge">
                    <FolderOpen size={12} />
                    {projet.nom}
                </div>
                <button className="taiga-back-btn" onClick={onChangerProjet}>
                    <ArrowLeft size={12} />
                    Changer de projet
                </button>
            </div>

            <div className="taiga-us-preview">
                <div className="taiga-us-id">{us.id}</div>
                <div className="taiga-us-actor">
                    En tant que <span>{us.acteur || "—"}</span>
                </div>
                {us.veux && (
                    <div className="taiga-us-detail">
                        je veux {us.veux}
                    </div>
                )}
                {us.afin && (
                    <div className="taiga-us-detail">
                        afin de {us.afin}
                    </div>
                )}
                {us.criteres?.length > 0 && (
                    <div className="taiga-us-criterias">
                        <Check size={11} style={{ color: "#34d399" }} />
                        {us.criteres.length} critère{us.criteres.length > 1 ? "s" : ""} d'acceptation
                    </div>
                )}
            </div>

            <button
                className="taiga-btn-primary"
                onClick={onConfirmer}
                disabled={loading}
            >
                {loading
                    ? <><Loader2 size={16} className="taiga-spinner" /> Export en cours...</>
                    : <><ExternalLink size={16} /> Exporter vers Taiga</>
                }
            </button>
        </div>
    );
}