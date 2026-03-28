package com.backend.projet.elicitation.entity;

import com.backend.projet.modelisation.entity.Acteur;
import com.backend.projet.projet.entity.Projet;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "USER_STORY")
public class UserStory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_us")
    private Long idUs;

    @Column(name = "ref", length = 20)
    private String ref;

    @Column(name = "veux", length = 300)
    private String veux;

    @Column(name = "afin", length = 300)
    private String afin;

    @Column(name = "priorite", length = 10)
    private String priorite;

    @Column(name = "criteres", columnDefinition = "CLOB")
    private String criteres;

    @Column(name = "flux", columnDefinition = "CLOB")
    private String flux;

    @Column(name = "taiga_ref", length = 100)
    private String taigaRef;

    @ManyToOne
    @JoinColumn(name = "id_projet")
    private Projet projet;

    @ManyToOne
    @JoinColumn(name = "id_acteur")
    private Acteur acteur;

    public UserStory() {}

    public Long getIdUs() {
        return idUs;
    }

    public void setIdUs(Long idUs) {
        this.idUs = idUs;
    }

    public String getRef() {
        return ref;
    }

    public void setRef(String ref) {
        this.ref = ref;
    }

    public String getVeux() {
        return veux;
    }

    public void setVeux(String veux) {
        this.veux = veux;
    }

    public String getAfin() {
        return afin;
    }

    public void setAfin(String afin) {
        this.afin = afin;
    }

    public String getPriorite() {
        return priorite;
    }

    public void setPriorite(String priorite) {
        this.priorite = priorite;
    }
    public String getCriteres() { return criteres; }
    public void setCriteres(String criteres) { this.criteres = criteres; }
    public String getFlux() { return flux; }
    public void setFlux(String flux) { this.flux = flux; }
    public String getTaigaRef() { return taigaRef; }
    public void setTaigaRef(String taigaRef) { this.taigaRef = taigaRef; }
    public Projet getProjet() { return projet; }
    public void setProjet(Projet projet) { this.projet = projet; }
    public Acteur getActeur() { return acteur; }
    public void setActeur(Acteur acteur) { this.acteur = acteur; }
}