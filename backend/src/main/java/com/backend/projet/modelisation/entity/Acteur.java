package com.backend.projet.modelisation.entity;

import java.util.ArrayList;
import java.util.List;

import com.backend.projet.projet.entity.Projet;
import com.backend.projet.elicitation.entity.UserStory;

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
    
    @Column(name = "source", length = 30)
    private String source;

    @Column(name = "role", length = 100)
    private String role;

    @ManyToMany(mappedBy = "acteurs")
    private List<BPMN> bpmns = new ArrayList<>();

    @ManyToMany(mappedBy = "acteurs")
    private List<MFC> mfcs = new ArrayList<>();

    @OneToMany(mappedBy = "acteurEntree")
    private List<Flux> fluxEntree = new ArrayList<>();

    @OneToMany(mappedBy = "acteurSortie")
    private List<Flux> fluxSortie = new ArrayList<>();
    
	@OneToMany(mappedBy = "acteur", cascade = CascadeType.ALL)
	private List<UserStory> userStories = new ArrayList<>();
    
	@ManyToOne
	@JoinColumn(name = "id_projet")
	private Projet projet;

    public Projet getProjet() {
		return projet;
	}

	public void setProjet(Projet projet) {
		this.projet = projet;
	}

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
	
    public String getSource() { 
    	return source; 
    }
    
    public void setSource(String source) { 
    	this.source = source; 
    }
    
    public String getRole() { 
    	return role; 
    }
    
    public void setRole(String role) { 
    	this.role = role; 
    }

    
}
