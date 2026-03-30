package com.backend.projet.modelisation.dto.request;

public class BpmnRequest {

    private Long idProjet;
    private String titre;
    private String contenu;

    public BpmnRequest() {}

    public Long getIdProjet() {
        return idProjet;
    }

    public void setIdProjet(Long idProjet) {
        this.idProjet = idProjet;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getContenu() {
        return contenu;
    }

    public void setContenu(String contenu) {
        this.contenu = contenu;
    }
}