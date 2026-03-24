package com.backend.projet.projet.dto.request;

public class ProjetRequest {

    private String nom;
    private String idUser;

    public ProjetRequest() {}

    public String getNom() { 
    	return nom; 
    }
    
    public void setNom(String nom) { 
    	this.nom = nom; 
    }
    
    public String getIdUser() { 
    	return idUser; 
    }
    
    public void setIdUser(String idUser) { 
    	this.idUser = idUser; 
    }
}
