package com.backend.projet.modelisation.dto.request;

public class MCDRequest {

    private String contenu;
    private Long idProjet;

    public MCDRequest() {}

    public String getContenu() { return contenu; }
    public void setContenu(String contenu) { this.contenu = contenu; }
    public Long getIdProjet() { return idProjet; }
    public void setIdProjet(Long idProjet) { this.idProjet = idProjet; }
}