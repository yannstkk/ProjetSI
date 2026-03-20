package com.backend.projet.projet.dto.response;

import java.time.LocalDate;

public class ProjetResponse {

    private Long idProjet;
    private String nom;
    private LocalDate dateCreation;
    private String idUtilisateur;

    public ProjetResponse(Long idProjet, String nom, LocalDate dateCreation, String idUtilisateur) {
        this.idProjet = idProjet;
        this.nom = nom;
        this.dateCreation = dateCreation;
        this.idUtilisateur = idUtilisateur;
    }

    public Long getIdProjet() { 
    	return idProjet; 
    }
    
    public String getNom() { 
    	return nom; 
    }
    
    public LocalDate getDateCreation() { 
    	return dateCreation; 
    }
    
    public String getIdUtilisateur() { 
    	return idUtilisateur; 
    }
}
