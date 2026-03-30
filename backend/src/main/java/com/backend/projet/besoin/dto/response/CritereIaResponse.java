package com.backend.projet.besoin.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

/**
 * Classe qui contient la réponse de l'IA concernant les critères.
 * Il regroupe la liste des critères trouvés et des informations supplémentaires (metadata).
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class CritereIaResponse {

    private List<CritereDto> criteres;
    private Object metadata;

    public CritereIaResponse() {}

    /**
     * Constructeur pour créer une réponse complète.
     * @param criteres Liste des critères générés par l'IA.
     * @param metadata Informations techniques supplémentaires sur la réponse.
     */
    public CritereIaResponse(List<CritereDto> criteres, Object metadata) {
        this.criteres = criteres;
        this.metadata = metadata;
    }

    /**
     * Donne la liste des critères.
     * @return La liste des critères enregistrés.
     */
    public List<CritereDto> getCriteres() {
        return criteres;
    }

    /**
     * Enregistre la liste des critères.
     * @param criteres La nouvelle liste de critères à enregistrer.
     */
    public void setCriteres(List<CritereDto> criteres) {
        this.criteres = criteres;
    }

    /**
     * Donne les informations supplémentaires (metadata).
     * @return Les données techniques de la réponse.
     */
    public Object getMetadata() {
        return metadata;
    }

    /**
     * Enregistre les informations supplémentaires (metadata).
     * @param metadata Les nouvelles informations techniques à enregistrer.
     */
    public void setMetadata(Object metadata) {
        this.metadata = metadata;
    }
}