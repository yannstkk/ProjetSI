package com.backend.projet.besoin.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserStoryRequest {

    @JsonProperty("id")
    private Long taigaId;

    @JsonProperty("ref")
    private int taigaRef;


   public Long getTaigaId(){
       return this.taigaId;
   }

    public String getTaigaRef() {
        return "US-" + this.taigaRef;
    }

    public void setTaigaId(Long taigaId) {
        this.taigaId = taigaId;
    }

    public void setTaigaRef(int taigaRef) {
        this.taigaRef = taigaRef;
    }
}
