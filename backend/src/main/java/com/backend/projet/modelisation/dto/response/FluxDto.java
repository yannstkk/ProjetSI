package com.backend.projet.modelisation.dto.response;

public class FluxDto {

    private Long idFlux;
    private String nom;
    private String description;
    private String data;
    private String emetteur;   // nom de l'acteur émetteur
    private String recepteur;  // nom de l'acteur récepteur

    public FluxDto() {}

    public FluxDto(Long idFlux, String nom, String description,
                   String data, String emetteur, String recepteur) {
        this.idFlux      = idFlux;
        this.nom         = nom;
        this.description = description;
        this.data        = data;
        this.emetteur    = emetteur;
        this.recepteur   = recepteur;
    }

    public Long getIdFlux()        { return idFlux; }
    public String getNom()         { return nom; }
    public String getDescription() { return description; }
    public String getData()        { return data; }
    public String getEmetteur()    { return emetteur; }
    public String getRecepteur()   { return recepteur; }

    public void setIdFlux(Long idFlux)           { this.idFlux = idFlux; }
    public void setNom(String nom)               { this.nom = nom; }
    public void setDescription(String desc)      { this.description = desc; }
    public void setData(String data)             { this.data = data; }
    public void setEmetteur(String emetteur)     { this.emetteur = emetteur; }
    public void setRecepteur(String recepteur)   { this.recepteur = recepteur; }
}