package com.backend.projet.besoin.dto.response;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Classe qui contient les informations reçues après une connexion réussie à Taiga.
 * Elle regroupe l'identifiant de l'utilisateur, son nom et son jeton d'accès (token).
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class TaigaAuthResponse {

    @JsonAlias("id")
    private Long userId;

    private String username;

    @JsonAlias("auth_token")
    private String token;

    /**
     * Donne l'identifiant unique de l'utilisateur sur Taiga.
     * @return L'identifiant de l'utilisateur.
     */
    public Long getUserId() {
        return this.userId;
    }

    /**
     * Enregistre l'identifiant unique de l'utilisateur.
     * @param userId L'identifiant à enregistrer.
     */
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    /**
     * Donne le nom de l'utilisateur.
     * @return Le nom d'utilisateur.
     */
    public String getUsername() {
        return this.username;
    }

    /**
     * Enregistre le nom de l'utilisateur.
     * @param username Le nom à enregistrer.
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * Donne le jeton d'accès (token) pour s'identifier lors des prochaines demandes.
     * @return Le jeton de connexion Taiga.
     */
    public String getToken() {
        return this.token;
    }

    /**
     * Enregistre le jeton d'accès.
     * @param token Le jeton à enregistrer.
     */
    public void setToken(String token) {
        this.token = token;
    }
}