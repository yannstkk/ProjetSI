import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Plus, Trash2, Sparkles, Check, ChevronDown, Save, PlusCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { loadBacklog, saveBacklog } from "./components/usStorage";
import { authFetch } from "../../../services/authFetch";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadActeursPhase2() {
    try {
        const raw = sessionStorage.getItem("phase2_acteurs");
        if (!raw) return [];
        return JSON.parse(raw).map((a) => a.nom).filter(Boolean);
    } catch { return []; }
}

function loadFluxPhase2() {
    try {
        const raw = sessionStorage.getItem("phase2_mfc");
        if (!raw) return [];
        return JSON.parse(raw).flux || [];
    } catch { return []; }
}

function genId(backlog) {
    const nums = backlog
        .map((us) => parseInt(us.id?.replace("US-", ""), 10))
        .filter((n) => !isNaN(n));
    const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    return `US-${String(next).padStart(3, "0")}`;
}

const PRIORITE_OPTIONS = [
    { value: "haute",   label: "Haute",   className: "bg-red-100 text-red-700 border-red-200" },
    { value: "moyenne", label: "Moyenne", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    { value: "basse",   label: "Basse",   className: "bg-green-100 text-green-700 border-green-200" },
];

// ─── Composant principal ──────────────────────────────────────────────────────

export function Phase4B() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get("id");

    const acteurs2 = loadActeursPhase2();
    const flux2    = loadFluxPhase2();

    // ── État formulaire ───────────────────────────────────────────────────────
    const [form, setForm] = useState(() => {
        if (editId) {
            const backlog = loadBacklog();
            const existing = backlog.find((us) => us.id === editId);
            if (existing) return {
                acteur:      existing.acteur   || "",
                acteurLibre: "",
                veux:        existing.veux     || "",
                afin:        existing.afin     || "",
                priorite:    existing.priorite || "moyenne",
                criteres:    existing.criteres || [],
                flux:        existing.flux     || [],
            };
        }
        return {
            acteur:      "",
            acteurLibre: "",
            veux:        "",
            afin:        "",
            priorite:    "moyenne",
            criteres:    [],
            flux:        [],
        };
    });

    const [iaLoading, setIaLoading] = useState(false);
    const [iaError, setIaError]     = useState("");
    const [error, setError]         = useState("");
    const [toast, setToast]         = useState("");

    function showToast(msg) {
        setToast(msg);
        setTimeout(() => setToast(""), 2500);
    }

    // ── Handlers ──────────────────────────────────────────────────────────────

    function updateField(field, value) {
        setForm((p) => ({ ...p, [field]: value }));
    }

    function addCritere() {
        setForm((p) => ({ ...p, criteres: [...p.criteres, ""] }));
    }

    function updateCritere(index, value) {
        setForm((p) => {
            const updated = [...p.criteres];
            updated[index] = value;
            return { ...p, criteres: updated };
        });
    }

    function removeCritere(index) {
        setForm((p) => ({
            ...p,
            criteres: p.criteres.filter((_, i) => i !== index),
        }));
    }

    function toggleFlux(fluxNom) {
        setForm((p) => {
            const already = p.flux.includes(fluxNom);
            return {
                ...p,
                flux: already
                    ? p.flux.filter((f) => f !== fluxNom)
                    : [...p.flux, fluxNom],
            };
        });
    }

    // Résout l'acteur final (saisie libre ou select)
    function getActeurFinal() {
        if (form.acteur === "__autre__") return form.acteurLibre.trim();
        return form.acteur.trim();
    }

    // ── Génération IA critères ────────────────────────────────────────────────

    async function genererCriteres() {
        const acteurFinal = getActeurFinal();
        if (!acteurFinal && !form.veux) {
            setIaError("Remplissez au moins 'En tant que' et 'Je veux' avant de générer.");
            return;
        }
        setIaLoading(true);
        setIaError("");
        try {
            const res = await authFetch("/api/mistral/generer-criteres", {
                method: "POST",
                body: JSON.stringify({
                    acteur: acteurFinal,
                    veux:   form.veux,
                    afin:   form.afin,
                }),
            });
            if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
            const data = await res.json();
            const nouveaux = (data.criteres || []).filter(Boolean);
            if (nouveaux.length === 0) throw new Error("Aucun critère généré.");
            setForm((p) => ({ ...p, criteres: [...p.criteres, ...nouveaux] }));
            showToast(`${nouveaux.length} critères générés ✓`);
        } catch (e) {
            setIaError(e.message || "Erreur lors de la génération.");
        } finally {
            setIaLoading(false);
        }
    }

    // ── Sauvegarde ────────────────────────────────────────────────────────────

    function buildUS(id) {
        const acteurFinal = getActeurFinal();
        const existing = editId ? loadBacklog().find((u) => u.id === editId) : null;
        return {
            id,
            acteur:   acteurFinal,
            veux:     form.veux.trim(),
            afin:     form.afin.trim(),
            priorite: form.priorite,
            statut:   existing?.statut || "brouillon",
            criteres: form.criteres.filter((c) => c.trim()),
            flux:     form.flux,
            source:   existing?.source || "manuel",
            taigaId:  existing?.taigaId,
            taigaRef: existing?.taigaRef,
        };
    }

    function sauvegarder(andNew = false) {
        const acteurFinal = getActeurFinal();
        if (!acteurFinal || !form.veux.trim()) {
            setError("Les champs 'En tant que' et 'Je veux' sont obligatoires.");
            return;
        }
        setError("");
        const backlog = loadBacklog();
        let updated;
        if (editId) {
            updated = backlog.map((us) => us.id === editId ? buildUS(editId) : us);
            showToast("User Story mise à jour ✓");
        } else {
            const newId = genId(backlog);
            updated = [...backlog, buildUS(newId)];
            showToast("User Story créée ✓");
        }
        saveBacklog(updated);

        if (andNew) {
            setForm({
                acteur: "", acteurLibre: "", veux: "", afin: "",
                priorite: "moyenne", criteres: [], flux: [],
            });
            setError("");
            navigate("/dashboard/phase4/form", { replace: true });
        } else {
            setTimeout(() => navigate("/dashboard/phase4/backlog"), 500);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────

    return (
        <div className="p-6">
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Titre */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            {editId ? `Modifier ${editId}` : "Nouvelle User Story"}
                        </h1>
                        <p className="text-gray-600">
                            Phase 4 — Formulaire User Story
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {!editId && (
                            <button
                                onClick={() => sauvegarder(true)}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                            >
                                <PlusCircle className="w-4 h-4" />
                                Sauvegarder et créer une autre
                            </button>
                        )}
                        <button
                            onClick={() => sauvegarder(false)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                        >
                            <Save className="w-4 h-4" />
                            {editId ? "Enregistrer" : "Sauvegarder"}
                        </button>
                    </div>
                </div>

                {/* Erreur globale */}
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {/* Section 1 — Format US */}
                <Card className="border-l-4 border-l-blue-600">
                    <CardHeader>
                        <CardTitle>Format User Story</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">

                        {/* En tant que */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                En tant que <span className="text-red-500">*</span>
                            </label>
                            {acteurs2.length > 0 ? (
                                <div className="space-y-2">
                                    <div className="relative">
                                        <select
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none bg-white pr-8"
                                            value={form.acteur}
                                            onChange={(e) => {
                                                updateField("acteur", e.target.value);
                                                // Reset saisie libre si on change de sélection
                                                if (e.target.value !== "__autre__") {
                                                    updateField("acteurLibre", "");
                                                }
                                            }}
                                        >
                                            <option value="">Sélectionner un acteur...</option>
                                            {acteurs2.map((a) => (
                                                <option key={a} value={a}>{a}</option>
                                            ))}
                                            <option value="__autre__">Autre (saisie libre)</option>
                                        </select>
                                        <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                                    </div>
                                    {/* Champ saisie libre — affiché uniquement si "Autre" est sélectionné */}
                                    {form.acteur === "__autre__" && (
                                        <Input
                                            placeholder="Saisir l'acteur manuellement..."
                                            value={form.acteurLibre}
                                            onChange={(e) => updateField("acteurLibre", e.target.value)}
                                            autoFocus
                                        />
                                    )}
                                </div>
                            ) : (
                                <Input
                                    placeholder="Ex: Comptable, Responsable RH..."
                                    value={form.acteur}
                                    onChange={(e) => updateField("acteur", e.target.value)}
                                />
                            )}
                        </div>

                        {/* Je veux */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Je veux <span className="text-red-500">*</span>
                            </label>
                            <Input
                                placeholder="Décrire le besoin fonctionnel..."
                                value={form.veux}
                                onChange={(e) => updateField("veux", e.target.value)}
                            />
                        </div>

                        {/* Afin de */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Afin de
                            </label>
                            <Input
                                placeholder="Décrire la valeur métier apportée..."
                                value={form.afin}
                                onChange={(e) => updateField("afin", e.target.value)}
                            />
                        </div>

                        {/* Priorité */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Priorité
                            </label>
                            <div className="flex gap-2">
                                {PRIORITE_OPTIONS.map((p) => (
                                    <button
                                        key={p.value}
                                        onClick={() => updateField("priorite", p.value)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                                            form.priorite === p.value
                                                ? p.className
                                                : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                        }`}
                                    >
                                        {form.priorite === p.value && <Check className="w-3 h-3" />}
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </CardContent>
                </Card>

                {/* Section 2 — Critères d'acceptation */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                Critères d'acceptation
                                {form.criteres.filter(c => c.trim()).length > 0 && (
                                    <Badge className="bg-gray-100 text-gray-700 border-0">
                                        {form.criteres.filter(c => c.trim()).length}
                                    </Badge>
                                )}
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">

                        {form.criteres.length === 0 && (
                            <p className="text-sm text-gray-500 italic">
                                Aucun critère — ajoutez-en manuellement ou générez avec l'IA.
                            </p>
                        )}

                        {form.criteres.map((critere, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500 flex-shrink-0">
                                    {index + 1}
                                </div>
                                <Input
                                    placeholder={`Critère ${index + 1}...`}
                                    value={critere}
                                    onChange={(e) => updateCritere(index, e.target.value)}
                                />
                                <button
                                    onClick={() => removeCritere(index)}
                                    className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}

                        {iaError && (
                            <p className="text-sm text-red-600">{iaError}</p>
                        )}

                        <div className="flex items-center gap-3 pt-1">
                            <button
                                onClick={addCritere}
                                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Ajouter un critère
                            </button>

                            <button
                                onClick={genererCriteres}
                                disabled={iaLoading}
                                className="flex items-center gap-2 text-sm px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-300 transition-colors ml-auto"
                            >
                                {iaLoading
                                    ? <><Loader2 className="w-3 h-3 animate-spin" /> Génération...</>
                                    : <><Sparkles className="w-3 h-3" /> Générer avec l'IA</>
                                }
                            </button>
                        </div>

                    </CardContent>
                </Card>

                {/* Section 3 — Flux MFC */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Flux MFC concernés</span>
                            {flux2.length > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                    Depuis Phase 2
                                </Badge>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {flux2.length === 0 ? (
                            <p className="text-sm text-gray-500">
                                Aucun flux détecté — importez un diagramme MFC en Phase 2.
                            </p>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                {flux2.map((f, i) => {
                                    const selected = form.flux.includes(f.nom);
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => toggleFlux(f.nom)}
                                            className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-colors ${
                                                selected
                                                    ? "bg-blue-50 border-blue-300"
                                                    : "bg-gray-50 border-gray-200 hover:border-gray-300"
                                            }`}
                                        >
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                                                selected ? "bg-blue-600 border-blue-600" : "border-gray-300"
                                            }`}>
                                                {selected && <Check className="w-2.5 h-2.5 text-white" />}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{f.nom}</div>
                                                {(f.emetteur || f.recepteur) && (
                                                    <div className="text-xs text-gray-500 mt-0.5">
                                                        {f.emetteur} → {f.recepteur}
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Actions bas de page */}
                <div className="flex gap-3 pb-6">
                    <Link
                        to="/dashboard/phase4/backlog"
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                        Annuler
                    </Link>
                    <button
                        onClick={() => sauvegarder(false)}
                        className="ml-auto flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
                    >
                        <Save className="w-4 h-4" />
                        {editId ? "Enregistrer les modifications" : "Sauvegarder l'US"}
                    </button>
                </div>

            </div>

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg z-50">
                    <Check className="w-4 h-4 text-green-400" />
                    {toast}
                </div>
            )}
        </div>
    );
}