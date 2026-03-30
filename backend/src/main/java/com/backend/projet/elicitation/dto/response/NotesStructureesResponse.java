package com.backend.projet.elicitation.dto.response;

/**
 * Data Transfer Object representing the response for structured notes.
 * Contains the structured notes ID, the associated interview ID, the category, and the content.
 */
public class NotesStructureesResponse {

    private Long idNotesStructurees;
    private Long numeroInterview;
    private String categorie;
    private String contenu;

    public NotesStructureesResponse(Long idNotesStructurees, Long numeroInterview,
                                    String categorie, String contenu) {
        this.idNotesStructurees = idNotesStructurees;
        this.numeroInterview = numeroInterview;
        this.categorie = categorie;
        this.contenu = contenu;
    }

    public Long getIdNotesStructurees() {
        return idNotesStructurees;
    }

    public Long getNumeroInterview() {
        return numeroInterview;
    }

    public String getCategorie() {
        return categorie;
    }

    public String getContenu() {
        return contenu;
    }
}