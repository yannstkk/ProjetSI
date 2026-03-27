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
import jakarta.persistence.Table;

@Entity
@Table(name = "BPMN")
public class BPMN {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_bpmn")
    private Long idBpmn;

    @Column(name = "titre")
    private String titre;

    @Column(name = "contenu", columnDefinition = "CLOB")
    private String contenu;

    @ManyToOne
    @JoinColumn(name = "id_projet")
    private Projet projet;

    @ManyToMany
    @JoinTable(
            name = "PRESENCE_BPMN",
            joinColumns = @JoinColumn(name = "id_bpmn"),
            inverseJoinColumns = @JoinColumn(name = "id_acteur")
    )
    private List<Acteur> acteurs = new ArrayList<>();

    @OneToMany(mappedBy = "bpmn", cascade = CascadeType.ALL)
    private List<Evenement> evenements = new ArrayList<>();

    public BPMN() {}

    public Long getIdBpmn() {
        return idBpmn;
    }

    public void setIdBpmn(Long idBpmn) {
        this.idBpmn = idBpmn;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
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