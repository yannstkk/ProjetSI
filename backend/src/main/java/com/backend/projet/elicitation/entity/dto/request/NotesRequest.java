package com.backend.projet.elicitation.entity.dto.request;


public class NotesRequest {

    private Long numeroInterview;
    private String contenu;

    public NotesRequest() {}

    public Long getNumeroInterview() { 
    	return numeroInterview; 
    }
    
    public void setNumeroInterview(Long numeroInterview) { 
    	this.numeroInterview = numeroInterview; 
    }
    
    public String getContenu() { 
    	return contenu; 
    }
    
    public void setContenu(String contenu) { 
    	this.contenu = contenu; 
    }
}
