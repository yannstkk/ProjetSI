package com.backend.projet.elicitation.dto.response;

import java.time.LocalDate;

public class InterviewResponse {

    private Long numeroInterview;
    private Long idProjet;
    private String sujet;
    private LocalDate dateInterview;
    private String nomInterviewer;
    private String participants;
    private String besoins;
    private String regles;
    private String donnees;
    private String contraintes;
    private String solutions;

    public InterviewResponse(Long numeroInterview, Long idProjet, String sujet,
                             LocalDate dateInterview, String nomInterviewer,
                             String participants, String besoins, String regles,
                             String donnees, String contraintes, String solutions) {
        this.numeroInterview = numeroInterview;
        this.idProjet        = idProjet;
        this.sujet           = sujet;
        this.dateInterview   = dateInterview;
        this.nomInterviewer  = nomInterviewer;
        this.participants    = participants;
        this.besoins         = besoins;
        this.regles          = regles;
        this.donnees         = donnees;
        this.contraintes     = contraintes;
        this.solutions       = solutions;
    }

    public Long getNumeroInterview() { return numeroInterview; }
    public Long getIdProjet() { return idProjet; }
    public String getSujet() { return sujet; }
    public LocalDate getDateInterview() { return dateInterview; }
    public String getNomInterviewer() { return nomInterviewer; }
    public String getParticipants() { return participants; }
    public String getBesoins() { return besoins; }
    public String getRegles() { return regles; }
    public String getDonnees() { return donnees; }
    public String getContraintes() { return contraintes; }
    public String getSolutions() { return solutions; }
}