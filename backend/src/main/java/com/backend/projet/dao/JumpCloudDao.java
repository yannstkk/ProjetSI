package com.backend.projet.dao;
import org.apache.directory.api.ldap.model.exception.LdapException;
import org.apache.directory.ldap.client.api.LdapConnection;
import org.apache.directory.ldap.client.api.LdapNetworkConnection;
import org.springframework.stereotype.Repository;
import com.backend.projet.config.LdapConfig;

import java.io.IOException;

@Repository
public class JumpCloudDao {

    public boolean checkLogin(String username, String password) {

        String user = "uid=" + username + ",ou=Users,o=" + LdapConfig.ORG_ID + ",dc=jumpcloud,dc=com";


        try (LdapConnection ldapConn = new LdapNetworkConnection(LdapConfig.HOST, LdapConfig.PORT)) {
            ldapConn.bind(user, password);
            return true;
        }
        catch (IOException e) {
            System.err.println("Erreur de connexion LDAP : " + e.getMessage());
            return false;
        } catch (LdapException e) {
            System.err.println("Mauvais identifiants.");
            return false;
        }
    }
}
