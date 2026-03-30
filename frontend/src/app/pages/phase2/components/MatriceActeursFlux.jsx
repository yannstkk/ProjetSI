import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

export function MatriceActeursFlux({ acteurs, flux }) {
    if (acteurs.length === 0 || flux.length === 0) {
        return (
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Matrice Acteurs ↔ Flux</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-500 text-center py-6">
                        Importez des acteurs et des flux pour afficher la matrice
                    </p>
                </CardContent>
            </Card>
        );
    }

    function participe(acteurNom, flux) {
        const nom = acteurNom.toLowerCase();
        return (
            flux.emetteur?.toLowerCase() === nom ||
            flux.recepteur?.toLowerCase() === nom
        );
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base">
                    Matrice Acteurs ↔ Flux
                </CardTitle>
            </CardHeader>

            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">

                        {/* En-tête : noms des flux */}
                        <thead>
                            <tr>
                                <th className="text-left px-3 py-2 bg-gray-50 border border-gray-200 font-medium text-gray-700 min-w-[140px]">
                                    Acteur / Flux
                                </th>
                                {flux.map((f, i) => (
                                    <th
                                        key={i}
                                        className="px-3 py-2 bg-gray-50 border border-gray-200 font-medium text-gray-700 text-center min-w-[100px]"
                                    >
                                        <div className="max-w-[120px] truncate mx-auto" title={f.nom}>
                                            {f.nom || `Flux ${i + 1}`}
                                        </div>
                                        <div className="text-xs font-normal text-gray-400 mt-0.5">
                                            {f.emetteur} → {f.recepteur}
                                        </div>
                                    </th>
                                ))}
                                <th className="px-3 py-2 bg-gray-50 border border-gray-200 font-medium text-gray-500 text-center">
                                    Total
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {acteurs.map((acteur) => {
                                const participations = flux.filter((f) =>
                                    participe(acteur.nom, f)
                                );
                                const total = participations.length;

                                return (
                                    <tr
                                        key={acteur.id || acteur.nom}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-3 py-2 border border-gray-200 font-medium text-gray-900">
                                            <div>{acteur.nom}</div>
                                            {acteur.role && (
                                                <div className="text-xs text-gray-400 font-normal">
                                                    {acteur.role}
                                                </div>
                                            )}
                                        </td>

                                        {flux.map((f, i) => {
                                            const ok = participe(acteur.nom, f);
                                            return (
                                                <td
                                                    key={i}
                                                    className={`border border-gray-200 text-center py-2 ${
                                                        ok ? "bg-green-50" : ""
                                                    }`}
                                                >
                                                    {ok && (
                                                        <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                                                    )}
                                                </td>
                                            );
                                        })}

                                        <td className="border border-gray-200 text-center py-2">
                                            <span className={`text-sm font-semibold ${
                                                total === 0
                                                    ? "text-orange-500"
                                                    : "text-gray-700"
                                            }`}>
                                                {total}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>

                        <tfoot>
                            <tr className="bg-gray-50">
                                <td className="px-3 py-2 border border-gray-200 text-xs font-medium text-gray-500">
                                    Acteurs impliqués
                                </td>
                                {flux.map((f, i) => {
                                    const count = acteurs.filter((a) =>
                                        participe(a.nom, f)
                                    ).length;
                                    return (
                                        <td
                                            key={i}
                                            className="border border-gray-200 text-center py-2"
                                        >
                                            <span className="text-sm font-semibold text-gray-700">
                                                {count}
                                            </span>
                                        </td>
                                    );
                                })}
                                <td className="border border-gray-200" />
                            </tr>
                        </tfoot>

                    </table>
                </div>
            </CardContent>
        </Card>
    );
}