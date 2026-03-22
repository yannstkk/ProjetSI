package com.backend.projet.elicitation.entity.dto.request;

public class NotesStructureesRequest {

    private Long numeroInterview;
    private String categorie;
    private String contenu;

    public NotesStructureesRequest() {}

    public Long getNumeroInterview() {
        return numeroInterview;
    }

    public void setNumeroInterview(Long numeroInterview) {
        this.numeroInterview = numeroInterview;
    }

    public String getCategorie() {
        return categorie;
    }

    public void setCategorie(String categorie) {
        this.categorie = categorie;
    }

    public String getContenu() {
        return contenu;
    }

    public void setContenu(String contenu) {
        this.contenu = contenu;
    }
}