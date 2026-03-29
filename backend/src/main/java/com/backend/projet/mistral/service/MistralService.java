package com.backend.projet.mistral.service;

import com.backend.projet.elicitation.dto.response.AnalysisResponse;
import com.backend.projet.mistral.dto.BacklogAnalyseResponse;
import com.backend.projet.mistral.enums.Prompt;
import com.backend.projet.mistral.exceptions.MistralApiException;
import com.backend.projet.modelisation.dto.FluxResponse;
import com.backend.projet.modelisation.dto.response.BpmnCoherenceIaResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MistralService {

    private final RestTemplate restTemplate;
    private final ObjectMapper mapper;

    @Value("${mistral.api.key}")
    private String cleApi;

    @Value("${mistral.api.url}")
    private String urlApi;

    private final String systemNotesPrompt = "Tu es un expert AFSI. Analyse les notes et extrait les Ã©lÃ©ments suivants : " +
            "Acteurs, Actions, Objets MÃ©tiers, RÃ¨gles MÃ©tiers, Contraintes, Points de Douleur, Doublons, IncohÃ©rences, Termes Ambigus. " +
            "Pour chaque Ã©lÃ©ment, trouve la 'valeur' (concept court) et la 'phraseSource' (citation exacte du texte). " +
            "RÃ©ponds UNIQUEMENT en JSON brut avec cette structure : " +
            "{ \"elements\": [ { \"categorie\": \"\", \"valeur\": \"\", \"phraseSource\": \"\" } ] }";

    private final String systemQuestionsPrompt = "Tu es un expert AFSI spÃ©cialisÃ© dans la conduite d'entretiens mÃ©tier. " +
            "Ã€ partir des notes fournies, suggÃ¨re exactement 5 questions pertinentes et prÃ©cises " +
            "Ã  poser lors d'un entretien mÃ©tier pour approfondir la comprÃ©hension du domaine. " +
            "Les questions doivent Ãªtre ouvertes, ciblÃ©es et aider Ã  identifier les besoins, " +
            "les contraintes et les processus mÃ©tier. " +
            "RÃ©ponds UNIQUEMENT en JSON brut sans aucun texte avant ou aprÃ¨s, avec cette structure : " +
            "{ \"questions\": [ { \"question\": \"\" } ] }";

    private final String systemMFCPrompt = """
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
            """;

    public MistralService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.mapper = new ObjectMapper();
    }

    private HttpHeaders setHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.setBearerAuth(cleApi);
        return headers;
    }

    private Map<String, Object> setBody(String content, String systemPrompt) {
        Map<String, Object> body = new HashMap<>();
        body.put("model", "mistral-medium-latest");

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));
        messages.add(Map.of("role", "user", "content", content));

        body.put("messages", messages);
        body.put("response_format", Map.of("type", "json_object"));
        return body;
    }

    private String extractMistralsResponse(HttpEntity<Map<String, Object>> entity) {
        Map<String, Object> response = restTemplate.postForObject(urlApi, entity, Map.class);

        if (response == null || !response.containsKey("choices")) {
            throw new RuntimeException("RÃ©ponse Mistral invalide");
        }

        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");

        if (choices == null || choices.isEmpty()) {
            throw new RuntimeException("Aucun choix retournÃ© par Mistral");
        }

        Map<String, Object> firstChoice = choices.get(0);
        Map<String, Object> message = (Map<String, Object>) firstChoice.get("message");

        if (message == null || message.get("content") == null) {
            throw new RuntimeException("RÃ©ponse Mistral vide");
        }

        String content = (String) message.get("content");

        return content
                .replace("```json", "")
                .replace("```", "")
                .trim();
    }

    private HttpEntity<Map<String, Object>> initEntity(String userContent, String prompt) {
        return new HttpEntity<>(setBody(userContent, prompt), setHeaders());
    }

    public <T> T executerAnalyse(String userContent, String prompt, Class<T> returnType) throws MistralApiException {
        HttpEntity<Map<String, Object>> entity = initEntity(userContent, prompt);

        try {
            String analyseDeMistral = extractMistralsResponse(entity);

            if (analyseDeMistral == null || analyseDeMistral.isBlank()) {
                throw new RuntimeException("RÃ©ponse JSON vide");
            }

            return mapper.readValue(analyseDeMistral, returnType);
        } catch (Exception e) {
            e.printStackTrace();
            throw new MistralApiException(e.getMessage());
        }
    }

    public AnalysisResponse analyserNotes(String notes) {
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(
                setBody(notes, systemNotesPrompt),
                setHeaders()
        );

        try {
            String analyseDeMistral = extractMistralsResponse(entity);
            return mapper.readValue(analyseDeMistral, AnalysisResponse.class);
        } catch (Exception e) {
            System.err.println("Erreur API : " + e.getMessage());
            return new AnalysisResponse();
        }
    }

    public String suggererQuestions(String notes) {
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(
                setBody(notes, systemQuestionsPrompt),
                setHeaders()
        );

        try {
            return extractMistralsResponse(entity);
        } catch (Exception e) {
            return "Erreur API : " + e.getMessage();
        }
    }

    public FluxResponse analyserMFC(String plantUmlContent) {
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(
                setBody(plantUmlContent, systemMFCPrompt),
                setHeaders()
        );

        try {
            String analyseDeMistral = extractMistralsResponse(entity);
            return mapper.readValue(analyseDeMistral, FluxResponse.class);
        } catch (Exception e) {
            System.err.println("Erreur technique lors de l'analyse MFC : " + e.getMessage());
            e.printStackTrace();
            return new FluxResponse();
        }
    }

    public BacklogAnalyseResponse analyserBacklog(String backlogTexte) throws MistralApiException {
        return executerAnalyse(backlogTexte, Prompt.BACKLOG.getPrompt(), BacklogAnalyseResponse.class);
    }

    public BpmnCoherenceIaResponse analyserCoherenceBpmn(String contenuBpmn, String userStories)
            throws MistralApiException {

        String userContent = """
                Tu vas analyser la cohÃ©rence entre un BPMN et des User Stories dans un contexte de Business Analysis.

                Attendus :
                - identifier les acteurs mÃ©tier prÃ©sents dans le BPMN
                - identifier les activitÃ©s mÃ©tier prÃ©sentes dans le BPMN
                - relier les activitÃ©s BPMN aux User Stories correspondantes
                - signaler les User Stories non couvertes
                - signaler les activitÃ©s BPMN non couvertes
                - dÃ©tecter les incohÃ©rences entre acteurs, activitÃ©s et objectifs mÃ©tier
                - produire des messages clairs pour un Business Analyst

                Important :
                - ne jamais utiliser l'expression "User Story non technique"
                - utiliser plutÃ´t des formulations comme "User Story non exploitable" ou "User Story non alignÃ©e avec le BPMN"
                - les recommandations doivent Ãªtre concrÃ¨tes et orientÃ©es BPMN / MFC / MCD si pertinent

                === BPMN ===
                %s

                === USER STORIES ===
                %s
                """.formatted(
                contenuBpmn == null ? "" : contenuBpmn,
                userStories == null ? "" : userStories
        );

        try {
            BpmnCoherenceIaResponse response = executerAnalyse(
                    userContent,
                    Prompt.BPMN_COHERENCE.getPrompt(),
                    BpmnCoherenceIaResponse.class
            );

            if (response == null) {
                response = new BpmnCoherenceIaResponse();
            }

            if (response.getLiens() == null) {
                response.setLiens(new ArrayList<>());
            }
            if (response.getAlertes() == null) {
                response.setAlertes(new ArrayList<>());
            }
            if (response.getUserStoriesNonCouvertes() == null) {
                response.setUserStoriesNonCouvertes(new ArrayList<>());
            }
            if (response.getTachesBpmnNonCouvertes() == null) {
                response.setTachesBpmnNonCouvertes(new ArrayList<>());
            }
            if (response.getResumeGlobal() == null) {
                response.setResumeGlobal("");
            }

            return response;
        } catch (Exception e) {
            e.printStackTrace();
            throw new MistralApiException("Erreur parsing IA: " + e.getMessage());
        }
    }
}