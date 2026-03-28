import React, { useState, useEffect } from 'react';
import { CheckCircle, Brain, Trash2, Plus, Loader2 } from "lucide-react";
import { Card, CardContent } from "../../../app/components/ui/card";
import { Input } from "../../../app/components/ui/input";
import { Textarea } from "../../../app/components/ui/textarea";
import { mistralService } from "../../../services/mistralService"; 
import { getProjetCourant } from "../../../services/projetCourant";

export function Phase5A() {
    const [exigences, setExigences] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // 1. Récupération de l'ID projet (Aligné sur ta Phase 4A)
    const projet = getProjetCourant();
    const idProjet = projet?.id; // Dans ton projet, c'est .id et non .idProjet

    const handleUpdateEF = (index, field, value) => {
        setExigences(prev => prev.map((ef, i) => 
            i === index ? { ...ef, [field]: value } : ef
        ));
    };

    const handleDeleteEF = (index) => {
        setExigences(prev => prev.filter((_, i) => i !== index));
    };

    const handleAddEF = () => {
        const newEF = {
            code: `EF-00${exigences.length + 1}`,
            libelle: "Nouvelle exigence",
            description: "",
            usLiees: []
        };
        setExigences([...exigences, newEF]);
    };

    const genererExigences = async () => {
        if (!idProjet) {
            alert("Aucun projet sélectionné. Retournez au cockpit.");
            return;
        }
        console.log("ID Projet détecté :", idProjet);

        setIsLoading(true);
        try {
            // Appel via authFetch encapsulé dans ton service
            const data = await mistralService.genererExigencesGlobales(idProjet);
            setExigences(data.exigences || []); 
            console.log("Données reçues de l'IA :", data);
setExigences(data.exigences || [])
        } catch (e) {
            console.error("Erreur génération:", e);
            alert("Erreur lors de la génération. Vérifiez les logs backend.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!idProjet) return;
        setIsSaving(true);
        try {
            await mistralService.sauvegarderExigences(idProjet, exigences);
            alert("Exigences enregistrées avec succès en base Oracle !");
        } catch (e) {
            console.error("Erreur sauvegarde:", e);
            alert("Erreur lors de la sauvegarde.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold italic text-gray-900">Aymen le bg — Ingénierie des Exigences</h1>
                    <p className="text-gray-500">Phase 5A — Synthèse du backlog US ({projet?.nom || "Projet inconnu"})</p>
                </div>
                <button 
                    onClick={genererExigences}
                    disabled={isLoading || !idProjet}
                    className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-300 transition-all shadow-md"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Brain size={20} />}
                    {isLoading ? "Analyse Mistral en cours..." : "Générer avec Mistral AI"}
                </button>
            </div>

            <div className="space-y-4">
                {exigences.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed rounded-xl text-gray-400 bg-gray-50">
                        {isLoading ? "L'intelligence artificielle analyse votre backlog..." : "Cliquez sur le bouton pour synthétiser vos User Stories."}
                    </div>
                ) : (
                    exigences.map((ef, index) => (
                        <Card key={index} className="relative border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="pt-6 space-y-4">
                                <button 
                                    onClick={() => handleDeleteEF(index)}
                                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>

                                <div className="flex flex-wrap gap-4 pr-8">
                                    <div className="w-32">
                                        <label className="text-[10px] font-bold uppercase text-gray-400">Code</label>
                                        <Input 
                                            value={ef.code} 
                                            onChange={(e) => handleUpdateEF(index, 'code', e.target.value)}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-[300px]">
                                        <label className="text-[10px] font-bold uppercase text-gray-400">Libellé de l'exigence</label>
                                        <Input 
                                            value={ef.libelle} 
                                            onChange={(e) => handleUpdateEF(index, 'libelle', e.target.value)}
                                        />
                                    </div>
                                    <div className="w-full md:w-auto text-right self-end">
                                        <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-100">
                                            Sources: {Array.isArray(ef.usLiees) && ef.usLiees.length > 0 ? ef.usLiees.join(', ') : 'Manuelle'}
                                        </span>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-gray-400">Description détaillée (le système doit...)</label>
                                    <Textarea 
                                        value={ef.description} 
                                        onChange={(e) => handleUpdateEF(index, 'description', e.target.value)}
                                        rows={2}
                                        className="bg-gray-50/50"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}

                {exigences.length > 0 && (
                    <button 
                        onClick={handleAddEF}
                        className="w-full py-4 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:text-purple-500 hover:border-purple-200 hover:bg-purple-50/30 flex items-center justify-center gap-2 transition-all"
                    >
                        <Plus size={20} /> Ajouter une exigence manuelle
                    </button>
                )}
            </div>

            {exigences.length > 0 && (
                <div className="flex justify-end gap-3 mt-8 border-t pt-6">
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-10 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 flex items-center gap-2 font-bold shadow-lg transition-all transform hover:scale-105"
                    >
                        {isSaving ? <Loader2 className="animate-spin" /> : <CheckCircle size={20} />}
                        Finaliser la Phase 5A
                    </button>
                </div>
            )}
        </div>
    );
}