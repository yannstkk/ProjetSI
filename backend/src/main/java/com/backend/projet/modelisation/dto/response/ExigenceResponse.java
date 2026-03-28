package com.backend.projet.modelisation.dto.response;

import java.util.List;

public class ExigenceResponse {
    private String code;
    private String libelle;
    private String description;
    private List<String> usLiees;

    public ExigenceResponse() {}

    public ExigenceResponse(String code, String libelle, String description, List<String> usLiees) {
        this.code = code;
        this.libelle = libelle;
        this.description = description;
        this.usLiees = usLiees;
    }


    public String getCode() { return code; }

    public void setCode(String code) { this.code = code; }


    public String getLibelle() { return libelle; }

    public void setLibelle(String libelle) { this.libelle = libelle; }


    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }


    public List<String> getUsLiees() { return usLiees; }

    public void setUsLiees(List<String> usLiees) { this.usLiees = usLiees; }

}