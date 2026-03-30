package com.backend.projet.modelisation.dto.request;

public class BpmnAnalyseRequest {

    private String contenuBpmn;
    private String userStories;

    public BpmnAnalyseRequest() {
    }

    public String getContenuBpmn() {
        return contenuBpmn;
    }

    public void setContenuBpmn(String contenuBpmn) {
        this.contenuBpmn = contenuBpmn;
    }

    public String getUserStories() {
        return userStories;
    }

    public void setUserStories(String userStories) {
        this.userStories = userStories;
    }
}