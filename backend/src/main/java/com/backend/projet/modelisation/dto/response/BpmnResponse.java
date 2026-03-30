package com.backend.projet.modelisation.dto.response;

public class BpmnResponse {

    private Long idBpmn;
    private Long idProjet;
    private String titre;
    private String contenu;

    public BpmnResponse(Long idBpmn, Long idProjet, String titre, String contenu) {
        this.idBpmn = idBpmn;
        this.idProjet = idProjet;
        this.titre = titre;
        this.contenu = contenu;
    }

    public Long getIdBpmn() {
        return idBpmn;
    }

    public void setIdBpmn(Long idBpmn) {
        this.idBpmn = idBpmn;
    }

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