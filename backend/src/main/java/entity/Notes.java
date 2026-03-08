package entity;

import entity.identifiant.NotesId;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

@Entity
@Table(name = "NOTES")
public class Notes {

    @EmbeddedId
    private NotesId id;

    @ManyToOne
    @MapsId("idProjet")
    @JoinColumn(name = "id_projet")
    private Projet projet;

    @Column(name = "contenu", length = 4000)
    private String contenu;

    public Notes() {}
    public Notes(Projet projet, String contenu) {
        this.projet = projet;
        this.contenu = contenu;
        this.id = new NotesId(null, projet.getIdProjet());
    }
	public NotesId getId() {
		return id;
	}
	public void setId(NotesId id) {
		this.id = id;
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
