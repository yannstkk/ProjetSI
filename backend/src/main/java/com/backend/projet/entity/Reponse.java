package com.backend.projet.entity;

import com.backend.projet.entity.identifiant.QuestionReponseId;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinColumns;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "REPONSE")
@IdClass(QuestionReponseId.class)
public class Reponse {

    @Id
    @Column(name = "numero_question", insertable=false, updatable=false)
    private Long numeroQuestion;
    
    @Id
    @Column(name = "numero_interview", insertable=false, updatable=false)
    private Long numeroInterview;

    @Id
    @Column(name = "id_projet", insertable=false, updatable=false)
    private Long idProjet;

    @OneToOne
    @JoinColumns({
        @JoinColumn(name = "numero_question",  referencedColumnName = "numero_question"),
        @JoinColumn(name = "numero_interview", referencedColumnName = "numero_interview"),
        @JoinColumn(name = "id_projet",        referencedColumnName = "id_projet")
    })
    private Question question;

    @Column(name = "contenu")
    private Long contenu;

	public Long getNumeroQuestion() {
		return numeroQuestion;
	}

	public void setNumeroQuestion(Long numeroQuestion) {
		this.numeroQuestion = numeroQuestion;
	}

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

	public Question getQuestion() {
		return question;
	}

	public void setQuestion(Question question) {
		this.question = question;
	}

	public Long getContenu() {
		return contenu;
	}

	public void setContenu(Long contenu) {
		this.contenu = contenu;
	}
    
    

    
}