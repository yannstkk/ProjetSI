package com.backend.projet.elicitation.entity.dto.response;

public class NotesResponse {

    private Long numeroNotes;
    private Long numeroInterview;
    private String contenu;

    public NotesResponse(Long numeroNotes, Long numeroInterview, String contenu) {
        this.numeroNotes = numeroNotes;
        this.numeroInterview = numeroInterview;
        this.contenu = contenu;
    }

    public Long getNumeroNotes() { 
    	return numeroNotes; 
    }
    
    public Long getNumeroInterview() { 
    	return numeroInterview; 
    }
    
    public String getContenu() { 
    	return contenu; 
    }
}
