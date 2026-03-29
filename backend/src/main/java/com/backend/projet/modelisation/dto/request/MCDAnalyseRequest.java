package com.backend.projet.modelisation.dto.request;

public class MCDAnalyseRequest {

    private String contenuPlantuml;

    public MCDAnalyseRequest() {}

    public String getContenuPlantuml()                      { return contenuPlantuml; }
    public void   setContenuPlantuml(String contenuPlantuml){ this.contenuPlantuml = contenuPlantuml; }
}