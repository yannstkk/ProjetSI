package com.backend.projet.elicitation.entity;

import com.backend.projet.elicitation.entity.identifiant.QuestionReponseId;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinColumns;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "QUESTION")
@IdClass(QuestionReponseId.class)
public class Question {

    @Id
    @Column(name = "numero_question")
    private Long numeroQuestion;
    
    @Id
    @Column(name = "numero_interview", insertable=false, updatable=false)
    private Long numeroInterview;

    @Id
    @Column(name = "id_projet", insertable=false, updatable=false)
    private Long idProjet;

    @ManyToOne
    @JoinColumns({
        @JoinColumn(name = "numero_interview", referencedColumnName = "numero_interview"),
        @JoinColumn(name = "id_projet",        referencedColumnName = "id_projet")
    })
    private Interview interview;

    @Column(name = "libelle")
    private String libelle;

    @OneToOne(mappedBy = "question", cascade = CascadeType.ALL)
    private Reponse reponse;

	public Long getNumeroInterview() {
		return numeroInterview;
	}

	public void setNumeroInterview(Long numeroInterview) {
		this.numeroInterview = numeroInterview;
	}

	public Long getIdProjet() {
		return idProjet;
	}

	public void setIdProjet(Long idProjet) {
		this.idProjet = idProjet;
	}

	public Long getNumeroQuestion() {
		return numeroQuestion;
	}

	public void setNumeroQuestion(Long numeroQuestion) {
		this.numeroQuestion = numeroQuestion;
	}

	public Interview getInterview() {
		return interview;
	}

	public void setInterview(Interview interview) {
		this.interview = interview;
	}

	public String getLibelle() {
		return libelle;
	}

	public void setLibelle(String libelle) {
		this.libelle = libelle;
	}

	public Reponse getReponse() {
		return reponse;
	}

	public void setReponse(Reponse reponse) {
		this.reponse = reponse;
	}

    
}
