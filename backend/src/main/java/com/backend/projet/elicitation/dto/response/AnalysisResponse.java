package com.backend.projet.elicitation.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

/**
 * Data Transfer Object representing the AI's structured analysis of interview notes.
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