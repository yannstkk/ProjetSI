import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "../../../components/ui/input";

const typeColors = {
    texte: "bg-blue-100 text-blue-700",
    nombre: "bg-green-100 text-green-700",
    date: "bg-purple-100 text-purple-700",
    booléen: "bg-orange-100 text-orange-700",
};

export function OngletDonnees({ items, onAjouter, onSupprimer }) {
    const [nom, setNom] = useState("");
    const [type, setType] = useState("texte");

    function handleAjouter() {
        if (!nom.trim()) return;
        onAjouter({ nom: nom.trim(), type });
        setNom("");
        setType("texte");
    }

    return (
        <div className="space-y-3 mt-4">
            <div className="flex gap-2">
                <Input
                    placeholder="Nom de la donnée"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAjouter()}
                    className="flex-1"
                />
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                    <option value="texte">Texte</option>
                    <option value="nombre">Nombre</option>
                    <option value="date">Date</option>
                    <option value="booléen">Booléen</option>
                </select>
                <button
                    onClick={handleAjouter}
                    disabled={!nom.trim()}
                    className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors text-sm flex-shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    Ajouter
                </button>
            </div>

            {items.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                    Aucune donnée
                </p>
            )}

            {items.map((item) => (
                <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200"
                >
                    <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${typeColors[item.type]}`}>
                            {item.type}
                        </span>
                        <p className="text-sm text-gray-700">{item.nom}</p>
                    </div>
                    <button
                        onClick={() => onSupprimer(item.id)}
                        className="ml-2 text-gray-300 hover:text-red-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}