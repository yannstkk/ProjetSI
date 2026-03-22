package com.backend.projet.elicitation.dto.request;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class InterviewRequest {

    private Long idProjet;
    private LocalDate dateInterview;
    private LocalDateTime heureInterview;
    private String titre;
    private String nomInterviewer;
    private String objectifs;

    public InterviewRequest() {}

    public Long getIdProjet() { 
    	return idProjet; 
    }
    public void setIdProjet(Long idProjet) { 
    	this.idProjet = idProjet; 
    }
    
    public LocalDate getDateInterview() { 
    	return dateInterview; 
    }
    
    public void setDateInterview(LocalDate dateInterview) { 
    	this.dateInterview = dateInterview; 
    }
    
    public LocalDateTime getHeureInterview() { 
    	return heureInterview; 
    }
    
    public void setHeureInterview(LocalDateTime heureInterview) { 
    	this.heureInterview = heureInterview; 
    }
    
    public String getTitre() { 
    	return titre; 
    }
    
    public void setTitre(String titre) { 
    	this.titre = titre; 
    }
    
    public String getNomInterviewer() { 
    	return nomInterviewer; 
    }
    
    public void setNomInterviewer(String nomInterviewer) { 
    	this.nomInterviewer = nomInterviewer; 
    }
    
    public String getObjectifs() { 
    	return objectifs; 
    }
    
    public void setObjectifs(String objectifs) { 
    	this.objectifs = objectifs; 
    }
}