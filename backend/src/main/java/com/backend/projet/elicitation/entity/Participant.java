package com.backend.projet.elicitation.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "PARTICIPANT")
public class Participant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_participant")
    private Long idParticipant;

    @Column(name = "nom")
    private String nom;

    @ManyToMany(mappedBy = "participants")
    private List<Interview> interviews = new ArrayList<>();

    public Participant() {}

	public Long getIdParticipant() {
		return idParticipant;
	}

	public void setIdParticipant(Long idParticipant) {
		this.idParticipant = idParticipant;
	}

	public String getNom() {
		return nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}

}