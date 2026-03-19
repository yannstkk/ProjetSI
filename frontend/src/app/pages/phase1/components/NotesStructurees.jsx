import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { OngletTexte } from "./OngletTexte";
import { OngletDonnees } from "./OngletDonnees";
import { OngletContraintes } from "./OngletContraintes";

export function NotesStructurees({ live, ajouterElement, supprimerElement }) {
    const counts = {
        besoins: live.besoins.length,
        regles: live.regles.length,
        donnees: live.donnees.length,
        contraintes: live.contraintes.length,
        solutions: live.solutions.length,
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Notes structurées</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="besoins">
                    <TabsList className="grid grid-cols-5 w-full">
                        <TabsTrigger value="besoins">
                            Besoins {counts.besoins > 0 && `(${counts.besoins})`}
                        </TabsTrigger>
                        <TabsTrigger value="regles">
                            Règles {counts.regles > 0 && `(${counts.regles})`}
                        </TabsTrigger>
                        <TabsTrigger value="donnees">
                            Données {counts.donnees > 0 && `(${counts.donnees})`}
                        </TabsTrigger>
                        <TabsTrigger value="contraintes">
                            Contraintes {counts.contraintes > 0 && `(${counts.contraintes})`}
                        </TabsTrigger>
                        <TabsTrigger value="solutions">
                            Solutions {counts.solutions > 0 && `(${counts.solutions})`}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="besoins">
                        <OngletTexte
                            items={live.besoins}
                            onAjouter={(el) => ajouterElement("besoins", el)}
                            onSupprimer={(id) => supprimerElement("besoins", id)}
                            placeholder="Décrire le besoin..."
                        />
                    </TabsContent>

                    <TabsContent value="regles">
                        <OngletTexte
                            items={live.regles}
                            onAjouter={(el) => ajouterElement("regles", el)}
                            onSupprimer={(id) => supprimerElement("regles", id)}
                            placeholder="Décrire la règle métier..."
                        />
                    </TabsContent>

                    <TabsContent value="donnees">
                        <OngletDonnees
                            items={live.donnees}
                            onAjouter={(el) => ajouterElement("donnees", el)}
                            onSupprimer={(id) => supprimerElement("donnees", id)}
                        />
                    </TabsContent>

                    <TabsContent value="contraintes">
                        <OngletContraintes
                            items={live.contraintes}
                            onAjouter={(el) => ajouterElement("contraintes", el)}
                            onSupprimer={(id) => supprimerElement("contraintes", id)}
                        />
                    </TabsContent>

                    <TabsContent value="solutions">
                        <OngletTexte
                            items={live.solutions}
                            onAjouter={(el) => ajouterElement("solutions", el)}
                            onSupprimer={(id) => supprimerElement("solutions", id)}
                            placeholder="Décrire la solution proposée..."
                        />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}