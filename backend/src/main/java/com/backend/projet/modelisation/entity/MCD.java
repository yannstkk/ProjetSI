package com.backend.projet.modelisation.entity;

import java.util.ArrayList;
import java.util.List;

import com.backend.projet.projet.entity.Projet;
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
@Table(name = "MCD")
public class MCD {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mcd")
    private Long idMCD;

    @Column(name = "contenu", columnDefinition = "CLOB")
    private String contenu;

    @ManyToOne
    @JoinColumn(name = "id_projet")
    private Projet projet;

    @OneToMany(mappedBy = "mcd", cascade = CascadeType.ALL)
    private List<Entite> entites = new ArrayList<>();

    public MCD() {}

	public Long getIdMcd() {
		return idMCD;
	}

	public void setIdMcd(Long idMcd) {
		this.idMCD = idMcd;
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
