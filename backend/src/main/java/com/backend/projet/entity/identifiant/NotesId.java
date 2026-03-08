package com.backend.projet.entity.identifiant;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class NotesId implements Serializable {

    @Column(name = "numero_notes")
    private Long numeroNotes;

    @Column(name = "id_projet")
    private Long idProjet;

    public NotesId() {}
    public NotesId(Long numeroNotes, Long idProjet) {
        this.numeroNotes = numeroNotes;
        this.idProjet = idProjet;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof NotesId)) return false;
        NotesId that = (NotesId) o;
        return Objects.equals(numeroNotes, that.numeroNotes) &&
               Objects.equals(idProjet, that.idProjet);
    }

    @Override
    public int hashCode() {
        return Objects.hash(numeroNotes, idProjet);
    }
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

    
}
