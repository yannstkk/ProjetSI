package com.backend.projet.elicitation.entity.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

public class AnalysisResponse {
    public List<AnalyseElement> elements;

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AnalyseElement {
        public String categorie;    // Acteurs, Actions, Objets Métiers, etc.
        public String valeur;       // Le concept extrait par l'IA
        public String phraseSource; // La preuve textuelle (citation exacte)
    }
}