import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Plus, AlertTriangle, CheckCircle, Info, Database, Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { authFetch } from "../../../services/authFetch";
import { getProjetCourant } from "../../../services/projetCourant";
import { BoutonIA } from "../../components/BoutonIA";

import { ActeurModal } from "./components/ActeurModal";
import { ActeurTable } from "./components/ActeurTable";
import { AlerteActeursSansRole } from "./components/AlerteActeursSansRole";
import { loadActeurs, saveActeurs, getNotesTexte, appelDetectionActeurs } from "./components/helpers/acteurIA";

const EMPTY_FORM = { nom: "", role: "", type: "internal" };

export function Phase2A() {
    const [acteurs, setActeurs] = useState(loadActeurs);
    const [iaLoading, setIaLoading] = useState(false);
    const [iaError, setIaError] = useState("");
    const [iaRan, setIaRan] = useState(false);
    const [modal, setModal] = useState(null);
    const [dbLoading, setDbLoading] = useState(false);
    const [dbError, setDbError] = useState("");
    const [dbSuccess, setDbSuccess] = useState(false);

    useEffect(() => { saveActeurs(acteurs); }, [acteurs]);

    async function lancerDetectionIA() {
        const notes = getNotesTexte();
        if (!notes.trim()) {
            setIaError("Aucune note trouvée. Importez un fichier .txt ou saisissez des notes structurées dans la Phase 1 d'abord.");
            return;
        }
        setIaLoading(true);
        setIaError("");
        try {
            const acteursDetectes = await appelDetectionActeurs(notes);
            if (acteursDetectes.length === 0) { setIaError("L'IA n'a détecté aucun acteur dans les notes."); setIaRan(true); return; }
            const nomsExistants = new Set(acteurs.map((a) => a.nom.toLowerCase()));
            const nouveaux = acteursDetectes
                .filter((a) => !nomsExistants.has(a.nom.toLowerCase()))
                .map((a) => ({ id: Date.now() + Math.random(), nom: a.nom, role: a.role || "", type: "internal", source: "ia", phraseSource: a.phraseSource || "" }));
            setActeurs((prev) => [...prev, ...nouveaux]);
            setIaRan(true);
        } catch (err) {
            setIaError("Erreur lors de l'analyse : " + err.message);
        } finally {
            setIaLoading(false);
        }
    }

    async function sauvegarderEnBdd() {
        if (acteurs.length === 0) { setDbError("Aucun acteur à sauvegarder."); return; }
        const projet = getProjetCourant();
        if (!projet?.id) { setDbError("Aucun projet sélectionné."); return; }
        setDbLoading(true); setDbError(""); setDbSuccess(false);
        try {
            const resExistants = await authFetch(`/api/acteur/projet/${projet.id}`);
            const existants = resExistants.ok ? await resExistants.json() : [];
            const nomsExistants = new Set(existants.map((a) => a.nom?.toLowerCase()));
            const aCreer = acteurs.filter((a) => a.nom?.trim() && !nomsExistants.has(a.nom.toLowerCase()));
            await Promise.all(aCreer.map((a) => authFetch("/api/acteur", { method: "POST", body: JSON.stringify({ idProjet: projet.id, nom: a.nom.trim(), type: a.type || "internal", source: a.source || "manuel", role: a.role || "" }) })));
            const resMAJ = await authFetch(`/api/acteur/projet/${projet.id}`);
            if (resMAJ.ok) {
                const acteursDb = await resMAJ.json();
                const acteursLocaux = acteursDb.map((a) => ({ id: a.idActeur, nom: a.nom || "", role: a.role || "", type: a.type || "internal", source: a.source || "bdd", phraseSource: "" }));
                setActeurs(acteursLocaux); saveActeurs(acteursLocaux);
            }
            setDbSuccess(true); setTimeout(() => setDbSuccess(false), 3000);
        } catch (err) {
            setDbError("Erreur lors de la sauvegarde : " + err.message);
        } finally {
            setDbLoading(false);
        }
    }

    function handleSave(acteurModifie) {
        if (acteurModifie.id && acteurs.some((a) => a.id === acteurModifie.id)) {
            setActeurs((prev) => prev.map((a) => (a.id === acteurModifie.id ? acteurModifie : a)));
        } else {
            setActeurs((prev) => [...prev, { ...acteurModifie, id: Date.now(), source: "manuel", phraseSource: "" }]);
        }
        setModal(null);
    }

    function handleDelete(id) { setActeurs((prev) => prev.filter((a) => a.id !== id)); setModal(null); }

    const acteursSansRole = acteurs.filter((a) => !a.role.trim());
    const nbEnBdd = acteurs.filter((a) => a.source === "bdd").length;

    return (
        <>
            {modal && <ActeurModal acteur={modal} onSave={handleSave} onDelete={handleDelete} onClose={() => setModal(null)} />}
            <div className="p-6">
                <div className="max-w-6xl mx-auto space-y-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Acteurs</h1>
                        <p className="text-gray-600">Phase 2A — Identification et qualification des acteurs</p>
                    </div>

                    <Card className="border-l-4 border-l-blue-600">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Info className="w-5 h-5 text-blue-600" />
                                Classification Interne / Externe (obligatoire)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="p-3 bg-blue-50 rounded border border-blue-300">
                                    <div className="font-medium text-blue-900 mb-1">Acteur INTERNE</div>
                                    <div className="text-blue-700">Fait partie de l'organisation et interagit directement avec le système</div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded border border-gray-300">
                                    <div className="font-medium text-gray-900 mb-1">Acteur EXTERNE</div>
                                    <div className="text-gray-700">Extérieur à l'organisation, interagit avec le système</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center gap-3">
                        <BoutonIA onClick={lancerDetectionIA} loading={iaLoading} loadingText="Détection en cours...">
                            Détecter les acteurs avec l'IA
                        </BoutonIA>

                        {iaRan && !iaLoading && (
                            <span className="text-sm text-green-600 flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" /> Détection terminée
                            </span>
                        )}

                        <button onClick={sauvegarderEnBdd} disabled={dbLoading || acteurs.length === 0} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-emerald-300 transition-colors font-medium">
                            {dbLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Sauvegarde...</> : <><Database className="w-4 h-4" />Sauvegarder en BDD</>}
                        </button>

                        <button onClick={() => setModal(EMPTY_FORM)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium ml-auto">
                            <Plus className="w-4 h-4" /> Ajouter manuellement
                        </button>
                    </div>

                    {dbSuccess && <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm"><CheckCircle className="w-4 h-4 flex-shrink-0" />Acteurs sauvegardés en base de données avec succès.</div>}
                    {dbError && <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"><AlertTriangle className="w-4 h-4 flex-shrink-0" />{dbError}</div>}
                    {nbEnBdd > 0 && !dbSuccess && <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm"><Database className="w-4 h-4 flex-shrink-0" /><span><strong>{nbEnBdd}</strong> acteur{nbEnBdd > 1 ? "s" : ""} chargé{nbEnBdd > 1 ? "s" : ""} depuis la base de données.</span></div>}
                    {iaError && <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"><AlertTriangle className="w-4 h-4 flex-shrink-0" />{iaError}</div>}

                    <ActeurTable acteurs={acteurs} onEditer={(acteur) => setModal(acteur)} />
                    <AlerteActeursSansRole acteurs={acteursSansRole} onQualifier={(acteur) => setModal(acteur)} />

                    <div className="flex gap-3">
                        <Link to="/dashboard/phase2/flows" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium ml-auto">Flux MFC →</Link>
                    </div>
                </div>
            </div>
        </>
    );
}