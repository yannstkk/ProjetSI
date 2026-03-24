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
@Table(name = "NOTES")
public class Notes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "numero_notes")
    private Long numeroNotes;

    @ManyToOne
    @JoinColumn(name = "numero_interview")
    private Interview interview;

    @Column(name = "contenu", length = 4000)
    private String contenu;

    public Long getNumeroNotes() {
		return numeroNotes;
	}

	public void setNumeroNotes(Long numeroNotes) {
		this.numeroNotes = numeroNotes;
	}

	public String getContenu() {
		return contenu;
	}

	public void setContenu(String contenu) {
		this.contenu = contenu;
	}

	public Notes() {}

	public Interview getInterview() {
		return interview;
	}

	public void setInterview(Interview interview) {
		this.interview = interview;
	}
    
}
