package com.backend.projet.mistral.service;
import com.backend.projet.elicitation.dto.response.AnalysisResponse;
import com.backend.projet.modelisation.dto.FluxResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
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

    private String systemMFCPrompt = """
            Tu es un expert AFSI spécialisé dans l'analyse systémique et Merise.
            Analyse ce diagramme de flux MFC (PlantUML) et extrais chaque interaction.
            
            Pour chaque flux, remplis :
            - "nom" : Le libellé du flux.
            - "emetteur" : L'acteur à l'origine.
            - "recepteur" : L'acteur de destination.
            - "description" : Une brève explication du but du flux.
            - "data" : Liste les objets métiers ou documents précis circulant dans ce flux (ex: "Facture", "Client", "RIB"). C'est CRUCIAL pour la cohérence avec le MCD/BPMN.
            
            Réponds UNIQUEMENT en JSON brut : 
            { "flux" : [ { "nom" : "", "emetteur" : "", "recepteur" : "", "description" : "", "data" :"" }]}
            """;

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

    public AnalysisResponse analyserNotes(String notes) {
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(
                setBody(notes, systemNotesPrompt),
                setHeaders()
        );
        try {
            String res = restTemplate.postForObject(urlApi, entity, String.class);
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(res, AnalysisResponse.class);

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
            return restTemplate.postForObject(urlApi, entity, String.class);
        } catch (Exception e) {
            return "Erreur API : " + e.getMessage();
        }
    }

    public FluxResponse analyserMFC(String plantUmlContent) {
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(
                setBody(plantUmlContent, systemMFCPrompt),
                setHeaders()
        );
        try{
            String reponseMistral = restTemplate.postForObject(urlApi, entity, String.class);
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(reponseMistral, FluxResponse.class);

        }catch(Exception e){
            System.err.println("Erreur API : " + e.getMessage());
            return new FluxResponse();
        }
    }
}