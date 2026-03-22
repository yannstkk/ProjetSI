import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus, Check } from "lucide-react";
import { CarteElement } from "./CarteElement";
import { COLONNES } from "./helpers/classificationStorage";

export function ColonneKanban({ colonneId, items, onValider, onSupprimer, onEditer, onAjouter }) {
    const [newTexte, setNewTexte] = useState("");
    const [showAdd, setShowAdd] = useState(false);

    const config = COLONNES[colonneId];
    const nbValides = items.filter((i) => i.valide).length;

    const { setNodeRef, isOver } = useDroppable({ id: colonneId });

    function handleAjouter() {
        if (!newTexte.trim()) return;
        onAjouter(colonneId, newTexte.trim());
        setNewTexte("");
        setShowAdd(false);
    }

    return (
        <div className={`flex flex-col rounded-xl border-t-4 ${config.couleur} bg-white shadow-sm min-h-[500px]`}>

            {/* En-tête colonne */}
            <div className="px-4 pt-4 pb-3 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
                        <h3 className="font-semibold text-sm text-gray-900">
                            {config.label}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        {nbValides > 0 && (
                            <span className="flex items-center gap-1 text-xs text-green-600">
                                <Check className="w-3 h-3" />
                                {nbValides}/{items.length}
                            </span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.badge}`}>
                            {items.length}
                        </span>
                    </div>
                </div>
            </div>

            {/* Zone droppable + cartes */}
            <div
                ref={setNodeRef}
                className={`flex-1 p-3 space-y-2 transition-colors rounded-b-xl ${
                    isOver ? `${config.bg}` : ""
                }`}
            >
                <SortableContext
                    items={items.map((i) => i.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {items.length === 0 && (
                        <div className={`flex items-center justify-center h-20 rounded-lg border-2 border-dashed ${
                            isOver ? "border-gray-400 bg-white" : "border-gray-200"
                        }`}>
                            <p className="text-xs text-gray-400">
                                {isOver ? "Déposer ici" : "Aucun élément"}
                            </p>
                        </div>
                    )}

                    {items.map((item) => (
                        <CarteElement
                            key={item.id}
                            item={item}
                            colonneId={colonneId}
                            onValider={onValider}
                            onSupprimer={onSupprimer}
                            onEditer={onEditer}
                        />
                    ))}
                </SortableContext>

                {/* Ajout rapide */}
                {showAdd ? (
                    <div className="pt-1">
                        <textarea
                            autoFocus
                            value={newTexte}
                            onChange={(e) => setNewTexte(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleAjouter();
                                }
                                if (e.key === "Escape") {
                                    setNewTexte("");
                                    setShowAdd(false);
                                }
                            }}
                            placeholder="Décrire l'élément... (Entrée pour valider)"
                            className="w-full text-sm border border-blue-400 rounded-lg p-2 resize-none outline-none focus:ring-2 focus:ring-blue-200"
                            rows={2}
                        />
                        <div className="flex gap-2 mt-1">
                            <button
                                onClick={handleAjouter}
                                disabled={!newTexte.trim()}
                                className="flex-1 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
                            >
                                Ajouter
                            </button>
                            <button
                                onClick={() => { setNewTexte(""); setShowAdd(false); }}
                                className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowAdd(true)}
                        className="w-full flex items-center gap-1 px-3 py-2 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Ajouter un élément
                    </button>
                )}
            </div>

        </div>
    );
}