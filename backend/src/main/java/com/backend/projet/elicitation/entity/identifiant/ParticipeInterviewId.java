package com.backend.projet.elicitation.entity.identifiant;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ParticipeInterviewId implements Serializable {

    @Column(name = "id_participant")
    private Long idParticipant;

    @Column(name = "numero_interview")
    private Long numeroInterview;

    public ParticipeInterviewId() {}

    public ParticipeInterviewId(Long idParticipant, Long numeroInterview) {
        this.idParticipant  = idParticipant;
        this.numeroInterview = numeroInterview;
    }

    public Long getIdParticipant() { return idParticipant; }
    public void setIdParticipant(Long idParticipant) { this.idParticipant = idParticipant; }

    public Long getNumeroInterview() { return numeroInterview; }
    public void setNumeroInterview(Long numeroInterview) { this.numeroInterview = numeroInterview; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ParticipeInterviewId)) return false;
        ParticipeInterviewId that = (ParticipeInterviewId) o;
        return Objects.equals(idParticipant, that.idParticipant) &&
                Objects.equals(numeroInterview, that.numeroInterview);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idParticipant, numeroInterview);
    }
}