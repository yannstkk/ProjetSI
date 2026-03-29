package com.backend.projet.modelisation.dto.response;


import java.util.ArrayList;
import java.util.List;

public class BpmnCoherenceIaResponse {

    private List<LienBpmnUsDto> liens = new ArrayList<>();
    private List<AlerteCoherenceDto> alertes = new ArrayList<>();
    private List<UserStoryNonCouverteDto> userStoriesNonCouvertes = new ArrayList<>();
    private List<TacheBpmnNonCouverteDto> tachesBpmnNonCouvertes = new ArrayList<>();
    private String resumeGlobal = "";

    public BpmnCoherenceIaResponse() {
    }

    public List<LienBpmnUsDto> getLiens() {
        return liens != null ? liens : new ArrayList<>();
    }

    public void setLiens(List<LienBpmnUsDto> liens) {
        this.liens = liens;
    }

    public List<AlerteCoherenceDto> getAlertes() {
        return alertes != null ? alertes : new ArrayList<>();
    }

    public void setAlertes(List<AlerteCoherenceDto> alertes) {
        this.alertes = alertes;
    }

    public List<UserStoryNonCouverteDto> getUserStoriesNonCouvertes() {
        return userStoriesNonCouvertes != null ? userStoriesNonCouvertes : new ArrayList<>();
    }

    public void setUserStoriesNonCouvertes(List<UserStoryNonCouverteDto> userStoriesNonCouvertes) {
        this.userStoriesNonCouvertes = userStoriesNonCouvertes;
    }

    public List<TacheBpmnNonCouverteDto> getTachesBpmnNonCouvertes() {
        return tachesBpmnNonCouvertes != null ? tachesBpmnNonCouvertes : new ArrayList<>();
    }

    public void setTachesBpmnNonCouvertes(List<TacheBpmnNonCouverteDto> tachesBpmnNonCouvertes) {
        this.tachesBpmnNonCouvertes = tachesBpmnNonCouvertes;
    }

    public String getResumeGlobal() {
        return resumeGlobal != null ? resumeGlobal : "";
    }

    public void setResumeGlobal(String resumeGlobal) {
        this.resumeGlobal = resumeGlobal;
    }
}