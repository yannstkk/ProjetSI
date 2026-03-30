package com.backend.projet.elicitation.dto.request;

/**
 * Data Transfer Object for creating or updating interview questions.
 */
public class QuestionRequest {

    private Long numeroInterview;
    private String libelle;

    public QuestionRequest() {}

    public Long getNumeroInterview() {
        return numeroInterview;
    }

    public void setNumeroInterview(Long numeroInterview) {
        this.numeroInterview = numeroInterview;
    }

    public String getLibelle() {
        return libelle;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }
}