import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, CheckCircle, ArrowRight, Wifi, WifiOff, Plus, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

import {
    loadBacklog, saveBacklog, deleteUS,
    importerDepuisPhase3,
} from "./components/usStorage";
import { useTaiga } from "../../../hooks/useTaiga";
import { ModaleTaiga }    from "./components/ModaleTaiga";
import { BarreOutils }    from "./components/BarreOutils";
import { LigneUS }        from "./components/LigneUS";
import { AlertesQualite } from "./components/AlertesQualite";

export function Phase4A() {
    const [backlog, setBacklog]               = useState(loadBacklog);
    const [recherche, setRecherche]           = useState("");
    const [filtrePriorite, setFiltrePriorite] = useState("tous");
    const [filtreStatut, setFiltreStatut]     = useState("tous");
    const [filtreOuvert, setFiltreOuvert]     = useState(false);
    const [confirmDelete, setConfirmDelete]   = useState(null);

    const taiga = useTaiga({ onBacklogChange: setBacklog });

    // Persistance auto
    useEffect(() => { saveBacklog(backlog); }, [backlog]);

    // Fermer le filtre en cliquant ailleurs
    useEffect(() => {
        if (!filtreOuvert) return;
        const close = () => setFiltreOuvert(false);
        document.addEventListener("click", close);
        return () => document.removeEventListener("click", close);
    }, [filtreOuvert]);

    // ── Suppression ───────────────────────────────────────────────────────────

    function handleDelete(id) {
        setBacklog(deleteUS(id));
        setConfirmDelete(null);
    }

    // ── Filtrage ──────────────────────────────────────────────────────────────

    const backlogFiltre = useMemo(() => backlog.filter((us) => {
        const q = recherche.toLowerCase();
        const matchQ = !q
            || us.id?.toLowerCase().includes(q)
            || us.acteur?.toLowerCase().includes(q)
            || us.veux?.toLowerCase().includes(q);
        const matchP = filtrePriorite === "tous" || us.priorite === filtrePriorite;
        const matchS = filtreStatut   === "tous" || us.statut   === filtreStatut;
        return matchQ && matchP && matchS;
    }), [backlog, recherche, filtrePriorite, filtreStatut]);

    // ── Alertes qualité ───────────────────────────────────────────────────────

    const alertes = useMemo(() => {
        const liste = [];
        backlog.forEach((us) => {
            if (!us.acteur)                       liste.push({ id: us.id, message: `${us.id} : acteur manquant` });
            if (!us.veux)                         liste.push({ id: us.id, message: `${us.id} : champ "Je veux" vide` });
            if (!us.criteres?.length)             liste.push({ id: us.id, message: `${us.id} : aucun critère d'acceptation` });
        });
        return liste;
    }, [backlog]);

    const nbExportees = backlog.filter((us) => us.taigaId).length;

    // ─────────────────────────────────────────────────────────────────────────

    return (
        <>
            <ModaleTaiga taiga={taiga} />

            {/* Modale confirmation suppression */}
            {confirmDelete && (
                <div style={{
                    position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
                    zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <div style={{
                        background: "var(--color-background-primary)",
                        borderRadius: "var(--border-radius-lg)",
                        border: "1px solid var(--color-border-tertiary)",
                        padding: 24, maxWidth: 380, width: "100%", margin: "0 16px",
                    }}>
                        <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 500, color: "var(--color-text-primary)" }}>
                            Supprimer cette US ?
                        </h3>
                        <p style={{ margin: "0 0 20px", fontSize: 13, color: "var(--color-text-secondary)" }}>
                            Cette action est irréversible. L'US <strong>{confirmDelete}</strong> sera définitivement supprimée.
                        </p>
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                            <button onClick={() => setConfirmDelete(null)} style={{
                                padding: "8px 16px", border: "1px solid var(--color-border-secondary)",
                                borderRadius: "var(--border-radius-md)", background: "none",
                                cursor: "pointer", fontSize: 13, color: "var(--color-text-primary)",
                            }}>Annuler</button>
                            <button onClick={() => handleDelete(confirmDelete)} style={{
                                padding: "8px 16px", background: "#A32D2D", color: "white",
                                border: "none", borderRadius: "var(--border-radius-md)",
                                cursor: "pointer", fontSize: 13, fontWeight: 500,
                            }}>Supprimer</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-6">
                <div className="max-w-7xl mx-auto space-y-5">

                    {/* En-tête */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Backlog US</h1>
                            <p className="text-gray-600">Phase 4A — Gestion des User Stories</p>
                        </div>
                        <button
                            onClick={taiga.ouvrirConnexion}
                            style={{
                                display: "flex", alignItems: "center", gap: 8,
                                padding: "8px 14px",
                                background: taiga.session ? "#0D9F6E" : "var(--color-background-secondary)",
                                color: taiga.session ? "white" : "var(--color-text-secondary)",
                                border: taiga.session ? "none" : "1px solid var(--color-border-secondary)",
                                borderRadius: "var(--border-radius-md)",
                                cursor: "pointer", fontSize: 13, fontWeight: 500,
                            }}
                        >
                            {taiga.session
                                ? <><Wifi size={15} /> Connecté à Taiga ({nbExportees} exportée{nbExportees > 1 ? "s" : ""})</>
                                : <><WifiOff size={15} /> Se connecter à Taiga</>
                            }
                        </button>
                    </div>

                    {/* Barre d'outils */}
                    <BarreOutils
                        recherche={recherche}           setRecherche={setRecherche}
                        filtrePriorite={filtrePriorite} setFiltrePriorite={setFiltrePriorite}
                        filtreStatut={filtreStatut}     setFiltreStatut={setFiltreStatut}
                        filtreOuvert={filtreOuvert}     setFiltreOuvert={(v) => { v && v.stopPropagation?.(); setFiltreOuvert(!filtreOuvert); }}
                    />

                    {/* Tableau */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center justify-between text-base">
                                <span>
                                    User Stories ({backlogFiltre.length}
                                    {backlog.length !== backlogFiltre.length ? `/${backlog.length}` : ""})
                                </span>
                                {(filtrePriorite !== "tous" || filtreStatut !== "tous" || recherche) && (
                                    <button
                                        onClick={() => { setRecherche(""); setFiltrePriorite("tous"); setFiltreStatut("tous"); }}
                                        style={{ fontSize: 12, color: "var(--color-text-tertiary)", background: "none", border: "none", cursor: "pointer" }}
                                    >
                                        Réinitialiser filtres
                                    </button>
                                )}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-0">
                            {backlogFiltre.length === 0 ? (
                                <EtatVide backlogVide={backlog.length === 0} />
                            ) : (
                                <div style={{ overflowX: "auto" }}>
                                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                                        <thead>
                                            <tr style={{ borderBottom: "1px solid var(--color-border-tertiary)" }}>
                                                {["ID", "User Story", "Priorité", "Statut", "Critères", "Taiga", "Actions"].map((h) => (
                                                    <th key={h} style={{
                                                        padding: "10px 16px", textAlign: "left",
                                                        fontWeight: 500, fontSize: 12,
                                                        color: "var(--color-text-tertiary)",
                                                        whiteSpace: "nowrap",
                                                    }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {backlogFiltre.map((us, i) => (
                                                <LigneUS
                                                    key={us.id}
                                                    us={us}
                                                    isLast={i === backlogFiltre.length - 1}
                                                    taigaConnecte={!!taiga.session}
                                                    onExporter={() => taiga.ouvrirExportUS(us)}
                                                    onSupprimer={() => setConfirmDelete(us.id)}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Alertes qualité */}
                    <AlertesQualite alertes={alertes} />

                    {/* Navigation */}
                    <div className="flex gap-3">
                        <Link
                            to="/dashboard/phase4/control"
                            className="ml-auto flex items-center gap-2 px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        >
                            Contrôle cohérence <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                </div>
            </div>
        </>
    );
}

// ─── État vide ────────────────────────────────────────────────────────────────

function EtatVide({ backlogVide }) {
    return (
        <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            padding: "48px 24px", textAlign: "center",
        }}>
            <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "var(--color-background-secondary)",
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
            }}>
                <Search size={24} style={{ color: "var(--color-text-tertiary)" }} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 6 }}>
                {backlogVide ? "Aucune User Story" : "Aucun résultat"}
            </div>
            <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 20, maxWidth: 320 }}>
                {backlogVide
                    ? "Créez votre première US en cliquant sur le bouton \"Nouvelle US\"."
                    : "Aucune US ne correspond à vos critères de filtre ou de recherche."
                }
            </div>
            {backlogVide && (
                <Link to="/dashboard/phase4/form" style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 14px",
                    background: "#185FA5", color: "white",
                    borderRadius: "var(--border-radius-md)",
                    textDecoration: "none", fontSize: 13, fontWeight: 500,
                }}>
                    <Plus size={14} /> Nouvelle US
                </Link>
            )}
        </div>
    );
}