package com.backend.projet.modelisation.dto.response;

public class AlerteCoherenceDto {

    private String type;
    private String titre;
    private String description;
    private String elementBpmn;
    private String userStoryId;
    private String justification;
    private String recommandation;

    public AlerteCoherenceDto() {
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getElementBpmn() {
        return elementBpmn;
    }

    public void setElementBpmn(String elementBpmn) {
        this.elementBpmn = elementBpmn;
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

    public String getRecommandation() {
        return recommandation;
    }

    public void setRecommandation(String recommandation) {
        this.recommandation = recommandation;
    }
}