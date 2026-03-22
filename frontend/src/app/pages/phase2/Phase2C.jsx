import { useMemo } from "react";
import { Link } from "react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { loadActeurs } from "./components/helpers/acteurIA";
import { loadMFC } from "./components/helpers/mfcStorage";

import { StatsBarre } from "./components/StatsBarre";
import { CarteCoherence } from "./components/CarteCoherence";
import { CarteAlertes } from "./components/CarteAlertes";
import { MatriceActeursFlux } from "./components/MatriceActeursFlux";

// ─── Logique de cohérence ─────────────────────────────────────────────────────

function calculerCoherence(acteurs2A, mfc2B) {
    const flux = mfc2B?.flux || [];
    const acteursMFC = mfc2B?.acteurs || [];

    // Ensembles de noms normalisés
    const nomsActeurs2A = new Set(acteurs2A.map((a) => a.nom.toLowerCase()));
    const nomsActeursMFC = new Set(acteursMFC.map((a) => a.nom.toLowerCase()));

    // Acteurs cohérents : déclarés en 2A ET présents dans les flux
    const coherents = acteurs2A.filter((a) =>
        nomsActeursMFC.has(a.nom.toLowerCase())
    );

    // Alertes
    const alertes = [];

    // Orphelins : déclarés en 2A mais absents des flux
    acteurs2A
        .filter((a) => !nomsActeursMFC.has(a.nom.toLowerCase()))
        .forEach((a) =>
            alertes.push({ nom: a.nom, type: "orphelin" })
        );

    // Fantômes : dans les flux MFC mais non déclarés en 2A
    acteursMFC
        .filter((a) => !nomsActeurs2A.has(a.nom.toLowerCase()))
        .forEach((a) =>
            alertes.push({ nom: a.nom, type: "fantome" })
        );

    // Sans rôle : déclarés en 2A sans rôle défini
    acteurs2A
        .filter((a) => !a.role?.trim())
        .forEach((a) =>
            alertes.push({ nom: a.nom, type: "sansRole" })
        );

    return { coherents, alertes, flux };
}

// ─── Composant principal ──────────────────────────────────────────────────────

export function Phase2C() {
    const acteurs2A = useMemo(() => loadActeurs(), []);
    const mfc2B     = useMemo(() => loadMFC(), []);

    const { coherents, alertes, flux } = useMemo(
        () => calculerCoherence(acteurs2A, mfc2B),
        [acteurs2A, mfc2B]
    );

    const peutValider = alertes.filter(
        (a) => a.type === "orphelin" || a.type === "fantome"
    ).length === 0;

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Titre */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Résultat contrôle cohérence
                    </h1>
                    <p className="text-gray-600">
                        Phase 2C — Vérification du périmètre Acteurs ↔ Flux MFC
                    </p>
                </div>

                {/* Stats rapides */}
                <StatsBarre
                    nbActeurs={acteurs2A.length}
                    nbFlux={flux.length}
                    nbAlertes={alertes.length}
                    nbCoherents={coherents.length}
                />

                {/* Deux colonnes : cohérents + alertes */}
                <div className="grid grid-cols-2 gap-4">
                    <CarteCoherence acteurs={coherents} />
                    <CarteAlertes alertes={alertes} />
                </div>

                {/* Matrice */}
                <MatriceActeursFlux acteurs={acteurs2A} flux={flux} />

                {/* Bandeau validation */}
                {!peutValider && (
                    <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl text-sm text-orange-800">
                        <span className="font-medium">
                            ⚠ Résolvez les alertes orphelins et fantômes avant de valider la Phase 2.
                        </span>
                        <div className="ml-auto flex gap-2">
                            <Link
                                to="/dashboard/phase2/actors"
                                className="px-3 py-1.5 bg-white border border-orange-300 rounded-lg hover:bg-orange-50 text-orange-700 font-medium"
                            >
                                Corriger acteurs
                            </Link>
                            <Link
                                to="/dashboard/phase2/flows"
                                className="px-3 py-1.5 bg-white border border-orange-300 rounded-lg hover:bg-orange-50 text-orange-700 font-medium"
                            >
                                Corriger flux
                            </Link>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className="flex gap-3">
                    <Link
                        to="/dashboard/phase2/flows"
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour aux flux
                    </Link>

                    <Link
                        to="/dashboard/phase3/classification"
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors font-medium ml-auto ${
                            peutValider
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none"
                        }`}
                    >
                        Valider Phase 2
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

            </div>
        </div>
    );
}