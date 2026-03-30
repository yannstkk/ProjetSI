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
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

/**
 * Représente un modèle de flux de données.
 */
@Entity
public class MFC {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mfc")
    private Long idMfc;

    @Column(name = "nom")
    private String nom;

    @Lob
    @Column(name = "contenu_plantuml")
    private String contenuPlantuml;

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

    public Long getId()                  { return this.idMfc; }
    public String getNom()               { return this.nom; }
    public Projet getProjet()            { return this.projet; }
    public String getContenuPlantuml()   { return this.contenuPlantuml; }
    public List<Flux> getFlux()          { return this.flux; }
    public List<Acteur> getActeurs()     { return this.acteurs; }

    public void setNom(String nom)                      { this.nom = nom; }
    public void setProjet(Projet projet)                { this.projet = projet; }
    public void setContenuPlantuml(String c)            { this.contenuPlantuml = c; }
}