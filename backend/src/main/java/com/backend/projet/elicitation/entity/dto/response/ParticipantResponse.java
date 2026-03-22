package com.backend.projet.elicitation.entity.dto.response;

public class ParticipantResponse {

    private Long idParticipant;
    private String nom;
    private String role;

    public ParticipantResponse(Long idParticipant, String nom, String role) {
        this.idParticipant = idParticipant;
        this.nom = nom;
        this.role = role;
    }

    public Long getIdParticipant() {
        return idParticipant;
    }

    public String getNom() {
        return nom;
    }

    public String getRole() {
        return role;
    }
}