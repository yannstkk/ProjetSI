package com.backend.projet.modelisation.dto.request;

import java.util.List;

public class ExigenceRequest {
    private String code;
    private String libelle;
    private String description;
    private List<String> usLiees;


    public ExigenceRequest() {}


    public String getCode() { return code; }

    public void setCode(String code) { this.code = code; }


    public String getLibelle() { return libelle; }

    public void setLibelle(String libelle) { this.libelle = libelle; }


    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }


    public List<String> getUsLiees() { return usLiees; }

    public void setUsLiees(List<String> usLiees) { this.usLiees = usLiees; }
}