package com.backend.projet.modelisation.dto.response;

public class MCDResponse {

    private Long idMcd;
    private String contenu;
    private String reponseMistral;
    private Long idProjet;

    public MCDResponse(Long idMcd, String contenu, String reponseMistral, Long idProjet) {
        this.idMcd = idMcd;
        this.contenu = contenu;
        this.reponseMistral = reponseMistral;
        this.idProjet = idProjet;
    }

    public Long getIdMcd() { return idMcd; }
    public String getContenu() { return contenu; }
    public String getReponseMistral() { return reponseMistral; }
    public Long getIdProjet() { return idProjet; }
}
