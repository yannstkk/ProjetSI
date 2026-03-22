package com.backend.projet.elicitation.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class InterviewResponse {

    private Long numeroInterview;
    private Long idProjet;
    private LocalDate dateInterview;
    private LocalDateTime heureInterview;
    private String titre;
    private String nomInterviewer;
    private String objectifs;

    public InterviewResponse(Long numeroInterview, Long idProjet, LocalDate dateInterview,
                              LocalDateTime heureInterview, String titre,
                              String nomInterviewer, String objectifs) {
        this.numeroInterview = numeroInterview;
        this.idProjet = idProjet;
        this.dateInterview = dateInterview;
        this.heureInterview = heureInterview;
        this.titre = titre;
        this.nomInterviewer = nomInterviewer;
        this.objectifs = objectifs;
    }

    public Long getNumeroInterview() { 
    	return numeroInterview; 
    }
    
    public Long getIdProjet() { 
    	return idProjet; 
    }
    
    public LocalDate getDateInterview() { 
    	return dateInterview; 
    }
    
    public LocalDateTime getHeureInterview() { 
    	return heureInterview; 
    }
    
    public String getTitre() { 
    	return titre; 
    }
    
    public String getNomInterviewer() { 
    	return nomInterviewer; 
    }
    
    public String getObjectifs() { 
    	return objectifs; 
    }
}
