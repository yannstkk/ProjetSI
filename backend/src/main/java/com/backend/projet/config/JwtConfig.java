package com.backend.projet.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "jwt")
public class JwtConfig {

    private String key;
    private int expirationTime;

    public String getSecret(){
        return this.key;
    }

    public void setSecret(String key){
        this.key = key;
    }

    public int getExpirationTime(){
        return this.expirationTime;
    }

    public void setExpirationTime(int expirationTime){
        this.expirationTime = expirationTime;
    }
}
