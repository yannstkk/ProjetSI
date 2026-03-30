package com.backend.projet.projet.dto.response;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * DTO representing the structured output of a project analysis.
 * Contains a list of extracted elements such as actors, actions, and business objects.
 */
public class AnalysisResponse {
    public List<AnalyseElement> elements;

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AnalyseElement {
        public String categorie;    // Acteurs, Actions, Objets Métiers, etc.
        public String valeur;       // Le concept extrait par l'IA
        public String phraseSource; // La preuve textuelle (citation exacte)
    }
}