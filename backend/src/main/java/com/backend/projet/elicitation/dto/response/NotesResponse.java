package com.backend.projet.elicitation.dto.response;

/**
 * Data Transfer Object representing the response for interview notes.
 * Contains the notes ID, the associated interview ID, and the raw content of the notes.
 */
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
