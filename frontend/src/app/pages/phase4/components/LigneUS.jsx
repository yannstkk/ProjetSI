import { Link } from "react-router-dom";
import { Edit, Trash2, ExternalLink, CheckCircle } from "lucide-react";
import { PRIORITE_CONFIG, STATUT_CONFIG } from "./BarreOutils";

export function LigneUS({ us, isLast, taigaConnecte, onExporter, onSupprimer }) {
    const tdStyle = {
        padding: "12px 16px",
        borderBottom: isLast ? "none" : "1px solid var(--color-border-tertiary)",
        verticalAlign: "middle",
    };

    const prioriteCfg = PRIORITE_CONFIG[us.priorite] || PRIORITE_CONFIG.moyenne;
    const statutCfg   = STATUT_CONFIG[us.statut]     || STATUT_CONFIG.brouillon;

    return (
        <tr
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-background-secondary)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            style={{ transition: "background 0.1s" }}
        >
            {/* ID */}
            <td style={tdStyle}>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 500, color: "var(--color-text-primary)" }}>
                        {us.id}
                    </span>
                    {us.source === "phase3" && (
                        <span style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Phase 3</span>
                    )}
                </div>
            </td>

            {/* User Story */}
            <td style={{ ...tdStyle, maxWidth: 320 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 2 }}>
                    En tant que <span style={{ color: "#185FA5" }}>{us.acteur || "—"}</span>
                </div>
                <div style={{
                    fontSize: 12, color: "var(--color-text-secondary)",
                    overflow: "hidden", textOverflow: "ellipsis",
                    whiteSpace: "nowrap", maxWidth: 280,
                }}>
                    Je veux {us.veux || <em style={{ color: "var(--color-text-tertiary)" }}>non renseigné</em>}
                </div>
            </td>

            {/* Priorité */}
            <td style={tdStyle}>
                <span style={{ ...prioriteCfg.style, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 500, whiteSpace: "nowrap" }}>
                    {prioriteCfg.label}
                </span>
            </td>

            {/* Statut */}
            <td style={tdStyle}>
                <span style={{ ...statutCfg.style, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 500, whiteSpace: "nowrap" }}>
                    {statutCfg.label}
                </span>
            </td>

            {/* Critères */}
            <td style={tdStyle}>
                <span style={{ fontSize: 12, color: us.criteres?.length > 0 ? "var(--color-text-success)" : "var(--color-text-tertiary)" }}>
                    {us.criteres?.length > 0
                        ? `${us.criteres.length} critère${us.criteres.length > 1 ? "s" : ""}`
                        : "Aucun"
                    }
                </span>
            </td>

            {/* Taiga */}
            <td style={tdStyle}>
                {us.taigaId ? (
                    <span style={{ fontSize: 11, color: "#0D9F6E", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
                        <CheckCircle size={12} />
                        #{us.taigaRef || us.taigaId}
                    </span>
                ) : (
                    <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>—</span>
                )}
            </td>

            {/* Actions */}
            <td style={tdStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>

                    {/* Exporter */}
                    <button
                        onClick={onExporter}
                        title={taigaConnecte ? "Exporter vers Taiga" : "Connectez-vous d'abord à Taiga"}
                        style={{
                            display: "flex", alignItems: "center", gap: 4,
                            padding: "5px 10px",
                            background: us.taigaId ? "#E1F5EE" : (taigaConnecte ? "#E1F5EE" : "var(--color-background-secondary)"),
                            color: us.taigaId ? "#085041" : (taigaConnecte ? "#0F6E56" : "var(--color-text-tertiary)"),
                            border: `1px solid ${us.taigaId ? "#5DCAA5" : (taigaConnecte ? "#9FE1CB" : "var(--color-border-tertiary)")}`,
                            borderRadius: "var(--border-radius-md)",
                            cursor: "pointer", fontSize: 12, fontWeight: 500,
                            transition: "all 0.15s",
                        }}
                    >
                        <ExternalLink size={12} />
                        {us.taigaId ? "Ré-exporter" : "Exporter"}
                    </button>

                    {/* Éditer */}
                    <Link
                        to={`/dashboard/phase4/form?id=${us.id}`}
                        style={{
                            display: "flex", alignItems: "center",
                            padding: "5px 8px",
                            border: "1px solid var(--color-border-tertiary)",
                            borderRadius: "var(--border-radius-md)",
                            color: "var(--color-text-secondary)",
                            textDecoration: "none", transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#185FA5"; e.currentTarget.style.color = "#185FA5"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-border-tertiary)"; e.currentTarget.style.color = "var(--color-text-secondary)"; }}
                    >
                        <Edit size={13} />
                    </Link>

                    {/* Supprimer */}
                    <button
                        onClick={onSupprimer}
                        style={{
                            display: "flex", alignItems: "center",
                            padding: "5px 8px",
                            border: "1px solid var(--color-border-tertiary)",
                            borderRadius: "var(--border-radius-md)",
                            background: "none", color: "var(--color-text-tertiary)",
                            cursor: "pointer", transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#A32D2D"; e.currentTarget.style.color = "#A32D2D"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-border-tertiary)"; e.currentTarget.style.color = "var(--color-text-tertiary)"; }}
                    >
                        <Trash2 size={13} />
                    </button>
                </div>
            </td>
        </tr>
    );
}