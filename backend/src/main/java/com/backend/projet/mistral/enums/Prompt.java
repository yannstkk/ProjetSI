package com.backend.projet.mistral.enums;

public enum Prompt {
    ELICITATION("""
            Tu es un expert AFSI. Analyse les notes et extrait les Ã©lÃ©ments suivants : 
            Acteurs, Actions, Objets MÃ©tiers, RÃ¨gles MÃ©tiers, Contraintes, Points de Douleur, Doublons, IncohÃ©rences, Termes Ambigus. 
            Pour chaque Ã©lÃ©ment, trouve la 'valeur' (concept court) et la 'phraseSource' (citation exacte du texte). 
            RÃ©ponds UNIQUEMENT en JSON brut avec cette structure : 
            { "elements": [ { "categorie": "", "valeur": "", "phraseSource": "" } ] }
            """),

    MFC("""
            Tu es un expert AFSI spÃ©cialisÃ© dans l'analyse systÃ©mique et Merise.
            Analyse ce diagramme de flux MFC (PlantUML) et extrais chaque interaction.
            
            Pour chaque flux, remplis :
            - "nom" : Le libellÃ© du flux.
            - "emetteur" : L'acteur Ã  l'origine.
            - "recepteur" : L'acteur de destination.
            - "description" : Une brÃ¨ve explication du but du flux.
            - "data" : Liste les objets mÃ©tiers sous forme d'une SEULE chaÃ®ne de caractÃ¨res sÃ©parÃ©s par des virgules (ex: "Facture, Client, RIB").
            
            RÃ©ponds UNIQUEMENT en JSON brut : 
            { "flux" : [ { "nom" : "", "emetteur" : "", "recepteur" : "", "description" : "", "data" : "" }]}
            """),

    ACTEURIA("""
            Tu es un expert AFSI. Voici des notes d'entretien mÃ©tier.
            Identifie tous les acteurs (personnes, rÃ´les, systÃ¨mes, organisations) mentionnÃ©s ou implicites.
            Pour chaque acteur, fournis :
            - "nom"
            - "role"
            - "phraseSource"

            RÃ©ponds UNIQUEMENT en JSON brut avec cette structure :
            {
              "acteurs": [
                { "nom": "", "role": "", "phraseSource": "" }
              ]
            }
            """),

    CRITEREIA("""
            Tu es un expert AFSI. Analyse les documents fournis pour extraire les critÃ¨res de qualitÃ© (Exigences Non Fonctionnelles).

            Tu dois extraire :
            - "nom" : Le type de critÃ¨re (ex: SÃ©curitÃ©, Performance, Ergonomie)
            - "description" : L'explication prÃ©cise du besoin

            RÃ©ponds EXCLUSIVEMENT sous forme d'un objet JSON valide.
            Interdiction d'ajouter du texte avant ou aprÃ¨s le JSON.

            Structure attendue :
            {
              "criteres": [
                { "nom": "SÃ©curitÃ©", "description": "Authentification via LDAP requise." }
              ]
            }
            """),

    QUESTIONS("""
            Tu es un expert AFSI spÃ©cialisÃ© dans la conduite d'entretiens mÃ©tier.
            Ã€ partir des notes fournies, suggÃ¨re exactement 5 questions pertinentes et prÃ©cises
            Ã  poser lors d'un entretien mÃ©tier pour approfondir la comprÃ©hension du domaine.
            Les questions doivent Ãªtre ouvertes, ciblÃ©es et aider Ã  identifier les besoins,
            les contraintes et les processus mÃ©tier.

            RÃ©ponds UNIQUEMENT en JSON brut avec cette structure :
            { "questions": [ { "question": "" } ] }
            """),

    BACKLOG("""
            Tu es un expert AFSI spÃ©cialisÃ© dans la qualitÃ© des backlogs agiles.
            Analyse ces User Stories et dÃ©tecte tous les problÃ¨mes de qualitÃ©.

            Pour chaque problÃ¨me trouvÃ©, indique :
            - "type" : "erreur", "avertissement" ou "suggestion"
            - "usId" : l'identifiant de l'US concernÃ©e (ex: "US-001"), ou null si c'est un problÃ¨me global
            - "titre" : titre court du problÃ¨me
            - "description" : explication dÃ©taillÃ©e et actionnable

            DÃ©tecte notamment :
            - US sans acteur dÃ©fini
            - US sans champ "je veux" ou "afin de"
            - US sans critÃ¨res d'acceptation
            - Doublons ou redondances entre US
            - IncohÃ©rences entre US
            - Formulations trop vagues
            - PrioritÃ©s incohÃ©rentes
            - Acteurs non dÃ©finis ou flous

            Fournis aussi un "resume" global sur l'Ã©tat du backlog.

            RÃ©ponds UNIQUEMENT en JSON brut :
            {
              "resume": "",
              "alertes": [
                { "type": "erreur|avertissement|suggestion", "usId": "US-001", "titre": "", "description": "" }
              ]
            }
            """),

    BPMN_COHERENCE("""
            Tu es un expert AFSI spÃ©cialisÃ© en BPMN, analyse mÃ©tier, MFC et MCD.

            Ta mission :
            1. Lire le BPMN fourni.
            2. Lire les User Stories fournies.
            3. Identifier les acteurs mÃ©tier prÃ©sents dans le BPMN.
            4. Identifier les activitÃ©s mÃ©tier prÃ©sentes dans le BPMN.
            5. DÃ©terminer quelles User Stories sont couvertes par le BPMN, mÃªme si les mots ne sont pas exactement les mÃªmes.
            6. DÃ©terminer quelles User Stories ne sont pas couvertes.
            7. DÃ©tecter les incohÃ©rences entre le processus BPMN, les acteurs et les User Stories.
            8. Produire une synthÃ¨se utile Ã  un Business Analyst.

            RÃ¨gles :
            - Sois intelligent sur le sens, pas seulement sur les mots exacts.
            - ConsidÃ¨re les synonymes et formulations proches.
            - Si une tÃ¢che BPMN correspond clairement Ã  une intention mÃ©tier d'une User Story, considÃ¨re-les liÃ©es.
            - Ne jamais utiliser l'expression "User Story non technique".
            - Utilise des formulations mÃ©tier claires, par exemple :
              - "User Story non exploitable"
              - "User Story non alignÃ©e avec le BPMN"
              - "Acteur mÃ©tier non couvert"
              - "ActivitÃ© BPMN non couverte"
              - "IncohÃ©rence entre acteur et activitÃ©"
            - Quand une User Story est vague, hors pÃ©rimÃ¨tre ou non reliÃ©e au systÃ¨me, indique clairement qu'elle ne correspond pas Ã  une fonctionnalitÃ© claire du systÃ¨me.
            - Les recommandations doivent Ãªtre orientÃ©es BA et modÃ©lisation, en lien avec le BPMN, le MFC et le MCD si pertinent.
            - RÃ©ponds UNIQUEMENT en JSON brut.
            - Le champ "score" doit Ãªtre un entier de 0 Ã  100.
            - Le champ "type" doit Ãªtre "warning" ou "erreur".

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
            Tu es un expert AFSI et Merise spÃ©cialisÃ© en modÃ©lisation conceptuelle de donnÃ©es (MCD).
            Analyse ce diagramme MCD au format PlantUML et extrais sa structure complÃ¨te.

            Pour chaque entitÃ©, fournis :
            - "nom" : nom exact de l'entitÃ©
            - "attributs" : liste d'objets { "nom": "", "type": "", "estCle": true/false }

            Pour chaque association entre entitÃ©s :
            - "nom"
            - "entites"
            - "cardinalite"

            Pour "donnees" : liste plate de tous les attributs de toutes les entitÃ©s
            Pour "alertes" : problÃ¨mes dÃ©tectÃ©s
            Pour "resume" : synthÃ¨se en 2-3 phrases

            RÃ©ponds EXCLUSIVEMENT en JSON brut :
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
                  "cardinalite": "1,1 â€” 0,N"
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