package com.backend.projet.elicitation.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity representing a Participant who can take part in interviews.
 */
@Entity
@Table(name = "PARTICIPANT")
public class Participant {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID_PARTICIPANT")
	private Long idParticipant;

	@Column(name = "NOM")
	private String nom;

	@OneToMany(mappedBy = "participant", cascade = CascadeType.ALL)
	private List<ParticipeInterview> participeInterviews = new ArrayList<>();

	public Participant() {}

	public Long getIdParticipant() { return idParticipant; }
	public void setIdParticipant(Long idParticipant) { this.idParticipant = idParticipant; }
	public String getNom() { return nom; }
	public void setNom(String nom) { this.nom = nom; }
	public List<ParticipeInterview> getParticipeInterviews() { return participeInterviews; }
}
