package com.backend.projet.besoin.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Classe qui représente un critère avec son nom et sa description.
 * Cette classe est utilisée pour recevoir les données d'un critère, en ignorant les champs inconnus.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class CritereDto {

    private String nom;
    private String description;

    public CritereDto() {}

    /**
     * Constructeur pour créer un critère avec un nom et une description.
     * @param nom Le nom du critère.
     * @param description Le texte expliquant le critère.
     */
    public CritereDto(String nom, String description) {
        this.nom = nom;
        this.description = description;
    }

    /**
     * Donne le nom du critère.
     * @return Le nom enregistré.
     */
    public String getNom() {
        return nom;
    }

    /**
     * Enregistre le nom du critère.
     * @param nom Le nouveau nom à enregistrer.
     */
    public void setNom(String nom) {
        this.nom = nom;
    }

    /**
     * Donne la description du critère.
     * @return Le texte de la description.
     */
    public String getDescription() {
        return description;
    }

    /**
     * Enregistre la description du critère.
     * @param description La nouvelle description à enregistrer.
     */
    public void setDescription(String description) {
        this.description = description;
    }
}