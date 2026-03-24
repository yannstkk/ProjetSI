import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "../../../components/ui/input";

export function OngletTexte({ items, onAjouter, onSupprimer, placeholder }) {
    const [valeur, setValeur] = useState("");

    function handleAjouter() {
        if (!valeur.trim()) return;
        onAjouter({ texte: valeur.trim() });
        setValeur("");
    }

    return (
        <div className="space-y-3 mt-4">
            <div className="flex gap-2">
                <Input
                    placeholder={placeholder}
                    value={valeur}
                    onChange={(e) => setValeur(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAjouter()}
                />
                <button
                    onClick={handleAjouter}
                    disabled={!valeur.trim()}
                    className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors text-sm flex-shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    Ajouter
                </button>
            </div>

            {items.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                    Aucun élément
                </p>
            )}

            {items.map((item) => (
                <div
                    key={item.id}
                    className="flex items-start justify-between p-3 bg-gray-50 rounded border border-gray-200 group"
                >
                    <p className="text-sm text-gray-700 flex-1">{item.texte}</p>
                    <button
                        onClick={() => onSupprimer(item.id)}
                        className="ml-2 text-gray-300 hover:text-red-600 transition-colors flex-shrink-0"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}