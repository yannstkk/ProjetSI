package com.backend.projet.elicitation.entity.dto.request;

public class NotesRequest {

    private Long idProjet;
    private String contenu;

    public Long getIdProjet() { 
    	return idProjet; 
    }
    
    public void setIdProjet(Long idProjet) {
    	this.idProjet = idProjet; 
    }
    
    public String getContenu() { 
    	return contenu; 
    }
    
    public void setContenu(String contenu) { 
    	this.contenu = contenu; 
    }
    
}
