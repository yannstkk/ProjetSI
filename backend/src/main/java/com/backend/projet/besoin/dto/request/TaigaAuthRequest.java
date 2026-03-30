package com.backend.projet.besoin.dto.request;

/**
 * Classe qui contient les informations nécessaires pour s'identifier sur Taiga.
 * Il transporte le nom d'utilisateur, le mot de passe et le type de connexion.
 */
public class TaigaAuthRequest {

    private String username;
    private String password;
    private String type;

    public TaigaAuthRequest() {
    }

    /**
     * Constructeur pour créer une demande de connexion avec un nom et un mot de passe.
     * Par défaut, le type est réglé sur "normal".
     * @param username Le nom de l'utilisateur Taiga.
     * @param password Le mot de passe de l'utilisateur Taiga.
     */
    public TaigaAuthRequest(String username, String password){
        this.username = username;
        this.password = password;
        this.type = "normal";
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
     * @param username Le nom de l'utilisateur à enregistrer.
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * Donne le mot de passe.
     * @return Le mot de passe.
     */
    public String getPassword() {
        return this.password;
    }

    /**
     * Enregistre le mot de passe.
     * @param password Le mot de passe à enregistrer.
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * Donne le type de connexion.
     * @return Le type (par exemple "normal").
     */
    public String getType() {
        return this.type;
    }

    /**
     * Enregistre le type de connexion.
     * @param type Le type à enregistrer.
     */
    public void setType(String type) {
        this.type = type;
    }

}
