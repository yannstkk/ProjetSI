import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "../../../components/ui/input";

const niveauColors = {
    bloquant: "bg-red-100 text-red-700",
    important: "bg-yellow-100 text-yellow-700",
    mineur: "bg-green-100 text-green-700",
};

export function OngletContraintes({ items, onAjouter, onSupprimer }) {
    const [texte, setTexte] = useState("");
    const [niveau, setNiveau] = useState("important");

    function handleAjouter() {
        if (!texte.trim()) return;
        onAjouter({ texte: texte.trim(), niveau });
        setTexte("");
        setNiveau("important");
    }

    return (
        <div className="space-y-3 mt-4">
            <div className="flex gap-2">
                <Input
                    placeholder="Décrire la contrainte"
                    value={texte}
                    onChange={(e) => setTexte(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAjouter()}
                    className="flex-1"
                />
                <select
                    value={niveau}
                    onChange={(e) => setNiveau(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                    <option value="bloquant">Bloquant</option>
                    <option value="important">Important</option>
                    <option value="mineur">Mineur</option>
                </select>
                <button
                    onClick={handleAjouter}
                    disabled={!texte.trim()}
                    className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors text-sm flex-shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    Ajouter
                </button>
            </div>

            {items.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                    Aucune contrainte
                </p>
            )}

            {items.map((item) => (
                <div
                    key={item.id}
                    className="flex items-start justify-between p-3 bg-gray-50 rounded border border-gray-200"
                >
                    <div className="flex items-start gap-2 flex-1">
                        <span className={`text-xs px-2 py-0.5 rounded font-medium flex-shrink-0 mt-0.5 ${niveauColors[item.niveau]}`}>
                            {item.niveau}
                        </span>
                        <p className="text-sm text-gray-700">{item.texte}</p>
                    </div>
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