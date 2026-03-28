package com.backend.projet.modelisation.dto.response;

import java.util.List;

public class MFCDetailResponse {

    private Long   id;
    private String nom;
    private Long   idProjet;
    private String contenuPlantuml;   // ← nouveau
    private List<FluxDto>       flux;
    private List<ActeurResponse> acteurs;

    public MFCDetailResponse(Long id, String nom, Long idProjet,
                             String contenuPlantuml,
                             List<FluxDto> flux,
                             List<ActeurResponse> acteurs) {
        this.id              = id;
        this.nom             = nom;
        this.idProjet        = idProjet;
        this.contenuPlantuml = contenuPlantuml;
        this.flux            = flux;
        this.acteurs         = acteurs;
    }

    public Long   getId()              { return id; }
    public String getNom()             { return nom; }
    public Long   getIdProjet()        { return idProjet; }
    public String getContenuPlantuml() { return contenuPlantuml; }
    public List<FluxDto>        getFlux()    { return flux; }
    public List<ActeurResponse> getActeurs() { return acteurs; }
}