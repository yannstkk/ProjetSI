package com.backend.projet.auth.dao;
import com.backend.projet.common.exception.AuthentificationException;
import org.apache.directory.api.ldap.model.exception.LdapException;
import org.apache.directory.ldap.client.api.LdapConnection;
import org.apache.directory.ldap.client.api.LdapNetworkConnection;
import org.springframework.stereotype.Repository;
import com.backend.projet.common.config.LdapConfig;

import java.io.IOException;

@Repository
public class JumpCloudDao {

    private final LdapConfig ldapConfig;

    public JumpCloudDao(LdapConfig ldapConfig){
        this.ldapConfig = ldapConfig;
    }

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
