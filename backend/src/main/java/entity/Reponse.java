package entity;

import entity.identifiant.QuestionReponseId;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinColumns;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "REPONSE")
public class Reponse {

    @EmbeddedId
    private QuestionReponseId id;

    @OneToOne
    @MapsId
    @JoinColumns({
        @JoinColumn(name = "numero_question",  referencedColumnName = "numero_question"),
        @JoinColumn(name = "numero_interview", referencedColumnName = "numero_interview"),
        @JoinColumn(name = "id_projet",        referencedColumnName = "id_projet")
    })
    private Question question;

    @Column(name = "contenu")
    private Long contenu;

	public QuestionReponseId getId() {
		return id;
	}

	public void setId(QuestionReponseId id) {
		this.id = id;
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