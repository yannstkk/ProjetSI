package com.backend.projet.besoin.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Objet qui contient les informations pour créer une User Story sur Taiga.
 * Cette classe ignore les données supplémentaires reçues qui ne sont pas utiles.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserStoryRequest {

    private Long project;
    private String subject;

    /**
     * Donne le titre de la User Story.
     * @return Le titre ou le sujet de la demande.
     */
    public String getSubject() {
        return this.subject;
    }

    /**
     * Enregistre le titre de la User Story.
     * @param subject Le titre à enregistrer.
     */
    public void setSubject(String subject) {
        this.subject = subject;
    }

    /**
     * Donne l'identifiant du projet Taiga.
     * @return L'identifiant unique du projet.
     */
    public Long getProject() {
        return this.project;
    }

    /**
     * Enregistre l'identifiant du projet Taiga.
     * @param project L'identifiant à enregistrer.
     */
    public void setProject(Long project) {
        this.project = project;
    }
}
