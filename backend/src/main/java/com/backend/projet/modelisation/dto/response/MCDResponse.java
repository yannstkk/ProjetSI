package com.backend.projet.modelisation.dto.response;

public class MCDResponse {
    private Long   idMcd;
    private String nom;
    private Long   idProjet;
    private String contenu;
    private String reponseMistral;

    public MCDResponse() {}

    public MCDResponse(Long idMcd, String nom, Long idProjet, String contenu, String reponseMistral) {
        this.idMcd = idMcd;
        this.nom = nom;
        this.idProjet = idProjet;
        this.contenu = contenu;
        this.reponseMistral = reponseMistral;
    }

    public Long   getIdMcd() { 
    	return idMcd; 
    }
    
    public String getNom() { 
    	return nom; 
    }
    
    public Long   getIdProjet() { 
    	return idProjet; 
    }
    
    public String getContenu() { 
    	return contenu; 
    }
    
    public String getReponseMistral() { 
    	return reponseMistral;
    }

    public void setIdMcd(Long idMcd) { 
    	this.idMcd = idMcd; 
    }
    
    public void setNom(String nom) { 
    	this.nom = nom; 
    }
    
    public void setIdProjet(Long idProjet) { 
    	this.idProjet = idProjet; 
    }
    
    public void setContenu(String contenu) { 
    	this.contenu = contenu; 
    }
    
    public void setReponseMistral(String r) { 
    	this.reponseMistral = r; 
    }
}
