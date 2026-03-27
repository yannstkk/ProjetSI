package com.backend.projet.elicitation.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

public class ActeurIaResponse {
    public List<ActeurIaResponse.acteursDetecte> acteurs;

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class acteursDetecte {
        public String nom;
        public String role;
        public String phraseSource;
    }

}