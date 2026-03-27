import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Plus, Wifi, WifiOff, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

import {
    loadBacklog, saveBacklog, deleteUS,
} from "./components/usStorage";
import { useTaiga } from "../../../hooks/useTaiga";
import { ModaleTaiga }    from "./components/ModaleTaiga";
import { BarreOutils }    from "./components/BarreOutils";
import { LigneUS }        from "./components/LigneUS";
import { AlertesQualite } from "./components/AlertesQualite";

export function Phase4A() {
    const [backlog, setBacklog]             = useState(loadBacklog);
    const [recherche, setRecherche]         = useState("");
    const [filtrePriorite, setFiltrePriorite] = useState("tous");
    const [filtreOuvert, setFiltreOuvert]   = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null);

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
        return matchQ && matchP;
    }), [backlog, recherche, filtrePriorite]);

    // ── Alertes qualité ───────────────────────────────────────────────────────

    const alertes = useMemo(() => {
        const liste = [];
        backlog.forEach((us) => {
            if (!us.acteur) liste.push({ id: us.id, message: `${us.id} : acteur manquant` });
            if (!us.veux)   liste.push({ id: us.id, message: `${us.id} : champ "Je veux" vide` });
            if (!us.criteres?.length) liste.push({ id: us.id, message: `${us.id} : aucun critère d'acceptation` });
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
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-sm w-full mx-4 shadow-lg">
                        <h3 className="font-semibold text-gray-900 mb-2">
                            Supprimer cette US ?
                        </h3>
                        <p className="text-sm text-gray-600 mb-5">
                            L'US <strong>{confirmDelete}</strong> sera définitivement supprimée.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={() => handleDelete(confirmDelete)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors font-medium"
                            >
                                Supprimer
                            </button>
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
                            <p className="text-gray-600">Phase 4 — Gestion des User Stories</p>
                        </div>
                        <button
                            onClick={taiga.ouvrirConnexion}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                taiga.session
                                    ? "bg-green-600 text-white hover:bg-green-700"
                                    : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            {taiga.session
                                ? <><Wifi className="w-4 h-4" /> Connecté à Taiga {nbExportees > 0 && `(${nbExportees} exportée${nbExportees > 1 ? "s" : ""})`}</>
                                : <><WifiOff className="w-4 h-4" /> Se connecter à Taiga</>
                            }
                        </button>
                    </div>

                    {/* Barre d'outils simplifiée — sans filtre statut */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="relative flex-1">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        placeholder="Rechercher par ID, acteur, besoin..."
                                        value={recherche}
                                        onChange={(e) => setRecherche(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                                    />
                                </div>

                                {/* Filtre priorité uniquement */}
                                <div className="flex gap-2">
                                    {["tous", "haute", "moyenne", "basse"].map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setFiltrePriorite(p)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                                                filtrePriorite === p
                                                    ? "bg-gray-900 text-white border-gray-900"
                                                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                            }`}
                                        >
                                            {p === "tous" ? "Toutes" : p.charAt(0).toUpperCase() + p.slice(1)}
                                        </button>
                                    ))}
                                </div>

                                <Link
                                    to="/dashboard/phase4/form"
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium ml-auto"
                                >
                                    <Plus className="w-4 h-4" />
                                    Nouvelle US
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tableau */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center justify-between text-base">
                                <span>
                                    User Stories ({backlogFiltre.length}
                                    {backlog.length !== backlogFiltre.length ? `/${backlog.length}` : ""})
                                </span>
                                {(filtrePriorite !== "tous" || recherche) && (
                                    <button
                                        onClick={() => { setRecherche(""); setFiltrePriorite("tous"); }}
                                        className="text-xs text-gray-400 hover:text-gray-600"
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
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                {["ID", "User Story", "Priorité", "Critères", "Actions"].map((h) => (
                                                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">
                                                        {h}
                                                    </th>
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
        <div className="flex flex-col items-center py-12 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-gray-400" />
            </div>
            <p className="font-medium text-gray-900 mb-1">
                {backlogVide ? "Aucune User Story" : "Aucun résultat"}
            </p>
            <p className="text-sm text-gray-500 mb-5 max-w-xs">
                {backlogVide
                    ? "Créez votre première US via le formulaire."
                    : "Aucune US ne correspond à votre recherche."
                }
            </p>
            {backlogVide && (
                <Link
                    to="/dashboard/phase4/form"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Nouvelle US
                </Link>
            )}
        </div>
    );
}