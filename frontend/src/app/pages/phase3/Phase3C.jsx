import { useState, useCallback } from "react";
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Download, AlertTriangle } from "lucide-react";

import { authFetch } from "../../../services/authFetch";
import { loadClassification, saveClassification, importerDepuisPhase1, COLONNES } from "./components/helpers/classificationStorage";
import { BoutonIA } from "../../components/BoutonIA";

import { ColonneKanban } from "./components/ColonneKanban";
import { CarteElement } from "./components/CarteElement";
import { BandeauValidation } from "./components/BandeauValidation";

function trouverColonne(classification, itemId) {
    return Object.keys(classification).find((col) => classification[col].some((i) => i.id === itemId));
}

export function Phase3C() {
    const [classification, setClassification] = useState(() => {
        const saved = loadClassification();
        if (saved) return saved;
        return importerDepuisPhase1();
    });

    const [activeItem, setActiveItem]   = useState(null);
    const [activeColId, setActiveColId] = useState(null);
    const [iaLoading, setIaLoading]     = useState(false);
    const [iaError, setIaError]         = useState("");
    const [iaMessage, setIaMessage]     = useState("");

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

    function update(newClassification) { setClassification(newClassification); saveClassification(newClassification); }

    function handleDragStart({ active }) {
        const col = trouverColonne(classification, active.id);
        const item = classification[col]?.find((i) => i.id === active.id);
        setActiveItem(item || null); setActiveColId(col || null);
    }

    function handleDragOver({ active, over }) {
        if (!over) return;
        const sourceCol = trouverColonne(classification, active.id);
        const destCol = Object.keys(COLONNES).includes(over.id) ? over.id : trouverColonne(classification, over.id);
        if (!sourceCol || !destCol || sourceCol === destCol) return;
        const newClass = { ...classification };
        const item = newClass[sourceCol].find((i) => i.id === active.id);
        newClass[sourceCol] = newClass[sourceCol].filter((i) => i.id !== active.id);
        newClass[destCol] = [...newClass[destCol], item];
        update(newClass);
    }

    function handleDragEnd({ active, over }) {
        setActiveItem(null); setActiveColId(null);
        if (!over) return;
        const sourceCol = trouverColonne(classification, active.id);
        const destCol = trouverColonne(classification, over.id) || (Object.keys(COLONNES).includes(over.id) ? over.id : null);
        if (!sourceCol || !destCol || sourceCol !== destCol) return;
        const oldIndex = classification[sourceCol].findIndex((i) => i.id === active.id);
        const newIndex = classification[sourceCol].findIndex((i) => i.id === over.id);
        if (oldIndex !== newIndex) { const newClass = { ...classification }; newClass[sourceCol] = arrayMove(newClass[sourceCol], oldIndex, newIndex); update(newClass); }
    }

    function handleValider(itemId) {
        const col = trouverColonne(classification, itemId); if (!col) return;
        const newClass = { ...classification }; newClass[col] = newClass[col].map((i) => i.id === itemId ? { ...i, valide: !i.valide } : i); update(newClass);
    }
    function handleSupprimer(itemId) {
        const col = trouverColonne(classification, itemId); if (!col) return;
        const newClass = { ...classification }; newClass[col] = newClass[col].filter((i) => i.id !== itemId); update(newClass);
    }
    function handleEditer(itemId, newTexte) {
        const col = trouverColonne(classification, itemId); if (!col) return;
        const newClass = { ...classification }; newClass[col] = newClass[col].map((i) => i.id === itemId ? { ...i, texte: newTexte } : i); update(newClass);
    }
    function handleAjouter(colonneId, texte) {
        const newItem = { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, texte, valide: false, source: "manuel", doublonSuspecte: false };
        const newClass = { ...classification }; newClass[colonneId] = [...newClass[colonneId], newItem]; update(newClass);
    }
    function handleReimporter() { const fresh = importerDepuisPhase1(); update(fresh); setIaMessage(""); setIaError(""); }


   async function detecterDoublons() {
       const tousLesElements = Object.entries(classification)
           .flatMap(([col, items]) =>
               items.map((i) => ({ id: i.id, col, texte: i.texte }))
           );

       if (tousLesElements.length < 2) {
           setIaError("Pas assez d'éléments pour détecter des doublons.");
           return;
       }

       setIaLoading(true);
       setIaError("");
       setIaMessage("");

       const prompt = `Tu es un expert AFSI. Voici une liste d'éléments issus d'une analyse métier :\n\n` +
           tousLesElements.map((e, i) => `${i + 1}. [ID:${e.id}] ${e.texte}`).join("\n") +
           `\n\nIdentifie les doublons ou éléments très similaires. ` +
           `Réponds UNIQUEMENT en JSON brut : { "doublons": [ { "ids": ["id1", "id2"], "raison": "" } ] }`;

       try {
           const response = await authFetch("/api/mistral/suggerer-questions", {
               method: "POST",
               body: JSON.stringify({ contenu: prompt }),
           });

           if (!response.ok) throw new Error(`Erreur serveur : ${response.status}`);

           const data = await response.json();
           const content = data?.choices?.[0]?.message?.content;
           if (!content) throw new Error("Réponse inattendue.");

           const cleaned = content.replace(/```json|```/g, "").trim();
           const parsed  = JSON.parse(cleaned);
           const doublons = parsed.doublons || [];

           if (doublons.length === 0) {
               setIaMessage("✓ Aucun doublon détecté par l'IA.");
               return;
           }

           const idsDoublons = new Set(doublons.flatMap((d) => d.ids));
           const newClass = { ...classification };

           Object.keys(newClass).forEach((col) => {
               newClass[col] = newClass[col].map((i) => ({
                   ...i,
                   doublonSuspecte: idsDoublons.has(i.id),
               }));
           });

           update(newClass);
           setIaMessage(
               `${idsDoublons.size} élément${idsDoublons.size > 1 ? "s" : ""} suspect${idsDoublons.size > 1 ? "s" : ""} marqué${idsDoublons.size > 1 ? "s" : ""}.`
           );

       } catch (err) {
           setIaError("Erreur lors de la détection : " + err.message);
       } finally {
           setIaLoading(false);
       }
   }

    function effacerDoublons() {
        const newClass = { ...classification };
        Object.keys(newClass).forEach((col) => { newClass[col] = newClass[col].map((i) => ({ ...i, doublonSuspecte: false })); });
        update(newClass); setIaMessage("");
    }

    const hasDoublons = Object.values(classification).flat().some((i) => i.doublonSuspecte);

    return (
        <div className="p-6">
            <div className="max-w-[1400px] mx-auto space-y-5">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Classification</h1>
                        <p className="text-gray-600">Phase 3 : Organiser et valider les éléments capturés</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handleReimporter} className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm transition-colors">
                            <Download className="w-4 h-4" /> Réimporter Phase 1
                        </button>
                        <BoutonIA onClick={detecterDoublons} loading={iaLoading} loadingText="Analyse...">
                            Détecter doublons IA
                        </BoutonIA>
                    </div>
                </div>

                {iaError && <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"><AlertTriangle className="w-4 h-4 flex-shrink-0" />{iaError}</div>}
                {iaMessage && (
                    <div className={`flex items-center justify-between p-3 rounded-lg text-sm border ${hasDoublons ? "bg-orange-50 border-orange-200 text-orange-800" : "bg-green-50 border-green-200 text-green-800"}`}>
                        <span>{iaMessage}</span>
                        {hasDoublons && <button onClick={effacerDoublons} className="text-xs underline hover:no-underline ml-4">Effacer les marquages</button>}
                    </div>
                )}

                <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
                    <div className="grid grid-cols-3 gap-4">
                        {Object.keys(COLONNES).map((colonneId) => (
                            <ColonneKanban key={colonneId} colonneId={colonneId} items={classification[colonneId] || []} onValider={handleValider} onSupprimer={handleSupprimer} onEditer={handleEditer} onAjouter={handleAjouter} />
                        ))}
                    </div>
                    <DragOverlay>
                        {activeItem && activeColId ? (
                            <div className="rotate-2 scale-105 opacity-95 shadow-2xl">
                                <CarteElement item={activeItem} colonneId={activeColId} onValider={() => {}} onSupprimer={() => {}} onEditer={() => {}} />
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>

                <BandeauValidation classification={classification} />
            </div>
        </div>
    );
}