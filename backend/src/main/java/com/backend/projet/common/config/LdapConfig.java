package com.backend.projet.common.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "ldap")
public class LdapConfig {

    private String host;
    private int port;
    private String orgId;

    public String getHost() {
        return this.host;
    }

    public int getPort() {
        return this.port;
    }

    public String getOrgId() {
        return this.orgId;
    }

    public String getBaseDN() {
        return "ou=Users,o=" + this.getOrgId() + ",dc=jumpcloud,dc=com";
    }

    public void setHost(String host) {
        this.host = host;
    }

    public void setPort(int port) {
        this.port = port;
    }

    public void setOrgId(String orgId) {
        this.orgId = orgId;
    }

}