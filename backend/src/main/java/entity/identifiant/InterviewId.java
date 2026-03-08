package entity.identifiant;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class InterviewId implements Serializable {
    
    @Column(name = "numero_interview")
    private Long numeroInterview;
    
    @Column(name = "id_projet")
    private Long idProjet;

    public InterviewId() {}
    
    public InterviewId(Long numeroInterview, Long idProjet) {
        this.numeroInterview = numeroInterview;
        this.idProjet = idProjet;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof InterviewId)) return false;
        InterviewId that = (InterviewId) o;
        return Objects.equals(numeroInterview, that.numeroInterview) &&
               Objects.equals(idProjet, that.idProjet);
    }

    @Override
    public int hashCode() {
        return Objects.hash(numeroInterview, idProjet);
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

    
}
