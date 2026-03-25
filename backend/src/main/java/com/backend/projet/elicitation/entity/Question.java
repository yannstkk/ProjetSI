package com.backend.projet.elicitation.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "QUESTION")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "numero_question")
    private Long numeroQuestion;

    @ManyToOne
    @JoinColumn(name = "numero_interview")
    private Interview interview;

    @Column(name = "libelle")
    private String libelle;

    public Question() {}

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

    
}
