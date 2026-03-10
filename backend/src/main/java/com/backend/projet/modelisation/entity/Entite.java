package com.backend.projet.modelisation.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "ENTITE")
public class Entite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_entite")
    private Long idEntite;

    @Column(name = "nom")
    private String nom;

    @ManyToOne
    @JoinColumn(name = "id_mcd")
    private MCD mcd;

    @ManyToMany(mappedBy = "entites")
    private List<Association> associations = new ArrayList<>();

    @OneToMany(mappedBy = "entite", cascade = CascadeType.ALL)
    private List<Donnee> donnees = new ArrayList<>();

    public Entite() {}

	public Long getIdEntite() {
		return idEntite;
	}

	public void setIdEntite(Long idEntite) {
		this.idEntite = idEntite;
	}

	public String getNom() {
		return nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}

	public MCD getMcd() {
		return mcd;
	}

	public void setMcd(MCD mcd) {
		this.mcd = mcd;
	}

    
}
