package com.backend.projet.modelisation.dto.response;

public class TacheBpmnNonCouverteDto {

    private String nom;
    private String raison;

    public TacheBpmnNonCouverteDto() {
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getRaison() {
        return raison;
    }

    public void setRaison(String raison) {
        this.raison = raison;
    }
}