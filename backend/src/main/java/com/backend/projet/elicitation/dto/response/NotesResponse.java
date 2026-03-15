package com.backend.projet.elicitation.dto.response;

public class NotesResponse {

    private Long numeroNotes;
    private Long idProjet;
    private String contenu;

    public NotesResponse(Long numeroNotes, Long idProjet, String contenu) {
        this.numeroNotes = numeroNotes;
        this.idProjet = idProjet;
        this.contenu = contenu;
    }

    public Long getNumeroNotes() { 
    	return numeroNotes; 
    }
    
    public Long getIdProjet() { 
    	return idProjet; 
    }
    
    public String getContenu() { 
    	return contenu; 
    }
}
