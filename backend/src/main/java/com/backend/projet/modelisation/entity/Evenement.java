package com.backend.projet.modelisation.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * Représente un événement.
 */
@Entity
@Table(name = "EVENEMENT")
public class Evenement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evenement")
    private Long idEvenement;

    @Column(name = "nom")
    private String nom;

    @ManyToOne
    @JoinColumn(name = "id_bpmn")
    private Bpmn bpmn;

    @ManyToMany
    @JoinTable(
        name = "MATCH",
        joinColumns = @JoinColumn(name = "id_evenement"),
        inverseJoinColumns = @JoinColumn(name = "id_flux")
    )
    private List<Flux> flux = new ArrayList<>();

    public Evenement() {}

	public Long getIdEvenement() {
		return idEvenement;
	}

	public void setIdEvenement(Long idEvenement) {
		this.idEvenement = idEvenement;
	}

	public String getNom() {
		return nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}

	public Bpmn getBpmn() {
		return bpmn;
	}

	public void setBpmn(Bpmn bpmn) {
		this.bpmn = bpmn;
	}

    
}
