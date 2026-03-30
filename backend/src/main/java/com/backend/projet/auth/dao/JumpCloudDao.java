package com.backend.projet.auth.dao;
import com.backend.projet.auth.AuthentificationException;
import org.apache.directory.api.ldap.model.exception.LdapException;
import org.apache.directory.ldap.client.api.LdapConnection;
import org.apache.directory.ldap.client.api.LdapNetworkConnection;
import org.springframework.stereotype.Repository;
import com.backend.projet.config.LdapConfig;

import java.io.IOException;

/**
 * Classe qui s'occupe de la communication avec le serveur JumpCloud (LDAP).
 * Elle permet de vérifier si un utilisateur existe et si son mot de passe est bon.
 */
@Repository
public class JumpCloudDao {

    private final LdapConfig ldapConfig;

    /**
     * Constructeur recevant les paramètres de configuration.
     * @param ldapConfig Objet contenant l'adresse et les réglages du serveur LDAP.
     */
    public JumpCloudDao(LdapConfig ldapConfig){
        this.ldapConfig = ldapConfig;
    }

    /**
     * Vérifie le nom d'utilisateur et le mot de passe sur le serveur.
     * @param username Le nom de l'utilisateur.
     * @param password Le mot de passe secret.
     * @throws AuthentificationException Si la connexion échoue ou si les identifiants sont faux.
     */
    public void checkLogin(String username, String password) throws AuthentificationException {

        String user = "uid=" + username + "," + this.ldapConfig.getBaseDN();

        try (LdapConnection ldapConn = new LdapNetworkConnection(this.ldapConfig.getHost(), this.ldapConfig.getPort())) {
            ldapConn.bind(user, password);
        }
        catch (IOException e) {
            throw new AuthentificationException("Erreur de connexion LDAP : " + e.getMessage());
        } catch (LdapException e) {
            throw new AuthentificationException("Mauvais identifiants.");
        }
    }
}
