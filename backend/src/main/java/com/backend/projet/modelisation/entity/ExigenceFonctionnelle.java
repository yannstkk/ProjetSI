package com.backend.projet.modelisation.entity;

import com.backend.projet.elicitation.entity.UserStory;
import com.backend.projet.projet.entity.Projet;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "exigence_fonctionnelle")
public class ExigenceFonctionnelle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String code; // ex: EF-001

    @Column(nullable = false)
    private String libelle;

    @Column(columnDefinition = "CLOB")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "projet_id")
    private Projet projet;

    @ManyToMany
    @JoinTable(
            name = "exigence_us",
            joinColumns = @JoinColumn(name = "exigence_id"),
            inverseJoinColumns = @JoinColumn(name = "us_id")
    )
    private List<UserStory> userStories = new ArrayList<>();

    public ExigenceFonctionnelle() {}

    public ExigenceFonctionnelle(String code, String libelle, String description, Projet projet) {
        this.code = code;
        this.libelle = libelle;
        this.description = description;
        this.projet = projet;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getLibelle() {
        return libelle;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Projet getProjet() {
        return projet;
    }

    public void setProjet(Projet projet) {
        this.projet = projet;
    }

    public List<UserStory> getUserStories() {
        return userStories;
    }

    public void setUserStories(List<UserStory> userStories) {
        this.userStories = userStories;
    }
}