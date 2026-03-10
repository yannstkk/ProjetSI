package com.backend.projet.elicitation.entity.identifiant;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class QuestionReponseId implements Serializable {

    @Column(name = "numero_question")
    private Long numeroQuestion;

    @Column(name = "numero_interview")
    private Long numeroInterview;
    
	@Column(name = "id_projet")
    private Long idProjet;

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



    public QuestionReponseId() {}
    public QuestionReponseId(Long numeroQuestion, Long numeroInterview, Long idProjet) {
        this.numeroQuestion = numeroQuestion;
        this.numeroInterview = numeroInterview;
        this.idProjet = idProjet;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof QuestionReponseId)) return false;
        QuestionReponseId that = (QuestionReponseId) o;
        return Objects.equals(numeroQuestion, that.numeroQuestion) &&
               Objects.equals(numeroInterview, that.numeroInterview) &&
               Objects.equals(idProjet, that.idProjet);
    }

    @Override
    public int hashCode() {
        return Objects.hash(numeroQuestion, numeroInterview, idProjet);
    }

    
}
