package com.backend.projet.entity;

import com.backend.projet.entity.identifiant.NotesId;
import com.backend.projet.entity.identifiant.QuestionReponseId;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

@Entity
@Table(name = "NOTES")
@IdClass(NotesId.class)
public class Notes {

    @Id
    @Column(name = "numero_notes")
    private Long numeroNotes;

    @Id
    @Column(name = "id_projet", insertable=false, updatable=false)
    private Long idProjet;

    @ManyToOne
    @JoinColumn(name = "id_projet")
    private Projet projet;

    @Column(name = "contenu", length = 4000)
    private String contenu;

    public Notes() {}
    
	public Long getNumeroNotes() {
		return numeroNotes;
	}

	public void setNumeroNotes(Long numeroNotes) {
		this.numeroNotes = numeroNotes;
	}

	public Long getIdProjet() {
		return idProjet;
	}

	public void setIdProjet(Long idProjet) {
		this.idProjet = idProjet;
	}

	public Projet getProjet() {
		return projet;
	}
	
	public void setProjet(Projet projet) {
		this.projet = projet;
	}
	
	public String getContenu() {
		return contenu;
	}
	
	public void setContenu(String contenu) {
		this.contenu = contenu;
	}

    
}
