package com.backend.projet.besoin.dto.request;

public class TaigaAuthRequest {

    private String username;
    private String password;
    private String type;

    public TaigaAuthRequest(String username, String password){
        this.username = username;
        this.password = password;
        this.type = "normal";
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

}
