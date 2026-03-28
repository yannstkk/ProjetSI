package com.backend.projet.modelisation.dto.request;

public class MFCRequest {
    private String plantUmlContent;
    private Long projetId;
    private String nom;

    public String getPlantUmlContent() {
        return this.plantUmlContent;
    }

    public Long getProjetId() {
        return this.projetId;
    }

    public String getNom() {
        return this.nom;
    }
}
