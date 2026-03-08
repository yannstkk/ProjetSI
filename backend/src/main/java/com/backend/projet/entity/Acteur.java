package com.backend.projet.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "ACTEUR")
public class Acteur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_acteur")
    private Long idActeur;

    @Column(name = "nom")
    private String nom;

    @Column(name = "type")
    private String type;

    @ManyToMany(mappedBy = "acteurs")
    private List<BPMN> bpmns = new ArrayList<>();

    @ManyToMany(mappedBy = "acteurs")
    private List<MFC> mfcs = new ArrayList<>();

    @OneToMany(mappedBy = "acteurEntree")
    private List<Flux> fluxEntree = new ArrayList<>();

    @OneToMany(mappedBy = "acteurSortie")
    private List<Flux> fluxSortie = new ArrayList<>();

    public Acteur() {}

	public Long getIdActeur() {
		return idActeur;
	}

	public void setIdActeur(Long idActeur) {
		this.idActeur = idActeur;
	}

	public String getNom() {
		return nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

    
}
