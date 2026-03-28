import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ArrowRight, Plus, Wifi, WifiOff, Loader2, Database, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

import {
    loadBacklog, saveBacklog, deleteUS,
} from "./components/usStorage";
import { loadUSFromDb, saveUSToDb, deleteUSFromDb } from "../../../services/usService";
import { getProjetCourant } from "../../../services/projetCourant";
import { useTaiga } from "../../../hooks/useTaiga";
import { ModaleTaiga }    from "./components/ModaleTaiga";
import { LigneUS }        from "./components/LigneUS";
import { AlertesQualite } from "./components/AlertesQualite";

export function Phase4A() {
    // L'état React EST la source de vérité — on le charge depuis sessionStorage
    const [backlog, setBacklog]               = useState(loadBacklog);
    const [recherche, setRecherche]           = useState("");
    const [filtrePriorite, setFiltrePriorite] = useState("tous");
    const [confirmDelete, setConfirmDelete]   = useState(null);

    const [dbLoading, setDbLoading]   = useState(false);
    const [dbError, setDbError]       = useState("");
    const [dbLoadDone, setDbLoadDone] = useState(false);

    // Flag pour ne charger la BDD qu'une seule fois au montage initial
    const dbLoadedRef = useRef(false);

    const location = useLocation();

    const taiga = useTaiga({ onBacklogChange: setBacklog });

    // ── Persistance sessionStorage : l'état React → sessionStorage ────────────
    useEffect(() => {
        saveBacklog(backlog);
    }, [backlog]);

    // ── Rechargement depuis sessionStorage quand on revient sur cette page ────
    // Quand Phase4B sauvegarde dans sessionStorage et navigue ici,
    // on resynchronise l'état React avec le sessionStorage à jour
    useEffect(() => {
        const fresh = loadBacklog();
        setBacklog(fresh);
    }, [location.key]); // se déclenche à chaque navigation vers cette page

    // ── Chargement BDD une seule fois au premier montage ─────────────────────
    useEffect(() => {
        if (dbLoadedRef.current) return;
        dbLoadedRef.current = true;

        const projet = getProjetCourant();
        if (!projet?.id) return;

        setDbLoading(true);
        setDbError("");

        loadUSFromDb(projet.id)
            .then((usDb) => {
                if (usDb.length === 0) {
                    setDbLoadDone(true);
                    return;
                }

                setBacklog((prev) => {
                    // Index du backlog local par id
                    const localById = Object.fromEntries(prev.map((us) => [us.id, us]));

                    // Pour chaque US BDD : on l'ajoute seulement si absente localement
                    // Si elle existe déjà localement → on garde la version locale (plus fraîche)
                    // et on enrichit juste avec dbId si manquant
                    usDb.forEach((usFromDb) => {
                        if (localById[usFromDb.id]) {
                            // US existe localement → enrichir avec dbId uniquement
                            localById[usFromDb.id] = {
                                ...localById[usFromDb.id],          // ← version locale garde la priorité
                                dbId:     usFromDb.dbId,            // ← on récupère le dbId BDD
                                taigaRef: localById[usFromDb.id].taigaRef || usFromDb.taigaRef,
                                taigaId:  localById[usFromDb.id].taigaId  || usFromDb.taigaId,
                            };
                        } else {
                            // US absente localement → on l'ajoute depuis la BDD
                            localById[usFromDb.id] = usFromDb;
                        }
                    });

                    return Object.values(localById);
                });

                setDbLoadDone(true);
            })
            .catch((err) => {
                setDbError("Impossible de charger les US depuis la BDD : " + err.message);
                setDbLoadDone(true);
            })
            .finally(() => setDbLoading(false));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Stocker une US en BDD ─────────────────────────────────────────────────
    // On utilise directement le state React courant — c'est la source de vérité
    async function handleStockerBdd(us) {
        const projet = getProjetCourant();
        if (!projet?.id) throw new Error("Aucun projet sélectionné.");

        // Prendre la version courante depuis le state React
        // (qui est synchronisé avec sessionStorage via location.key)
        const usCourante = backlog.find((u) => u.id === us.id) || us;

        const usUpdated = await saveUSToDb(usCourante, projet.id);

        setBacklog((prev) =>
            prev.map((item) => (item.id === us.id ? usUpdated : item))
        );
    }

    // ── Rechargement manuel depuis BDD ────────────────────────────────────────
    async function handleRechargerBdd() {
        const projet = getProjetCourant();
        if (!projet?.id) return;

        setDbLoading(true);
        setDbError("");

        try {
            const usDb = await loadUSFromDb(projet.id);
            // Rechargement manuel : la BDD remplace tout
            setBacklog(usDb);
        } catch (err) {
            setDbError("Erreur rechargement BDD : " + err.message);
        } finally {
            setDbLoading(false);
        }
    }

    // ── Suppression ───────────────────────────────────────────────────────────
    async function handleDelete(id) {
        const us = backlog.find((u) => u.id === id);

        if (us?.dbId) {
            try { await deleteUSFromDb(us.dbId); } catch { /* non bloquant */ }
        }

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
    const nbStockees  = backlog.filter((us) => us.dbId).length;

    return (
        <>
            <ModaleTaiga taiga={taiga} />

            {confirmDelete && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-sm w-full mx-4 shadow-lg">
                        <h3 className="font-semibold text-gray-900 mb-2">Supprimer cette US ?</h3>
                        <p className="text-sm text-gray-600 mb-5">
                            L'US <strong>{confirmDelete}</strong> sera définitivement supprimée
                            {backlog.find((u) => u.id === confirmDelete)?.dbId
                                ? " (et retirée de la base de données)" : ""}.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setConfirmDelete(null)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                                Annuler
                            </button>
                            <button onClick={() => handleDelete(confirmDelete)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 font-medium">
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-6">
                <div className="max-w-7xl mx-auto space-y-5">

                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Backlog US</h1>
                            <p className="text-gray-600">Phase 4 — Gestion des User Stories</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleRechargerBdd}
                                disabled={dbLoading}
                                title="Recharger les US depuis la base de données"
                                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            >
                                {dbLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                                {dbLoading ? "Chargement..." : "Sync BDD"}
                            </button>

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
                    </div>

                    {dbLoading && (
                        <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
                            <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                            Chargement des User Stories depuis la base de données...
                        </div>
                    )}

                    {dbError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {dbError}
                        </div>
                    )}

                    {dbLoadDone && !dbLoading && nbStockees > 0 && (
                        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm">
                            <Database className="w-4 h-4 flex-shrink-0" />
                            <span>
                                <strong>{nbStockees}</strong> US stockée{nbStockees > 1 ? "s" : ""} en base de données
                                {backlog.length > nbStockees && (
                                    <span className="text-emerald-500 ml-1">
                                        · {backlog.length - nbStockees} uniquement en session
                                    </span>
                                )}
                            </span>
                        </div>
                    )}

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
                                <div className="flex gap-2">
                                    {["tous", "haute", "moyenne", "basse"].map((p) => (
                                        <button key={p} onClick={() => setFiltrePriorite(p)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                                                filtrePriorite === p
                                                    ? "bg-gray-900 text-white border-gray-900"
                                                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                            }`}>
                                            {p === "tous" ? "Toutes" : p.charAt(0).toUpperCase() + p.slice(1)}
                                        </button>
                                    ))}
                                </div>
                                <Link to="/dashboard/phase4/form"
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium ml-auto">
                                    <Plus className="w-4 h-4" />
                                    Nouvelle US
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center justify-between text-base">
                                <span>
                                    User Stories ({backlogFiltre.length}
                                    {backlog.length !== backlogFiltre.length ? `/${backlog.length}` : ""})
                                </span>
                                {(filtrePriorite !== "tous" || recherche) && (
                                    <button onClick={() => { setRecherche(""); setFiltrePriorite("tous"); }}
                                        className="text-xs text-gray-400 hover:text-gray-600">
                                        Réinitialiser filtres
                                    </button>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {backlogFiltre.length === 0 ? (
                                <EtatVide backlogVide={backlog.length === 0} dbLoading={dbLoading} />
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                {["ID", "User Story", "Priorité", "Critères", "Actions"].map((h) => (
                                                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>
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
                                                    onStockerBdd={handleStockerBdd}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <AlertesQualite alertes={alertes} />

                    <div className="flex gap-3">
                        <Link to="/dashboard/phase4/control"
                            className="ml-auto flex items-center gap-2 px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                            Contrôle cohérence <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                </div>
            </div>
        </>
    );
}

function EtatVide({ backlogVide, dbLoading }) {
    if (dbLoading) {
        return (
            <div className="flex flex-col items-center py-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400 mb-3" />
                <p className="text-sm text-gray-500">Chargement depuis la base de données...</p>
            </div>
        );
    }
    return (
        <div className="flex flex-col items-center py-12 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-gray-400" />
            </div>
            <p className="font-medium text-gray-900 mb-1">
                {backlogVide ? "Aucune User Story" : "Aucun résultat"}
            </p>
            <p className="text-sm text-gray-500 mb-5 max-w-xs">
                {backlogVide ? "Créez votre première US via le formulaire." : "Aucune US ne correspond à votre recherche."}
            </p>
            {backlogVide && (
                <Link to="/dashboard/phase4/form"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    <Plus className="w-4 h-4" />
                    Nouvelle US
                </Link>
            )}
        </div>
    );
}