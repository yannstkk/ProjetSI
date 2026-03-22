package com.backend.projet.elicitation.entity.dto.response;

public class QuestionResponse {

    private Long numeroQuestion;
    private Long numeroInterview;
    private String libelle;

    public QuestionResponse(Long numeroQuestion, Long numeroInterview, String libelle) {
        this.numeroQuestion = numeroQuestion;
        this.numeroInterview = numeroInterview;
        this.libelle = libelle;
    }

    public Long getNumeroQuestion() {
        return numeroQuestion;
    }

    public Long getNumeroInterview() {
        return numeroInterview;
    }

    public String getLibelle() {
        return libelle;
    }
}