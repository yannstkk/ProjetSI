package com.backend.projet.besoin.dto.response;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Classe qui contient les informations d'un projet provenant de Taiga.
 * Il permet de récupérer l'identifiant, le nom et le lien unique (slug) du projet.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProjectTaigaResponse {

    private Long id;

    @JsonAlias("name")
    private String nom;

    private String slug;

    /**
     * Donne l'identifiant unique du projet.
     * @return L'identifiant du projet.
     */
    public Long getId() {
        return this.id;
    }

    /**
     * Enregistre l'identifiant unique du projet.
     * @param id L'identifiant à enregistrer.
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Donne le nom du projet.
     * @return Le nom du projet.
     */
    public String getNom() {
        return this.nom;
    }

    /**
     * Enregistre le nom du projet.
     * @param nom Le nom à enregistrer.
     */
    public void setNom(String nom) {
        this.nom = nom;
    }

    /**
     * Donne l'identifiant court (slug) utilisé dans l'URL du projet.
     * @return Le slug du projet.
     */
    public String getSlug() {
        return this.slug;
    }

    /**
     * Enregistre l'identifiant court (slug) du projet.
     * @param slug Le slug à enregistrer.
     */
    public void setSlug(String slug) {
        this.slug = slug;
    }
}
