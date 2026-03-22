package com.backend.projet.elicitation.entity;

import com.backend.projet.elicitation.entity.identifiant.ParticipeInterviewId;
import jakarta.persistence.*;

@Entity
@Table(name = "PARTICIPE_INTERVIEW")
public class ParticipeInterview {

    @EmbeddedId
    private ParticipeInterviewId id;

    @ManyToOne
    @MapsId("idParticipant")
    @JoinColumn(name = "ID_PARTICIPANT")
    private Participant participant;

    @ManyToOne
    @MapsId("numeroInterview")
    @JoinColumn(name = "NUMERO_INTERVIEW")
    private Interview interview;

    @Column(name = "ROLE", length = 30)
    private String role;

    public ParticipeInterview() {}

    public ParticipeInterview(Participant participant, Interview interview, String role) {
        this.id = new ParticipeInterviewId(
                participant.getIdParticipant(),
                interview.getNumeroInterview()
        );
        this.participant = participant;
        this.interview = interview;
        this.role = role;
    }

    public ParticipeInterviewId getId() { return id; }
    public void setId(ParticipeInterviewId id) { this.id = id; }
    public Participant getParticipant() { return participant; }
    public void setParticipant(Participant participant) { this.participant = participant; }
    public Interview getInterview() { return interview; }
    public void setInterview(Interview interview) { this.interview = interview; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}