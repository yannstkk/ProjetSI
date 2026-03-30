package com.backend.projet.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Classe qui récupère les réglages des jetons de sécurité (JWT) depuis le fichier de configuration.
 * Elle contient la clé secrète et le temps de validité pour les accès sécurisés.
 */
@Configuration
@ConfigurationProperties(prefix = "jwt")
public class JwtConfig {

    private String key;
    private int expirationTime;

    /**
     * Donne la clé secrète utilisée pour signer les jetons.
     * @return La clé secrète.
     */
    public String getSecret(){
        return this.key;
    }

    /**
     * Enregistre la clé secrète de sécurité.
     * @param key La clé à utiliser.
     */
    public void setSecret(String key){
        this.key = key;
    }

    /**
     * Donne le temps pendant lequel le jeton est valide.
     * @return La durée d'expiration.
     */
    public int getExpirationTime(){
        return this.expirationTime;
    }

    /**
     * Enregistre le temps de validité du jeton.
     * @param expirationTime La nouvelle durée à enregistrer.
     */
    public void setExpirationTime(int expirationTime){
        this.expirationTime = expirationTime;
    }
}
