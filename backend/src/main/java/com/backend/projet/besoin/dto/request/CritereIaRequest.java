package com.backend.projet.besoin.dto.request;

/**
 * Objet qui contient les éléments d'une User Story pour demander une analyse à l'IA.
 * Il regroupe l'acteur, l'action voulue et le but final.
 */
public class CritereIaRequest {
    private String acteur;
    private String veux;
    private String afin;

    /**
     * Donne le nom de l'acteur (le "En tant que").
     * @return Le nom de l'acteur.
     */
    public String getActeur() { return acteur; }

    /**
     * Enregistre le nom de l'acteur.
     * @param acteur Le nom de l'acteur à enregistrer.
     */
    public void setActeur(String acteur) { this.acteur = acteur; }

    /**
     * Donne l'action souhaitée (le "Je veux").
     * @return L'action voulue.
     */
    public String getVeux() { return veux; }

    /**
     * Enregistre l'action souhaitée.
     * @param veux L'action à enregistrer.
     */
    public void setVeux(String veux) { this.veux = veux; }

    /**
     * Donne la raison ou le but (le "Afin de").
     * @return Le but recherché.
     */
    public String getAfin() { return afin; }

    /**
     * Enregistre la raison ou le but.
     * @param afin Le but à enregistrer.
     */
    public void setAfin(String afin) { this.afin = afin; }
}