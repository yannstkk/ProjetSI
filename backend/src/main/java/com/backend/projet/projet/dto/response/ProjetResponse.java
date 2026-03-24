package com.backend.projet.projet.dto.response;

import java.time.LocalDate;

public class ProjetResponse {

    private Long idProjet;
    private String nom;
    private LocalDate dateCreation;
    private String idUser;

    public ProjetResponse(Long idProjet, String nom, LocalDate dateCreation, String idUser) {
        this.idProjet = idProjet;
        this.nom = nom;
        this.dateCreation = dateCreation;
        this.idUser = idUser;
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
    
    public String getIdUser() { 
    	return idUser; 
    }
}