package com.backend.projet.modelisation.entity;

import com.backend.projet.projet.entity.Projet;
import jakarta.persistence.*;

@Entity
@Table(name = "BPMN")
public class Bpmn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_BPMN")
    private Long idBpmn;

    @ManyToOne
    @JoinColumn(name = "ID_PROJET")
    private Projet projet;

    @Column(name = "TITRE", length = 255)
    private String titre;

    @Column(name = "CONTENU", columnDefinition = "CLOB")
    private String contenu;

    // Constructors
    public Bpmn() {}

    // Getters & Setters
    public Long getIdBpmn() {
        return idBpmn;
    }

    public void setIdBpmn(Long idBpmn) {
        this.idBpmn = idBpmn;
    }

    public Projet getProjet() {
        return projet;
    }

    public void setProjet(Projet projet) {
        this.projet = projet;
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
}