package com.backend.projet.mistral.service;
import com.backend.projet.elicitation.dto.response.AnalysisResponse;
import com.backend.projet.mistral.exceptions.MistralApiException;
import com.backend.projet.modelisation.dto.response.FluxResponse;
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

    private ObjectMapper mapper;

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
            - "data" : Liste les objets métiers sous forme d'une SEULE chaîne de caractères séparés par des virgules (ex: \\"Facture, Client, RIB\\").". C'est CRUCIAL pour la cohérence avec le MCD/BPMN.
            
            Réponds UNIQUEMENT en JSON brut : 
            { "flux" : [ { "nom" : "", "emetteur" : "", "recepteur" : "", "description" : "", "data" :"" }]}
            """;

    /**
     * Initialise le service avec le RestTemplate requis et configure l'ObjectMapper.
     * @param restTemplate le client HTTP utilisé pour les appels API.
     */
    public MistralService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.mapper = new ObjectMapper();
    }

    /**
     * Configure les en-têtes HTTP pour l'API Mistral, incluant l'authentification Bearer.
     * @return HttpHeaders configurés pour une requête JSON avec authentification.
     */
    private HttpHeaders setHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.setBearerAuth(cleApi);
        return headers;
    }

    /**
     * Construit le corps de la requête JSON pour l'API Mistral.
     * Définit le modèle, les rôles (system/user) et force le format de réponse en JSON.
     * @param content Le contenu textuel fourni par l'utilisateur.
     * @param systemPrompt Les instructions spécifiques pour guider l'IA.
     * @return Une Map représentant la structure JSON attendue par Mistral.
     */
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

    /**
     * Exécute l'appel à l'API et extrait uniquement le contenu textuel de la réponse.
     * Nettoie également les éventuelles balises Markdown (ex: ```json) envoyées par l'IA.
     * @param entity L'entité HTTP contenant le corps et les headers.
     * @return La chaîne de caractères JSON épurée provenant de Mistral.
     */
    private String extractMistralsResponse(HttpEntity<Map<String, Object>> entity){
        Map<String, Object> response = restTemplate.postForObject(urlApi, entity, Map.class);
        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        String content = (String) message.get("content");
        return content.replace("```json", "").replace("```", "").trim();
    }

    /**
     * Méthode utilitaire pour initialiser l'entité HTTP à partir du contenu et du prompt.
     * @param userContent Texte de l'utilisateur.
     * @param prompt Instructions système.
     * @return L'objet HttpEntity prêt pour l'envoi.
     */
    private HttpEntity<Map<String, Object>> initEntity(String userContent, String prompt){
        return new HttpEntity<>(setBody(userContent, prompt),setHeaders());
    }

    /**
     * Méthode générique orchestrant l'analyse complète : préparation, appel et désérialisation.
     * @param <T> Le type de DTO de réponse attendu.
     * @param userContent Le contenu à analyser.
     * @param prompt Le prompt système à appliquer.
     * @param returnType La classe de destination pour le mapping JSON.
     * @return Une instance de returnType contenant les données extraites par l'IA.
     * @throws MistralApiException Si une erreur survient lors de l'appel ou du parsing.
     */
    public <T> T executerAnalyse(String userContent, String prompt, Class<T> returnType) throws MistralApiException {
        HttpEntity<Map<String, Object>> entity = initEntity(userContent, prompt);
        try{
            String analyseDeMistral = extractMistralsResponse(entity);

            return mapper.readValue(analyseDeMistral, returnType);
        }catch(Exception e){
            e.printStackTrace();
            throw new MistralApiException(e.getMessage());
        }
    }


    /**
     * Analyse des notes textuelles pour en extraire les concepts métiers (Acteurs, Actions, etc.).
     * @param notes Le texte brut des notes d'entretien.
     * @return Un objet AnalysisResponse contenant la liste des éléments catégorisés.
     */
    public AnalysisResponse analyserNotes(String notes) {
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(
                setBody(notes, systemNotesPrompt),
                setHeaders()
        );
        try {
            Map<String, Object> response = restTemplate.postForObject(urlApi, entity, Map.class);
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            String analyseDeMistral = (String) message.get("content");

            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(analyseDeMistral, AnalysisResponse.class);


        } catch (Exception e) {
            System.err.println("Erreur API : " + e.getMessage());
            return new AnalysisResponse();
        }
    }

    /**
     * Génère une suggestion de 5 questions d'entretien à partir de notes existantes.
     * @param notes Les notes de base pour générer les questions.
     * @return Une String au format JSON contenant les questions suggérées.
     */
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

    /**
     * Analyse un diagramme de flux PlantUML pour extraire les interactions entre acteurs.
     * @param plantUmlContent Le code source du diagramme PlantUML.
     * @return Un objet FluxResponse contenant la liste structurée des flux et données.
     */
    public FluxResponse analyserMFC(String plantUmlContent) {
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(
                setBody(plantUmlContent, systemMFCPrompt),
                setHeaders()
        );
        try {
            Map<String, Object> response = restTemplate.postForObject(urlApi, entity, Map.class);

            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            String analyseDeMistral = (String) message.get("content");

            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(analyseDeMistral, FluxResponse.class);

        } catch (Exception e) {
            System.err.println("Erreur technique lors de l'analyse MFC : " + e.getMessage());
            e.printStackTrace(); // ça m'aide à mieux lire les erreurs !!!
            return new FluxResponse();
        }
    }
}