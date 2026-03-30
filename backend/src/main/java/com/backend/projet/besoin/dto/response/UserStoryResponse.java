package com.backend.projet.besoin.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Classe qui contient les informations d'une User Story créée sur Taiga.
 * Elle permet de récupérer l'identifiant technique et la référence de la demande.
 */
public class UserStoryResponse {

    @JsonProperty("id")
    private Long taigaId;

    @JsonProperty("ref")
    private int taigaRef;

    /**
     * Donne l'identifiant unique de la User Story.
     * @return L'identifiant de la User Story.
     */
    public Long getTaigaId(){
        return this.taigaId;
    }

    /**
     * Donne la référence de la User Story au format texte (exemple: US-12).
     * @return La référence formatée.
     */
    public String getTaigaRef() {
        return "US-" + this.taigaRef;
    }

    /**
     * Enregistre l'identifiant unique de la User Story.
     * @param taigaId L'identifiant à enregistrer.
     */
    public void setTaigaId(Long taigaId) {
        this.taigaId = taigaId;
    }

    /**
     * Enregistre le numéro de référence de la User Story.
     * @param taigaRef Le numéro de référence à enregistrer.
     */
    public void setTaigaRef(int taigaRef) {
        this.taigaRef = taigaRef;
    }
}