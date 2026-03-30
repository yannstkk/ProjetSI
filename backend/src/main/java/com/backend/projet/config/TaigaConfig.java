package com.backend.projet.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Classe qui récupère les réglages de connexion à l'outil Taiga depuis le fichier de configuration.
 * Elle contient le nom d'utilisateur, le mot de passe et l'adresse de l'API.
 */
@Configuration
@ConfigurationProperties(prefix = "taiga")
public class TaigaConfig {

    private String username;
    private String password;
    private String url;

    /**
     * Donne le nom d'utilisateur pour se connecter à Taiga.
     * @return Le nom d'utilisateur.
     */
    public String getUsername(){
        return this.username;
    }

    /**
     * Donne le mot de passe pour se connecter à Taiga.
     * @return Le mot de passe.
     */
    public String getPassword(){
        return this.password;
    }

    /**
     * Donne l'adresse (URL) de l'API de Taiga.
     * @return L'URL de connexion.
     */
    public String getUrl(){
        return this.url;
    }

    /**
     * Enregistre le nom d'utilisateur pour Taiga.
     * @param username Le nouveau nom d'utilisateur à enregistrer.
     */
    public void setUsername(String username){
        this.username = username;
    }

    /**
     * Enregistre le mot de passe pour Taiga.
     * @param password Le nouveau mot de passe à enregistrer.
     */
    public void setPassword(String password){
        this.password = password;
    }

    /**
     * Enregistre l'adresse (URL) de l'API de Taiga.
     * @param url La nouvelle adresse à enregistrer.
     */
    public void setUrl(String url){
        this.url = url;
    }

}
