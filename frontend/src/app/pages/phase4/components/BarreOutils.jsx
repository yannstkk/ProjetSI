import { Link } from "react-router-dom";
import { Search, Filter, Plus, ChevronDown } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";

export const PRIORITE_CONFIG = {
    haute:   { label: "Haute",   style: { background: "#FCEBEB", color: "#A32D2D", border: "1px solid #F09595" } },
    moyenne: { label: "Moyenne", style: { background: "#FAEEDA", color: "#633806", border: "1px solid #FAC775" } },
    basse:   { label: "Basse",   style: { background: "#EAF3DE", color: "#27500A", border: "1px solid #C0DD97" } },
};

export const STATUT_CONFIG = {
    brouillon:   { label: "Brouillon",   style: { background: "#F1EFE8", color: "#444441", border: "1px solid #D3D1C7" } },
    en_revision: { label: "En révision", style: { background: "#E6F1FB", color: "#0C447C", border: "1px solid #85B7EB" } },
    validee:     { label: "Validée",     style: { background: "#EAF3DE", color: "#27500A", border: "1px solid #C0DD97" } },
};

export function BarreOutils({
    recherche, setRecherche,
    filtrePriorite, setFiltrePriorite,
    filtreStatut, setFiltreStatut,
    filtreOuvert, setFiltreOuvert,
}) {
    const filtresActifs = filtrePriorite !== "tous" || filtreStatut !== "tous";

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center gap-3 flex-wrap">

                    <div className="relative flex-1 min-w-48">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="Rechercher par ID, acteur, besoin..."
                            value={recherche}
                            onChange={(e) => setRecherche(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div style={{ position: "relative" }}>
                        <button
                            onClick={() => setFiltreOuvert(!filtreOuvert)}
                            style={{
                                display: "flex", alignItems: "center", gap: 6,
                                padding: "8px 12px",
                                border: "1px solid var(--color-border-secondary)",
                                borderRadius: "var(--border-radius-md)",
                                background: filtresActifs ? "var(--color-background-info)" : "var(--color-background-primary)",
                                cursor: "pointer", fontSize: 13,
                                color: "var(--color-text-primary)",
                            }}
                        >
                            <Filter size={14} />
                            Filtres
                            {filtresActifs && (
                                <span style={{
                                    background: "#185FA5", color: "white",
                                    borderRadius: 10, fontSize: 10,
                                    padding: "1px 6px", fontWeight: 500,
                                }}>
                                    {[filtrePriorite !== "tous", filtreStatut !== "tous"].filter(Boolean).length}
                                </span>
                            )}
                            <ChevronDown size={12} />
                        </button>

                        {filtreOuvert && (
                            <div style={{
                                position: "absolute", top: "calc(100% + 6px)", left: 0,
                                background: "var(--color-background-primary)",
                                border: "1px solid var(--color-border-secondary)",
                                borderRadius: "var(--border-radius-md)",
                                padding: 14, zIndex: 20, minWidth: 200,
                                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            }}>
                                <div style={{ marginBottom: 12 }}>
                                    <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                        Priorité
                                    </div>
                                    {["tous", "haute", "moyenne", "basse"].map((p) => (
                                        <label key={p} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, cursor: "pointer", fontSize: 13, color: "var(--color-text-primary)" }}>
                                            <input type="radio" name="priorite" value={p}
                                                checked={filtrePriorite === p}
                                                onChange={() => setFiltrePriorite(p)} />
                                            {p === "tous" ? "Toutes" : PRIORITE_CONFIG[p]?.label}
                                        </label>
                                    ))}
                                </div>
                                <div>
                                    <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                        Statut
                                    </div>
                                    {["tous", "brouillon", "en_revision", "validee"].map((s) => (
                                        <label key={s} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, cursor: "pointer", fontSize: 13, color: "var(--color-text-primary)" }}>
                                            <input type="radio" name="statut" value={s}
                                                checked={filtreStatut === s}
                                                onChange={() => setFiltreStatut(s)} />
                                            {s === "tous" ? "Tous" : STATUT_CONFIG[s]?.label}
                                        </label>
                                    ))}
                                </div>
                                <button
                                    onClick={() => { setFiltrePriorite("tous"); setFiltreStatut("tous"); setFiltreOuvert(false); }}
                                    style={{ marginTop: 10, fontSize: 12, color: "var(--color-text-tertiary)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                                >
                                    Effacer les filtres
                                </button>
                            </div>
                        )}
                    </div>

                    <Link
                        to="/dashboard/phase4/form"
                        style={{
                            display: "flex", alignItems: "center", gap: 6,
                            padding: "8px 14px",
                            background: "#185FA5", color: "white",
                            borderRadius: "var(--border-radius-md)",
                            textDecoration: "none", fontSize: 13, fontWeight: 500,
                            marginLeft: "auto",
                        }}
                    >
                        <Plus size={15} />
                        Nouvelle US
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}