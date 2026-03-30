import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Upload, FileText, X, ArrowRight, Database, Loader2, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { authFetch } from "../../../services/authFetch";
import { getProjetCourant } from "../../../services/projetCourant";
import { loadBpmn, saveBpmn, clearBpmn } from "./helpers/bpmnStorage";

export function Phase6A() {
    const saved = loadBpmn();

    const [fichiers, setFichiers] = useState(saved?.fichiers || []);
    const [selected, setSelected] = useState(saved?.selected || null);
    const [titre, setTitre] = useState(saved?.titre || "");
    const [dragging, setDragging] = useState(false);
    const [dbLoading, setDbLoading] = useState(false);
    const [dbError, setDbError] = useState("");
    const [dbSuccess, setDbSuccess] = useState(false);

    const fileInputRef = useRef(null);

    function handleFiles(files) {
        const accepted = Array.from(files).filter(
            (f) => f.name.endsWith(".bpmn") || f.name.endsWith(".xml")
        );
        if (!accepted.length) return;

        accepted.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const nouveau = {
                    id: Date.now() + Math.random(),
                    nom: file.name,
                    contenu: e.target.result,
                    dbId: null,
                };
                setFichiers((prev) => {
                    const updated = [...prev, nouveau];
                    const sel = selected || nouveau;
                    const t = titre || file.name.replace(/\.(bpmn|xml)$/, "");
                    saveBpmn({ fichiers: updated, selected: sel, titre: t });
                    return updated;
                });
                if (!selected) {
                    setSelected(nouveau);
                    setTitre(file.name.replace(/\.(bpmn|xml)$/, ""));
                }
            };
            reader.readAsText(file, "UTF-8");
        });
    }

    function handleDrop(e) {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
    }

    function handleFileChange(e) {
        handleFiles(e.target.files);
        e.target.value = "";
    }

    function retirerFichier(id) {
        setFichiers((prev) => {
            const updated = prev.filter((f) => f.id !== id);
            const newSel = selected?.id === id ? (updated[0] || null) : selected;
            setSelected(newSel);
            saveBpmn({ fichiers: updated, selected: newSel, titre });
            return updated;
        });
    }

    function selectionnerFichier(fichier) {
        setSelected(fichier);
        setTitre(fichier.nom.replace(/\.(bpmn|xml)$/, ""));
        saveBpmn({ fichiers, selected: fichier, titre: fichier.nom.replace(/\.(bpmn|xml)$/, "") });
    }

    // ✅ UNE SEULE fonction sauvegarderBdd
    async function sauvegarderBdd() {
        if (!selected?.contenu) {
            setDbError("Sélectionnez un fichier BPMN avant de sauvegarder.");
            return;
        }
        if (!titre.trim()) {
            setDbError("Donnez un titre au BPMN.");
            return;
        }
        const projet = getProjetCourant();
        if (!projet?.id) {
            setDbError("Aucun projet sélectionné.");
            return;
        }

        setDbLoading(true);
        setDbError("");
        setDbSuccess(false);

        try {
            const res = await authFetch("/api/bpmn/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    idProjet: projet.id,
                    titre: titre.trim(),
                    contenu: selected.contenu,
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Erreur serveur ${res.status} : ${text}`);
            }

            const created = await res.json();

            setFichiers((prev) => {
                const updated = prev.map((f) =>
                    f.id === selected.id ? { ...f, dbId: created.idBpmn } : f
                );
                const newSel = { ...selected, dbId: created.idBpmn };
                setSelected(newSel);
                saveBpmn({ fichiers: updated, selected: newSel, titre });
                return updated;
            });

            setDbSuccess(true);
            setTimeout(() => setDbSuccess(false), 3000);
        } catch (err) {
            setDbError("Erreur lors de la sauvegarde : " + err.message);
        } finally {
            setDbLoading(false);
        }
    }

    return (
        <div className="p-6">
            <div className="max-w-5xl mx-auto space-y-6">

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Import BPMN</h1>
                        <p className="text-gray-600">Phase 6 — Importation des diagrammes de processus</p>
                    </div>
                    {fichiers.length > 0 && (
                        <button
                            onClick={() => { clearBpmn(); setFichiers([]); setSelected(null); setTitre(""); }}
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-red-200 transition-colors"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Réinitialiser
                        </button>
                    )}
                </div>

                {/* Zone d'upload */}
                <Card>
                    <CardContent className="p-6">
                        <div
                            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${
                                dragging
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                            }`}
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={handleDrop}
                        >
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-sm font-medium text-gray-700 mb-1">
                                Glissez-déposez vos fichiers BPMN ici
                            </p>
                            <p className="text-xs text-gray-500">
                                ou cliquez pour parcourir — formats : .bpmn, .xml
                            </p>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".bpmn,.xml"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </CardContent>
                </Card>

                {/* Liste des fichiers importés */}
                {fichiers.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Fichiers importés ({fichiers.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {fichiers.map((f) => (
                                <div
                                    key={f.id}
                                    onClick={() => selectionnerFichier(f)}
                                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                                        selected?.id === f.id
                                            ? "border-blue-400 bg-blue-50"
                                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText className={`w-5 h-5 ${selected?.id === f.id ? "text-blue-600" : "text-gray-400"}`} />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{f.nom}</p>
                                            <p className="text-xs text-gray-500">
                                                {Math.round(f.contenu.length / 1024 * 10) / 10} KB
                                                {f.dbId && (
                                                    <span className="ml-2 text-emerald-600 inline-flex items-center gap-1">
                                                        <Database className="w-3 h-3" /> Sauvegardé
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); retirerFichier(f.id); }}
                                        className="text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Titre + Sauvegarde BDD */}
                {selected && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Enregistrer en base de données</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Titre du BPMN <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    placeholder="Ex: Processus de facturation v2"
                                    value={titre}
                                    onChange={(e) => {
                                        setTitre(e.target.value);
                                        saveBpmn({ fichiers, selected, titre: e.target.value });
                                    }}
                                />
                            </div>

                            {dbSuccess && (
                                <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm">
                                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                    BPMN sauvegardé en base de données avec succès.
                                </div>
                            )}
                            {dbError && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                    {dbError}
                                </div>
                            )}

                            <button
                                onClick={sauvegarderBdd}
                                disabled={dbLoading || !selected || !titre.trim()}
                                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-emerald-300 transition-colors font-medium"
                            >
                                {dbLoading ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Sauvegarde...</>
                                ) : (
                                    <><Database className="w-4 h-4" />
                                    {selected?.dbId ? "Mettre à jour en BDD" : "Sauvegarder en BDD"}</>
                                )}
                            </button>
                        </CardContent>
                    </Card>
                )}

                {/* Aperçu XML brut */}
                {selected && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Aperçu — {selected.nom}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="text-xs text-gray-600 bg-gray-50 rounded-lg p-4 overflow-auto max-h-64 border border-gray-200 font-mono">
                                {selected.contenu.slice(0, 2000)}{selected.contenu.length > 2000 ? "\n... (tronqué)" : ""}
                            </pre>
                        </CardContent>
                    </Card>
                )}

                <div className="flex gap-3">
                    <Link
                        to="/dashboard/phase6/viewer"
                        className={`ml-auto flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                            selected
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"
                        }`}
                    >
                        Visualiser le BPMN
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

            </div>
        </div>
    );
}