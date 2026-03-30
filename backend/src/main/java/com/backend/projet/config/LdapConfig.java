package com.backend.projet.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Classe qui récupère les réglages de connexion au serveur LDAP (JumpCloud) depuis le fichier de configuration.
 * Elle contient l'adresse, le port et l'identifiant de l'organisation nécessaires pour l'annuaire.
 */
@Configuration
@ConfigurationProperties(prefix = "ldap")
public class LdapConfig {

    private String host;
    private int port;
    private String orgId;

    /**
     * Donne l'adresse (hôte) du serveur LDAP.
     * @return L'adresse du serveur.
     */
    public String getHost() {
        return this.host;
    }

    /**
     * Donne le numéro de port utilisé pour la connexion.
     * @return Le numéro de port.
     */
    public int getPort() {
        return this.port;
    }

    /**
     * Donne l'identifiant de l'organisation sur JumpCloud.
     * @return L'identifiant de l'organisation.
     */
    public String getOrgId() {
        return this.orgId;
    }

    /**
     * Génère le chemin de base (Base DN) pour trouver les utilisateurs dans l'annuaire.
     * @return Le chemin formaté pour la recherche LDAP.
     */
    public String getBaseDN() {
        return "ou=Users,o=" + this.getOrgId() + ",dc=jumpcloud,dc=com";
    }

    /**
     * Enregistre l'adresse du serveur LDAP.
     * @param host La nouvelle adresse à enregistrer.
     */
    public void setHost(String host) {
        this.host = host;
    }

    /**
     * Enregistre le numéro de port pour la connexion.
     * @param port Le nouveau port à enregistrer.
     */
    public void setPort(int port) {
        this.port = port;
    }

    /**
     * Enregistre l'identifiant de l'organisation.
     * @param orgId Le nouvel identifiant à enregistrer.
     */
    public void setOrgId(String orgId) {
        this.orgId = orgId;
    }

}