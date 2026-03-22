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
@Table(name = "NOTES_STRUCTUREES")
public class NotesStructurees {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_notes_structurees")
    private Long idNotesStructurees;

    @ManyToOne
    @JoinColumn(name = "numero_interview")
    private Interview interview;

    @Column(name = "categorie", length = 30)
    private String categorie;

    @Column(name = "contenu", length = 4000)
    private String contenu;

    public NotesStructurees() {}

	public Long getIdNotesStructurees() {
		return idNotesStructurees;
	}

	public void setIdNotesStructurees(Long idNotesStructurees) {
		this.idNotesStructurees = idNotesStructurees;
	}

	public Interview getInterview() {
		return interview;
	}

	public void setInterview(Interview interview) {
		this.interview = interview;
	}

	public String getCategorie() {
		return categorie;
	}

	public void setCategorie(String categorie) {
		this.categorie = categorie;
	}

	public String getContenu() {
		return contenu;
	}

	public void setContenu(String contenu) {
		this.contenu = contenu;
	}

    
}