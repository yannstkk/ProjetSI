package entity;

import entity.identifiant.QuestionReponseId;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinColumns;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "QUESTION")
public class Question {

    @EmbeddedId
    private QuestionReponseId id;

    @ManyToOne
    @MapsId("idProjet")                  // réutilise idProjet de QuestionId
    @JoinColumns({
        @JoinColumn(name = "numero_interview", referencedColumnName = "numero_interview"),
        @JoinColumn(name = "id_projet",        referencedColumnName = "id_projet")
    })
    private Interview interview;

    @Column(name = "libelle")
    private String libelle;

    @OneToOne(mappedBy = "question", cascade = CascadeType.ALL)
    private Reponse reponse;

	public QuestionReponseId getId() {
		return id;
	}

	public void setId(QuestionReponseId id) {
		this.id = id;
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
