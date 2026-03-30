package com.backend.projet.elicitation.dto.response;

/**
 * Data Transfer Object representing the response for an interview question.
 * Contains the question ID, the associated interview ID, and the text of the question.
 */
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