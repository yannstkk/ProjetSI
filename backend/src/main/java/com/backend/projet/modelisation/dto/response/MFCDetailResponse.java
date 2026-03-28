package com.backend.projet.modelisation.dto.response;

import java.util.List;

public class MFCDetailResponse {

    private Long   idMfc;
    private String nom;
    private Long   projetId;
    private List<FluxDto>    flux;
    private List<ActeurResponse> acteurs;

    public MFCDetailResponse() {}

    public MFCDetailResponse(Long idMfc, String nom, Long projetId,
                             List<FluxDto> flux, List<ActeurResponse> acteurs) {
        this.idMfc   = idMfc;
        this.nom     = nom;
        this.projetId = projetId;
        this.flux    = flux;
        this.acteurs = acteurs;
    }

    public Long getId()                      { return idMfc; }
    public String getNom()                   { return nom; }
    public Long getProjetId()                { return projetId; }
    public List<FluxDto> getFlux()           { return flux; }
    public List<ActeurResponse> getActeurs() { return acteurs; }

    public void setIdMfc(Long idMfc)                      { this.idMfc = idMfc; }
    public void setNom(String nom)                        { this.nom = nom; }
    public void setProjetId(Long projetId)                { this.projetId = projetId; }
    public void setFlux(List<FluxDto> flux)               { this.flux = flux; }
    public void setActeurs(List<ActeurResponse> acteurs)  { this.acteurs = acteurs; }
}