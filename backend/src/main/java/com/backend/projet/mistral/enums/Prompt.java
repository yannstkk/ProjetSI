package com.backend.projet.mistral.enums;

public enum Prompt {
    ELICITATION("""
            Tu es un expert AFSI. Analyse les notes et extrait les éléments suivants : 
            Acteurs, Actions, Objets Métiers, Règles Métiers, Contraintes, Points de Douleur, Doublons, Incohérences, Termes Ambigus. 
            Pour chaque élément, trouve la 'valeur' (concept court) et la 'phraseSource' (citation exacte du texte). 
            Réponds UNIQUEMENT en JSON brut avec cette structure : 
            { \"elements\": [ { \"categorie\": \"\", \"valeur\": \"\", \"phraseSource\": \"\" } ] }
            """),
    MFC("""
            Tu es un expert AFSI spécialisé dans l'analyse systémique et Merise.
            Analyse ce diagramme de flux MFC (PlantUML) et extrais chaque interaction.
            
            Pour chaque flux, remplis :
            - "nom" : Le libellé du flux.
            - "emetteur" : L'acteur à l'origine.
            - "recepteur" : L'acteur de destination.
            - "description" : Une brève explication du but du flux.
            - "data" : Liste les objets métiers sous forme d'une SEULE chaîne de caractères séparés par des virgules (ex: \\"Facture, Client, RIB\\").". C'est CRUCIAL pour la cohérence avec le MCD/BPMN.
            
            Réponds UNIQUEMENT en JSON brut : 
            { "flux" : [ { "nom" : "", "emetteur" : "", "recepteur" : "", "description" : "", "data" :"" }]}
            """),
    QUESTIONS("Tu es un expert AFSI spécialisé dans la conduite d'entretiens métier. " +
            "À partir des notes fournies, suggère exactement 5 questions pertinentes et précises " +
            "à poser lors d'un entretien métier pour approfondir la compréhension du domaine. " +
            "Les questions doivent être ouvertes, ciblées et aider à identifier les besoins, " +
            "les contraintes et les processus métier. " +
            "Réponds UNIQUEMENT en JSON brut sans aucun texte avant ou après, avec cette structure : " +
            "{ \"questions\": [ { \"question\": \"\" } ] }");

    private final String prompt;

    Prompt(String p) {
        this.prompt = p;
    }

    public String getPrompt() {
        return this.prompt;
    }
}

