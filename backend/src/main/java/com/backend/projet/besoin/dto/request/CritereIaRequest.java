package com.backend.projet.besoin.dto.request;

public class CritereIaRequest {
    private String acteur;
    private String veux;
    private String afin;

    public String getActeur() { return acteur; }

    public void setActeur(String acteur) { this.acteur = acteur; }

    public String getVeux() { return veux; }

    public void setVeux(String veux) { this.veux = veux; }

    public String getAfin() { return afin; }

    public void setAfin(String afin) { this.afin = afin; }
}