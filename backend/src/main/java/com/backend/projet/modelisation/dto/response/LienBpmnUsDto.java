package com.backend.projet.modelisation.dto.response;

public class LienBpmnUsDto {

    private String tacheBpmn;
    private String userStoryId;
    private String justification;
    private Integer score;

    public LienBpmnUsDto() {
    }

    public String getTacheBpmn() {
        return tacheBpmn;
    }

    public void setTacheBpmn(String tacheBpmn) {
        this.tacheBpmn = tacheBpmn;
    }

    public String getUserStoryId() {
        return userStoryId;
    }

    public void setUserStoryId(String userStoryId) {
        this.userStoryId = userStoryId;
    }

    public String getJustification() {
        return justification;
    }

    public void setJustification(String justification) {
        this.justification = justification;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }
}