package com.backend.projet.modelisation.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class MCDAnalyseResponse {

    private String       resume;
    private List<Entite> entites;
    private List<Association> associations;
    private List<Donnee> donnees;
    private List<String> alertes;

    public MCDAnalyseResponse() {}

    /* ── Getters / Setters ── */
    public String       getResume()                         { return resume; }
    public void         setResume(String resume)            { this.resume = resume; }

    public List<Entite> getEntites()                        { return entites; }
    public void         setEntites(List<Entite> entites)    { this.entites = entites; }

    public List<Association> getAssociations()                          { return associations; }
    public void              setAssociations(List<Association> a)       { this.associations = a; }

    public List<Donnee> getDonnees()                        { return donnees; }
    public void         setDonnees(List<Donnee> donnees)    { this.donnees = donnees; }

    public List<String> getAlertes()                        { return alertes; }
    public void         setAlertes(List<String> alertes)    { this.alertes = alertes; }

    /* ── Entité ── */
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Entite {
        private String         nom;
        private List<Attribut> attributs;

        public String         getNom()                          { return nom; }
        public void           setNom(String nom)                { this.nom = nom; }
        public List<Attribut> getAttributs()                    { return attributs; }
        public void           setAttributs(List<Attribut> a)    { this.attributs = a; }
    }

    /* ── Attribut ── */
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Attribut {
        private String  nom;
        private String  type;
        private boolean estCle;

        public String  getNom()                 { return nom; }
        public void    setNom(String nom)        { this.nom = nom; }
        public String  getType()                { return type; }
        public void    setType(String type)     { this.type = type; }
        public boolean isEstCle()               { return estCle; }
        public void    setEstCle(boolean e)     { this.estCle = e; }
    }

    /* ── Association ── */
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Association {
        private String       nom;
        private List<String> entites;
        private String       cardinalite;

        public String       getNom()                        { return nom; }
        public void         setNom(String nom)              { this.nom = nom; }
        public List<String> getEntites()                    { return entites; }
        public void         setEntites(List<String> e)      { this.entites = e; }
        public String       getCardinalite()                { return cardinalite; }
        public void         setCardinalite(String c)        { this.cardinalite = c; }
    }

    /* ── Donnée ── */
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Donnee {
        private String nom;
        private String type;
        private String entite;

        public String getNom()              { return nom; }
        public void   setNom(String nom)    { this.nom = nom; }
        public String getType()             { return type; }
        public void   setType(String t)     { this.type = t; }
        public String getEntite()           { return entite; }
        public void   setEntite(String e)   { this.entite = e; }
    }
}