package com.backend.projet.modelisation.dto;

import java.util.List;

public class FluxResponse {
    public List<FluxElement> flux;

    public static class FluxElement {
        public String nom;
        public String emetteur;
        public String recepteur;
        public String description;
        public String data;
    }
}