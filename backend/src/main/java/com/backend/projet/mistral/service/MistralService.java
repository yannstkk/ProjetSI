package com.backend.projet.mistral.service;

import com.backend.projet.elicitation.dto.response.AnalysisResponse;
import com.backend.projet.mistral.dto.BacklogAnalyseResponse;
import com.backend.projet.mistral.enums.Prompt;
import com.backend.projet.mistral.exceptions.MistralApiException;
import com.backend.projet.modelisation.dto.response.FluxResponse;
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

    private final String systemNotesPrompt = "Tu es un expert AFSI. Analyse les notes et extrait les éléments suivants : " +
            "Acteurs, Actions, Objets Métiers, Règles Métiers, Contraintes, Points de Douleur, Doublons, Incohérences, Termes Ambigus. " +
            "Pour chaque élément, trouve la 'valeur' (concept court) et la 'phraseSource' (citation exacte du texte). " +
            "Réponds UNIQUEMENT en JSON brut avec cette structure : " +
            "{ \"elements\": [ { \"categorie\": \"\", \"valeur\": \"\", \"phraseSource\": \"\" } ] }";

    private final String systemQuestionsPrompt = "Tu es un expert AFSI spécialisé dans la conduite d'entretiens métier. " +
            "À partir des notes fournies, suggère exactement 5 questions pertinentes et précises " +
            "à poser lors d'un entretien métier pour approfondir la compréhension du domaine. " +
            "Les questions doivent être ouvertes, ciblées et aider à identifier les besoins, " +
            "les contraintes et les processus métier. " +
            "Réponds UNIQUEMENT en JSON brut sans aucun texte avant ou après, avec cette structure : " +
            "{ \"questions\": [ { \"question\": \"\" } ] }";

    private final String systemMFCPrompt = """
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
            throw new RuntimeException("Réponse Mistral invalide");
        }

        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");

        if (choices == null || choices.isEmpty()) {
            throw new RuntimeException("Aucun choix retourné par Mistral");
        }

        Map<String, Object> firstChoice = choices.get(0);
        Map<String, Object> message = (Map<String, Object>) firstChoice.get("message");

        if (message == null || message.get("content") == null) {
            throw new RuntimeException("Réponse Mistral vide");
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
                throw new RuntimeException("Réponse JSON vide");
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
                Tu vas analyser la cohérence entre un BPMN et des User Stories dans un contexte de Business Analysis.

                Attendus :
                - identifier les acteurs métier présents dans le BPMN
                - identifier les activités métier présentes dans le BPMN
                - relier les activités BPMN aux User Stories correspondantes
                - signaler les User Stories non couvertes
                - signaler les activités BPMN non couvertes
                - détecter les incohérences entre acteurs, activités et objectifs métier
                - produire des messages clairs pour un Business Analyst

                Important :
                - ne jamais utiliser l'expression "User Story non technique"
                - utiliser plutôt des formulations comme "User Story non exploitable" ou "User Story non alignée avec le BPMN"
                - les recommandations doivent être concrètes et orientées BPMN / MFC / MCD si pertinent

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