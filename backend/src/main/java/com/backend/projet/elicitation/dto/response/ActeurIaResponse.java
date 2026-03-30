package com.backend.projet.elicitation.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

/**
 * Data Transfer Object representing the AI's response when detecting actors.
 * Contains a list of detected actors with their roles and source context.
 */
public class ActeurIaResponse {
    public List<ActeurIaResponse.acteursDetecte> acteurs;

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class acteursDetecte {
        public String nom;
        public String role;
        public String phraseSource;
    }

}