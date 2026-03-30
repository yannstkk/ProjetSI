import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Check, Edit2, Trash2, X, AlertTriangle } from "lucide-react";

export function CarteElement({ item, colonneId, onValider, onSupprimer, onEditer }) {
    const [editing, setEditing] = useState(false);
    const [texteEdit, setTexteEdit] = useState(item.texte);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: item.id,
        data: { colonneId },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 50 : "auto",
    };

    function handleSaveEdit() {
        if (texteEdit.trim()) {
            onEditer(item.id, texteEdit.trim());
        }
        setEditing(false);
    }

    function handleKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSaveEdit();
        }
        if (e.key === "Escape") {
            setTexteEdit(item.texte);
            setEditing(false);
        }
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group relative bg-white rounded-lg border shadow-sm transition-shadow ${
                isDragging ? "shadow-lg" : "hover:shadow-md"
            } ${
                item.valide ? "border-green-300 bg-green-50/30" : "border-gray-200"
            } ${
                item.doublonSuspecte ? "border-orange-300" : ""
            }`}
        >
            <div className="flex items-start gap-2 p-3">

                <button
                    {...attributes}
                    {...listeners}
                    className="mt-0.5 flex-shrink-0 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing touch-none"
                >
                    <GripVertical className="w-4 h-4" />
                </button>

                <div className="flex-1 min-w-0">

                    {item.source && (
                        <span className="inline-block text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 mb-1">
                            {item.source}
                        </span>
                    )}

                    {item.doublonSuspecte && (
                        <div className="flex items-center gap-1 text-xs text-orange-600 mb-1">
                            <AlertTriangle className="w-3 h-3" />
                            Doublon suspecté
                        </div>
                    )}

                    {editing ? (
                        <textarea
                            autoFocus
                            value={texteEdit}
                            onChange={(e) => setTexteEdit(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full text-sm border border-blue-400 rounded p-1 resize-none outline-none focus:ring-2 focus:ring-blue-200"
                            rows={3}
                        />
                    ) : (
                        <p className={`text-sm ${item.valide ? "text-gray-500 line-through" : "text-gray-800"}`}>
                            {item.texte}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex flex-col gap-1">

                    {editing ? (
                        <>
                            <button
                                onClick={handleSaveEdit}
                                className="p-1 rounded text-green-600 hover:bg-green-50"
                                title="Sauvegarder"
                            >
                                <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => { setTexteEdit(item.texte); setEditing(false); }}
                                className="p-1 rounded text-gray-400 hover:bg-gray-50"
                                title="Annuler"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => onValider(item.id)}
                                className={`p-1 rounded transition-colors ${
                                    item.valide
                                        ? "text-green-600 bg-green-50"
                                        : "text-gray-300 hover:text-green-600 hover:bg-green-50"
                                }`}
                                title={item.valide ? "Dévalider" : "Valider"}
                            >
                                <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => setEditing(true)}
                                className="p-1 rounded text-gray-300 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                title="Éditer"
                            >
                                <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => onSupprimer(item.id)}
                                className="p-1 rounded text-gray-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Supprimer"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}