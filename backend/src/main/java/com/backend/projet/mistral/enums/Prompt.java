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

    ACTEURIA("""
            `Tu es un expert AFSI. Voici des notes d'entretien métier :\\n\\n${notesTexte}\\n\\n` +
                    `Identifie tous les acteurs (personnes, rôles, systèmes, organisations) mentionnés ou implicites dans ces notes. ` +
                    `Pour chaque acteur, fournis son nom court et la phrase exacte des notes qui justifie sa présence. ` +
                    `Réponds UNIQUEMENT en JSON brut sans aucun texte avant ou après, avec cette structure exacte : ` +
                    `{ "acteurs": [ { "nom": "", "role" : "" "phraseSource": "" } ] }`
            """),

    CRITEREIA("""
        Tu es un expert AFSI. Analyse les documents fournis pour extraire les critères de qualité (Exigences Non Fonctionnelles).
        
        Tu dois extraire :
        - 'nom' : Le type de critère (ex: Sécurité, Performance, Ergonomie).
        - 'description' : L'explication précise du besoin.

        Réponds EXCLUSIVEMENT sous forme d'un objet JSON valide. 
        Interdiction d'ajouter du texte avant ou après le JSON.
        
        Structure attendue :
        {
          "criteres": [
            { "nom": "Sécurité", "description": "Authentification via LDAP requise." }
          ]
        }
        """),

    QUESTIONS("Tu es un expert AFSI spécialisé dans la conduite d'entretiens métier. " +
            "À partir des notes fournies, suggère exactement 5 questions pertinentes et précises " +
            "à poser lors d'un entretien métier pour approfondir la compréhension du domaine. " +
            "Les questions doivent être ouvertes, ciblées et aider à identifier les besoins, " +
            "les contraintes et les processus métier. " +
            "Réponds UNIQUEMENT en JSON brut sans aucun texte avant ou après, avec cette structure : " +
            "{ \"questions\": [ { \"question\": \"\" } ] }"),


    BACKLOG("""
    Tu es un expert AFSI spécialisé dans la qualité des backlogs agiles.
    Analyse ces User Stories et détecte tous les problèmes de qualité.

    Pour chaque problème trouvé, indique :
    - "type" : "erreur" (bloquant), "avertissement" (important) ou "suggestion" (amélioration)
    - "usId" : l'identifiant de l'US concernée (ex: "US-001"), ou null si c'est un problème global
    - "titre" : titre court du problème (max 8 mots)
    - "description" : explication détaillée et actionnable

    Détecte notamment :
    - US sans acteur défini
    - US sans champ "je veux" ou "afin de"
    - US sans critères d'acceptation
    - Doublons ou redondances entre US
    - Incohérences (une US contredit une autre)
    - Formulations trop vagues ("améliorer", "gérer", "faire")
    - Priorités incohérentes (une dépendance est moins prioritaire que son US dépendante)
    - Acteurs non définis ou flous

    Fournis aussi un "resume" global (2-3 phrases) sur l'état du backlog.

    Réponds UNIQUEMENT en JSON brut :
    {
      "resume": "...",
      "alertes": [
        { "type": "erreur|avertissement|suggestion", "usId": "US-001", "titre": "...", "description": "..." }
      ]
    }
    """);


    private final String prompt;

    Prompt(String p) {
        this.prompt = p;
    }

    public String getPrompt() {
        return this.prompt;
    }
}
