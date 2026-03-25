package com.backend.projet.besoin.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TaigaAuthResponse {

    @JsonProperty("auth_token")
    private String token;

    public String getToken(){
        return this.token;
    }

    public void setToken(String token){
        this.token = token;
    }

}
