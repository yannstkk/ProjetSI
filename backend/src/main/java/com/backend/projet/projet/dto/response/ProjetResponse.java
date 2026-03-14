package com.backend.projet.projet.dto.response;

import java.time.LocalDate;

public class ProjetResponse {

    private Long idProjet;
    private String nom;
    private LocalDate dateCreation;

    public ProjetResponse(Long idProjet, String nom, LocalDate dateCreation) {
        this.idProjet = idProjet;
        this.nom = nom;
        this.dateCreation = dateCreation;
    }

    // getters
    public Long getIdProjet() { 
    	return idProjet; 
    }
    
    public String getNom() { 
    	return nom; 
    }
    
    public LocalDate getDateCreation() { 
    	return dateCreation; 
    }
}
