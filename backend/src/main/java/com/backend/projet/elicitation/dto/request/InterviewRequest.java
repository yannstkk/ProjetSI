package com.backend.projet.elicitation.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;

public class InterviewRequest {

    private Long idProjet;
    private String sujet;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateInterview;

    private String nomInterviewer;
    private String participants;
    private String besoins;
    private String regles;
    private String donnees;
    private String contraintes;
    private String solutions;

    public Long getIdProjet() { return idProjet; }
    public void setIdProjet(Long idProjet) { this.idProjet = idProjet; }

    public String getSujet() { return sujet; }
    public void setSujet(String sujet) { this.sujet = sujet; }

    public LocalDate getDateInterview() { return dateInterview; }
    public void setDateInterview(LocalDate dateInterview) { this.dateInterview = dateInterview; }

    public String getNomInterviewer() { return nomInterviewer; }
    public void setNomInterviewer(String nomInterviewer) { this.nomInterviewer = nomInterviewer; }

    public String getParticipants() { return participants; }
    public void setParticipants(String participants) { this.participants = participants; }

    public String getBesoins() { return besoins; }
    public void setBesoins(String besoins) { this.besoins = besoins; }

    public String getRegles() { return regles; }
    public void setRegles(String regles) { this.regles = regles; }

    public String getDonnees() { return donnees; }
    public void setDonnees(String donnees) { this.donnees = donnees; }

    public String getContraintes() { return contraintes; }
    public void setContraintes(String contraintes) { this.contraintes = contraintes; }

    public String getSolutions() { return solutions; }
    public void setSolutions(String solutions) { this.solutions = solutions; }
}