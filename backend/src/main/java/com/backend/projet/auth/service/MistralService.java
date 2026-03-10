package com.backend.projet.auth.service;

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
    private String cleApi; // clé api

    @Value("${mistral.api.url}")
    private String urlApi; // url

    private String systemNotesPrompt = "Tu es un expert AFSI. Analyse les notes et extrait les éléments suivants : " +
            "Acteurs, Actions, Objets Métiers, Règles Métiers, Contraintes, Points de Douleur, Doublons, Incohérences, Termes Ambigus. " +
            "Pour chaque élément, trouve la 'valeur' (concept court) et la 'phraseSource' (citation exacte du texte). " +
            "Réponds UNIQUEMENT en JSON brut avec cette structure : " +
            "{ \"elements\": [ { \"categorie\": \"\", \"valeur\": \"\", \"phraseSource\": \"\" } ] }";

    /**
     * Constructeur pour l'injection de dépendances.
     * * @param restTemplate Le client HTTP configuré dans MistralConfig permettant d'effectuer les appels API.
     */
    public MistralService(RestTemplate restTemplate){
        this.restTemplate = restTemplate;
    }

    /**
     * Prépare les en-têtes HTTP requis pour l'authentification et le format des données.
     * @return HttpHeaders contenant les paramètres de l'en-tête
     */
    public HttpHeaders setHeaders(){
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        //setAccept prend une liste de types acceptés, on n'en a qu'un seul.
        //Collections.singletonList(obj) est le moyen le plus rapide
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.setBearerAuth(cleApi); // pour l'authorisation
        return headers;
    }

    /**
     * Constuit le corps de la requête au format attendu par Mistral AI.
     * @param content content Le texte brut des notes d'entretien à analyser.
     * @return Une Map représentant l'arborescence JSON du corps de la requête.
     */
    public Map<String, Object> setBody(String content){
        /*
            Ce que l'api attends de nous comme body.
            { "model": "mistral-medium-latest",
              "messages": [  --> une liste de map.
                {"role": "system", "content": "Tu es expert AFSI..."},
                {"role": "user", "content": "Texte des notes..."}
                           ],
              "response_format": { "type": "json_object" }}
        */
        Map<String, Object> body = new HashMap<>();
        body.put("model", "mistral-medium-latest");

        // les messages : /!\ Attention point de compréhension /!\
        // les appels API mistral se scindent en 2 :
        // 1. le prompt (fixe, ici systemNotesPromptes)
        // 2. le contenu associé au prompt (ici les notes)

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemNotesPrompt));
        messages.add(Map.of("role", "user", "content", content));

        body.put("messages", messages);
        body.put("response_format", Map.of("type", "json_object"));

        return body;
    }

    /**
     * Execute l'appel post et récupère la réponse brut sous forme de chaîne de caractère
     * La conversion json -> string se fait naturellement  avec le restTemplate
     * @param notes les notes brutes
     * @return La réponse JSON de l'IA contenant les éléments extraits ou un message d'erreur en cas d'échec.
     *
     */
    public String analyserNotes(String notes){
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(setBody(notes), setHeaders());
        // on peut se concentrer sur l'envoi
        try {
            return restTemplate.postForObject(urlApi, entity, String.class);
        }catch (Exception e){
            return "Erreur API : " + e.getMessage();
        }
    }

    /** Dans cette classe, je vais définir tous les appels api à mistral pour nettoyer les données ou gérer la cohérence bref tout ce qui utilise de près ou de loin */
}
