package com.backend.projet.modelisation.dto.response;

public class MFCResponse {
    // est ce qu'il faudrait un id de MFC ? --> je pense que oui
    private Long idMfc;
    private String nom;
    private Long projetId;
    private FluxResponse analyse;


    public MFCResponse(Long idMfc, String nom, Long idProjet, FluxResponse fluxAnalyse) {
        this.idMfc = idMfc;
        this.nom = nom;
        this.projetId = idProjet;
        this.analyse = fluxAnalyse;
    }

    public Long getIdMfc(){
        return this.idMfc;
    }

    public Long getProjetId(){
        return this.projetId;
    }

    public String getNom(){
        return this.nom;
    }

    public FluxResponse getFluxResponse(){
        return this.analyse;
    }
}