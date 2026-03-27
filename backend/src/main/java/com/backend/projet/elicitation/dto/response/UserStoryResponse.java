package com.backend.projet.elicitation.dto.response;

public class UserStoryResponse {

    private Long idUs;
    private String ref;
    private String veux;
    private String afin;
    private String priorite;
    private String criteres;
    private String flux;
    private String taigaRef;
    private Long idProjet;
    private Long idActeur;

    public UserStoryResponse(Long idUs, String ref, String veux, String afin,
                             String priorite, String criteres, String flux,
                             String taigaRef, Long idProjet, Long idActeur) {
        this.idUs = idUs;
        this.ref = ref;
        this.veux = veux;
        this.afin = afin;
        this.priorite = priorite;
        this.criteres = criteres;
        this.flux = flux;
        this.taigaRef = taigaRef;
        this.idProjet = idProjet;
        this.idActeur = idActeur;
    }

    public Long getIdUs() {
        return idUs;
    }

    public String getRef() {
        return ref;
    }

    public String getVeux() {
        return veux;
    }

    public String getAfin() {
        return afin;
    }

    public String getPriorite() {
        return priorite;
    }

    public String getCriteres() {
        return criteres;
    }

    public String getFlux() {
        return flux;
    }

    public String getTaigaRef() {
        return taigaRef;
    }

    public Long getIdProjet() {
        return idProjet;
    }

    public Long getIdActeur() {
        return idActeur;
    }
}