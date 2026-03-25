package com.backend.projet.mistral.service;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@Service
public class MistralService {

    private RestTemplate restTemplate;

    @Value("${mistral.api.key}")
    private String cleApi;

    @Value("${mistral.api.url}")
    private String urlApi;

    private String systemNotesPrompt = "Tu es un expert AFSI. Analyse les notes et extrait les éléments suivants : " +
            "Acteurs, Actions, Objets Métiers, Règles Métiers, Contraintes, Points de Douleur, Doublons, Incohérences, Termes Ambigus. " +
            "Pour chaque élément, trouve la 'valeur' (concept court) et la 'phraseSource' (citation exacte du texte). " +
            "Réponds UNIQUEMENT en JSON brut avec cette structure : " +
            "{ \"elements\": [ { \"categorie\": \"\", \"valeur\": \"\", \"phraseSource\": \"\" } ] }";


    private String systemQuestionsPrompt = "Tu es un expert AFSI spécialisé dans la conduite d'entretiens métier. " +
            "À partir des notes fournies, suggère exactement 5 questions pertinentes et précises " +
            "à poser lors d'un entretien métier pour approfondir la compréhension du domaine. " +
            "Les questions doivent être ouvertes, ciblées et aider à identifier les besoins, " +
            "les contraintes et les processus métier. " +
            "Réponds UNIQUEMENT en JSON brut sans aucun texte avant ou après, avec cette structure : " +
            "{ \"questions\": [ { \"question\": \"\" } ] }";


    public MistralService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public HttpHeaders setHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.setBearerAuth(cleApi);
        return headers;
    }

    public Map<String, Object> setBody(String content, String systemPrompt) {
        Map<String, Object> body = new HashMap<>();
        body.put("model", "mistral-medium-latest");
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));
        messages.add(Map.of("role", "user", "content", content));
        body.put("messages", messages);
        body.put("response_format", Map.of("type", "json_object"));
        return body;
    }

    public String analyserNotes(String notes) {
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(
                setBody(notes, systemNotesPrompt),
                setHeaders()
        );
        try {
            return restTemplate.postForObject(urlApi, entity, String.class);
        } catch (Exception e) {
            return "Erreur API : " + e.getMessage();
        }
    }

    public String suggererQuestions(String notes) {
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(
                setBody(notes, systemQuestionsPrompt),
                setHeaders()
        );

        try {
            return restTemplate.postForObject(urlApi, entity, String.class);
        } catch (Exception e) {
            return "Erreur API : " + e.getMessage();
        }
    }
}