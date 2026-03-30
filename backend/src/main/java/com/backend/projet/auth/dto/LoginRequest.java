package com.backend.projet.auth.dto;

/**
 * Classe qui contient les informations envoyées pour se connecter.
 * Il sert à transporter le nom d'utilisateur et le mot de passe.
 */
public class LoginRequest {
    private String username;
    private String password;

    /**
     * Donne le nom de l'utilisateur.
     * @return Le nom d'utilisateur.
     */
    public String getUsername(){
        return this.username;
    }

    /**
     * Enregistre le nom de l'utilisateur.
     * @param username Le nom de l'utilisateur à enregistrer.
     */
    public void setUsername(String username){
        this.username = username;
    }

    /**
     * Donne le mot de passe.
     * @return Le mot de passe.
     */
    public String getPassword(){
        return this.password;
    }

    /**
     * Enregistre le mot de passe.
     * @param password Le mot de passe à enregistrer.
     */
    public void setPassword(String password){
        this.password = password;
    }
}
