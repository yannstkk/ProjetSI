package com.backend.projet.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "DICTIONNAIRE_DONNEE")
public class DictionnaireDonnee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_dictionnaire")
    private Long idDictionnaire;

    @Column(name = "contenu", columnDefinition = "CLOB")
    private String contenu;

    @ManyToOne
    @JoinColumn(name = "id_projet")
    private Projet projet;

    @OneToMany(mappedBy = "dictionnaire", cascade = CascadeType.ALL)
    private List<Donnee> donnees = new ArrayList<>();

    public DictionnaireDonnee() {}

	public Long getIdDictionnaire() {
		return idDictionnaire;
	}

	public void setIdDictionnaire(Long idDictionnaire) {
		this.idDictionnaire = idDictionnaire;
	}

	public String getContenu() {
		return contenu;
	}

	public void setContenu(String contenu) {
		this.contenu = contenu;
	}

	public Projet getProjet() {
		return projet;
	}

	public void setProjet(Projet projet) {
		this.projet = projet;
	}

    
}