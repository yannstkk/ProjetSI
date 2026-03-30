package com.backend.projet.projet.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.backend.projet.elicitation.entity.UserStory;
import com.backend.projet.elicitation.entity.Interview;
import com.backend.projet.elicitation.entity.Participant;
import com.backend.projet.modelisation.entity.Bpmn;
import com.backend.projet.modelisation.entity.DictionnaireDonnee;
import com.backend.projet.modelisation.entity.MCD;
import com.backend.projet.modelisation.entity.Acteur;
import com.backend.projet.modelisation.entity.MFC;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "PROJET")
public class Projet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_projet")
    private Long idProjet;

    @Column(name = "nom")
    private String nom;

    @Column(name = "date_creation")
    private LocalDate dateCreation;

    @Column(name = "id_user")
    private String idUser;

    @OneToMany(mappedBy = "projet", cascade = CascadeType.ALL)
    private List<Interview> interviews = new ArrayList<>();

    @OneToMany(mappedBy = "projet", cascade = CascadeType.ALL)
    private List<Bpmn> bpmns = new ArrayList<>();

    @OneToMany(mappedBy = "projet", cascade = CascadeType.ALL)
    private List<MFC> mfcs = new ArrayList<>();

    @OneToMany(mappedBy = "projet", cascade = CascadeType.ALL)
    private List<MCD> mcds = new ArrayList<>();

    @OneToMany(mappedBy = "projet", cascade = CascadeType.ALL)
    private List<DictionnaireDonnee> dictionnaires = new ArrayList<>();

    @OneToMany(mappedBy = "projet", cascade = CascadeType.ALL)
    private List<Acteur> acteurs = new ArrayList<>();

    @OneToMany(mappedBy = "projet", cascade = CascadeType.ALL)
    private List<UserStory> userStories = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "COMMANDE_PROJET",
            joinColumns = @JoinColumn(name = "id_projet"),
            inverseJoinColumns = @JoinColumn(name = "id_client")
    )
    private List<Participant> participants = new ArrayList<>();

    public Projet() {}
    public Projet(String nom) {
        this.nom = nom;
        this.dateCreation = LocalDate.now();
    }
    public Long getIdProjet() {
        return idProjet;
    }
    public void setIdProjet(Long idProjet) {
        this.idProjet = idProjet;
    }
    public String getNom() {
        return nom;
    }
    public void setNom(String nom) {
        this.nom = nom;
    }
    public LocalDate getDateCreation() {
        return dateCreation;
    }
    public void setDateCreation(LocalDate dateCreation) {
        this.dateCreation = dateCreation;
    }

    public String getIdUser() {
        return idUser;
    }
    public void setIdUser(String idUser) {
        this.idUser = idUser;
    }

}