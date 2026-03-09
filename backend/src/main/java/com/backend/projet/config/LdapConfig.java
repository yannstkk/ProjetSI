package com.backend.projet.config;

public class LdapConfig {

    public static final String HOST = "ldap.eu.jumpcloud.com";
    public static final int PORT = 389;
    public static final String ORG_ID = "69ade7aa293a7e69f85c1df7";
    public static final String BASE_DN = "ou=Users,o=" + ORG_ID + ",dc=jumpcloud,dc=com";
}
