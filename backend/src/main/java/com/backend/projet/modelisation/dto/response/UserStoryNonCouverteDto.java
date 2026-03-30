package com.backend.projet.modelisation.dto.response;

public class UserStoryNonCouverteDto {

    private String id;
    private String raison;

    public UserStoryNonCouverteDto() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRaison() {
        return raison;
    }

    public void setRaison(String raison) {
        this.raison = raison;
    }
}
