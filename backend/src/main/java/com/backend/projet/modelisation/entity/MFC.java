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
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import org.slf4j.Marker;

@Entity
public class MFC {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mfc")
    private Long idMfc;

    @Column(name = "nom")
    private String nom;

    @ManyToOne
    @JoinColumn(name = "id_projet")
    private Projet projet;

    @ManyToMany
    @JoinTable(
        name = "PRESENCE_MFC",
        joinColumns = @JoinColumn(name = "id_mfc"),
        inverseJoinColumns = @JoinColumn(name = "id_acteur")
    )
    private List<Acteur> acteurs = new ArrayList<>();

    @OneToMany(mappedBy = "mfc", cascade = CascadeType.ALL)
    private List<Flux> flux = new ArrayList<>();

    public MFC() {}

    public void setNom(String nom){
        this.nom = nom;
    }

    public void setProjet(Projet projet) {
        this.projet = projet;
    }

    public List<Flux> getFlux() {
        return this.flux;
    }

    public String getNom() {
        return this.nom;
    }

    public Long getId() {
        return this.idMfc;
    }

    public List<Acteur> getActeurs() {
        return this.acteurs;
    }
}
