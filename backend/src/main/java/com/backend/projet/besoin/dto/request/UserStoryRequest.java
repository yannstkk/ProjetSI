package com.backend.projet.besoin.dto.request;

public class UserStoryRequest {


    private Long project;
    private String subject;

    public UserStoryRequest(String subject, Long project){
        this.subject = subject;
        this.project = project;
    }

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
