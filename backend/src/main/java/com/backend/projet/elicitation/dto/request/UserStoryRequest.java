package com.backend.projet.elicitation.dto.request;

/**
 * Data Transfer Object for creating or updating user stories.
 */
public class UserStoryRequest {

    private String ref;
    private String veux;
    private String afin;
    private String priorite;
    private String criteres;
    private String flux;
    private String taigaRef;
    private Long idProjet;
    private Long idActeur;

    public UserStoryRequest() {}

    public String getRef() {
        return ref;
    }

    public void setRef(String ref) {
        this.ref = ref;
    }

    public String getVeux() {
        return veux;
    }

    public void setVeux(String veux) {
        this.veux = veux;
    }

    public String getAfin() {
        return afin;
    }

    public void setAfin(String afin) {
        this.afin = afin;
    }

    public String getPriorite() {
        return priorite;
    }

    public void setPriorite(String priorite) {
        this.priorite = priorite;
    }

    public String getCriteres() {
        return criteres;
    }

    public void setCriteres(String criteres) {
        this.criteres = criteres;
    }

    public String getFlux() {
        return flux;
    }

    public void setFlux(String flux) {
        this.flux = flux;
    }

    public String getTaigaRef() {
        return taigaRef;
    }

    public void setTaigaRef(String taigaRef) {
        this.taigaRef = taigaRef;
    }

    public Long getIdProjet() {
        return idProjet;
    }

    public void setIdProjet(Long idProjet) {
        this.idProjet = idProjet;
    }

    public Long getIdActeur() {
        return idActeur;
    }

    public void setIdActeur(Long idActeur) {
        this.idActeur = idActeur;
    }
}