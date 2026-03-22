package com.backend.projet.elicitation.entity.dto.request;

public class ParticipantRequest {

    private String nom;
    private String role;

    public ParticipantRequest() {}

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}