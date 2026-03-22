package com.backend.projet.besoin.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class UserStoryRequest {

    private Long project;
    private String subject;

    public String getSubject() {
        return this.subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public Long getProject() {
        return this.project;
    }

    public void setProject(Long project) {
        this.project = project;
    }
}
