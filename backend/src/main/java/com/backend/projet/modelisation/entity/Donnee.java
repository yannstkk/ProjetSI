package com.backend.projet.modelisation.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "DONNEE")
public class Donnee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_donnee")
    private Long idDonnee;

    @Column(name = "type")
    private String type;

    @Column(name = "nom")
    private String nom;

    @ManyToOne
    @JoinColumn(name = "id_dictionnaire")
    private DictionnaireDonnee dictionnaire;

    @ManyToOne
    @JoinColumn(name = "id_entite")
    private Entite entite;

    @ManyToOne
    @JoinColumn(name = "id_association")
    private Association association;

    public Donnee() {}

	public Long getIdDonnee() {
		return idDonnee;
	}

	public void setIdDonnee(Long idDonnee) {
		this.idDonnee = idDonnee;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getNom() {
		return nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}

	public DictionnaireDonnee getDictionnaire() {
		return dictionnaire;
	}

	public void setDictionnaire(DictionnaireDonnee dictionnaire) {
		this.dictionnaire = dictionnaire;
	}

	public Entite getEntite() {
		return entite;
	}

	public void setEntite(Entite entite) {
		this.entite = entite;
	}

	public Association getAssociation() {
		return association;
	}

	public void setAssociation(Association association) {
		this.association = association;
	}
    
    

}
