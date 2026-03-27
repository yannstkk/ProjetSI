package com.backend.projet.besoin.dto.response;

import java.util.List;


public class CritereIaResponse {
    private List<String> criteres;
    private String metadata;

    public CritereIaResponse(List<String> criteres) {
        this.criteres = criteres;
    }

    public void setMetadata(String md){
        this.metadata = metadata;
    }

    public String getMetadata(){return this.metadata;}

    public void addCritere(String critere){
        this.criteres.add(critere);
    }

    public List<String> getCriteres(){
        return this.criteres;
    }

    public void deleteCritere(String critere){
        this.criteres.remove(critere);
    }
}