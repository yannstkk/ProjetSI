package com.backend.projet.mistral.enums;

public enum Prompt {
    ELICITATION("""
            Tu es un expert AFSI. Analyse les notes et extrait les éléments suivants : 
            Acteurs, Actions, Objets Métiers, Règles Métiers, Contraintes, Points de Douleur, Doublons, Incohérences, Termes Ambigus. 
            Pour chaque élément, trouve la 'valeur' (concept court) et la 'phraseSource' (citation exacte du texte). 
            Réponds UNIQUEMENT en JSON brut avec cette structure : 
            { "elements": [ { "categorie": "", "valeur": "", "phraseSource": "" } ] }
            """),

    MFC("""
            Tu es un expert AFSI spécialisé dans l'analyse systémique et Merise.
            Analyse ce diagramme de flux MFC (PlantUML) et extrais chaque interaction.
            
            Pour chaque flux, remplis :
            - "nom" : Le libellé du flux.
            - "emetteur" : L'acteur à l'origine.
            - "recepteur" : L'acteur de destination.
            - "description" : Une brève explication du but du flux.
            - "data" : Liste les objets métiers sous forme d'une SEULE chaîne de caractères séparés par des virgules (ex: "Facture, Client, RIB").
            
            Réponds UNIQUEMENT en JSON brut : 
            { "flux" : [ { "nom" : "", "emetteur" : "", "recepteur" : "", "description" : "", "data" : "" }]}
            """),

    ACTEURIA("""
        Tu es un expert en analyse AFSI. Voici des notes d'entretien métier.
        Ton objectif est d'identifier les acteurs réels (ceux qui émettent ou reçoivent des informations).

        Consignes strictes :
        1. Ne crée PAS d'acteurs génériques comme "Système informatique", "Logiciel" ou "Base de données" sauf s'ils sont nommés spécifiquement (ex: "SAP", "Taiga").
        2. Ne transforme PAS une action (ex: "Alerte") en nom d'acteur.
        3. Différencie bien les acteurs Internes (membres de l'organisation) et Externes (clients, partenaires).
        4. Pour le "nom", utilise le titre de la fonction ou de l'entité (ex: "Adhérent", "Bibliothécaire").
        5. Pour le "role", résume brièvement sa responsabilité principale dans le flux.

        Réponds UNIQUEMENT en JSON brut avec cette structure :
        {
          "acteurs": [
            { "nom": "", "role": "", "phraseSource": "" }
          ]
        }
        
        """),

    SYNTHESE_EF("""
    Tu es un Business Analyst expert en méthode AFSI. Ton rôle est de transformer un backlog de User Stories (US) 
    en une liste cohérente d'Exigences Fonctionnelles (EF).
    
    CONSIGNES :
    1. Analyse l'ensemble des US fournies.
    2. Fusionne les US qui concernent la même fonctionnalité ou règle métier pour créer une EF unique, claire et transverse.
    3. Attribue à chaque EF un code (ex: EF-001, EF-002).
    4. Remplis le champ 'usLiees' avec la liste des CODES des User Stories (ex: ["US-001", "US-003"]) qui ont permis de définir cette exigence.
    
    Réponds UNIQUEMENT en JSON brut avec cette structure :
    {
      "exigences": [
        {
          "code": "EF-001",
          "libelle": "Titre de l'exigence",
          "description": "Description précise du comportement attendu du système",
          "usLiees": ["US-001", "US-002"]
        }
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

    CRITEREIA("""
            Tu es un expert AFSI. Analyse les documents fournis pour extraire les critères de qualité (Exigences Non Fonctionnelles).
>>>>>>> origin/main

            Tu dois extraire :
            - "nom" : Le type de critère (ex: Sécurité, Performance, Ergonomie)
            - "description" : L'explication précise du besoin

            Réponds EXCLUSIVEMENT sous forme d'un objet JSON valide.
            Interdiction d'ajouter du texte avant ou après le JSON.

            Structure attendue :
            {
              "criteres": [
                { "nom": "Sécurité", "description": "Authentification via LDAP requise." }
              ]
            }
            """),


    BACKLOG("""
            Tu es un expert AFSI spécialisé dans la qualité des backlogs agiles.
            Analyse ces User Stories et détecte tous les problèmes de qualité.

            Pour chaque problème trouvé, indique :
            - "type" : "erreur", "avertissement" ou "suggestion"
            - "usId" : l'identifiant de l'US concernée (ex: "US-001"), ou null si c'est un problème global
            - "titre" : titre court du problème
            - "description" : explication détaillée et actionnable

            Détecte notamment :
            - US sans acteur défini
            - US sans champ "je veux" ou "afin de"
            - US sans critères d'acceptation
            - Doublons ou redondances entre US
            - Incohérences entre US
            - Formulations trop vagues
            - Priorités incohérentes
            - Acteurs non définis ou flous

            Fournis aussi un "resume" global sur l'état du backlog.

            Réponds UNIQUEMENT en JSON brut :
            {
              "resume": "",
              "alertes": [
                { "type": "erreur|avertissement|suggestion", "usId": "US-001", "titre": "", "description": "" }
              ]
            }
            """),

    BPMN_COHERENCE("""
            Tu es un expert AFSI spécialisé en BPMN, analyse métier, MFC et MCD.

            Ta mission :
            1. Lire le BPMN fourni.
            2. Lire les User Stories fournies.
            3. Identifier les acteurs métier présents dans le BPMN.
            4. Identifier les activités métier présentes dans le BPMN.
            5. Déterminer quelles User Stories sont couvertes par le BPMN, même si les mots ne sont pas exactement les mêmes.
            6. Déterminer quelles User Stories ne sont pas couvertes.
            7. Détecter les incohérences entre le processus BPMN, les acteurs et les User Stories.
            8. Produire une synthèse utile à un Business Analyst.

            Règles :
            - Sois intelligent sur le sens, pas seulement sur les mots exacts.
            - Considère les synonymes et formulations proches.
            - Si une tâche BPMN correspond clairement à une intention métier d'une User Story, considère-les liées.
            - Ne jamais utiliser l'expression "User Story non technique".
            - Utilise des formulations métier claires, par exemple :
              - "User Story non exploitable"
              - "User Story non alignée avec le BPMN"
              - "Acteur métier non couvert"
              - "Activité BPMN non couverte"
              - "Incohérence entre acteur et activité"
            - Quand une User Story est vague, hors périmètre ou non reliée au système, indique clairement qu'elle ne correspond pas à une fonctionnalité claire du système.
            - Les recommandations doivent être orientées BA et modélisation, en lien avec le BPMN, le MFC et le MCD si pertinent.
            - Réponds UNIQUEMENT en JSON brut.
            - Le champ "score" doit être un entier de 0 à 100.
            - Le champ "type" doit être "warning" ou "erreur".

            Format attendu :
            {
              "liens": [
                {
                  "tacheBpmn": "",
                  "userStoryId": "",
                  "justification": "",
                  "score": 0
                }
              ],
              "alertes": [
                {
                  "type": "warning",
                  "titre": "",
                  "description": "",
                  "elementBpmn": "",
                  "userStoryId": "",
                  "justification": "",
                  "recommandation": ""
                }
              ],
              "userStoriesNonCouvertes": [
                {
                  "id": "",
                  "raison": ""
                }
              ],
              "tachesBpmnNonCouvertes": [
                {
                  "nom": "",
                  "raison": ""
                }
              ],
              "resumeGlobal": ""
            }
            """),

    MCD_ANALYSE("""
            Tu es un expert AFSI et Merise spécialisé en modélisation conceptuelle de données (MCD).
            Analyse ce diagramme MCD au format PlantUML et extrais sa structure complète.

            Pour chaque entité, fournis :
            - "nom" : nom exact de l'entité
            - "attributs" : liste d'objets { "nom": "", "type": "", "estCle": true/false }

            Pour chaque association entre entités :
            - "nom"
            - "entites"
            - "cardinalite"

            Pour "donnees" : liste plate de tous les attributs de toutes les entités
            Pour "alertes" : problèmes détectés
            Pour "resume" : synthèse en 2-3 phrases

            Réponds EXCLUSIVEMENT en JSON brut :
            {
              "resume": "",
              "entites": [
                {
                  "nom": "NomEntite",
                  "attributs": [
                    { "nom": "id_entite", "type": "NUMBER", "estCle": true },
                    { "nom": "libelle", "type": "VARCHAR2(100)", "estCle": false }
                  ]
                }
              ],
              "associations": [
                {
                  "nom": "",
                  "entites": ["Entite1", "Entite2"],
                  "cardinalite": "1,1 — 0,N"
                }
              ],
              "donnees": [
                { "nom": "id_entite", "type": "NUMBER", "entite": "NomEntite" }
              ],
              "alertes": []
            }
            """);

    private final String prompt;

    Prompt(String prompt) {
        this.prompt = prompt;
    }

    public String getPrompt() {
        return this.prompt;
    }
}