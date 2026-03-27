package com.backend.projet.besoin.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CritereIaResponse {

    private List<CritereDto> criteres;
    private Object metadata;

    public CritereIaResponse() {}

    public CritereIaResponse(List<CritereDto> criteres, Object metadata) {
        this.criteres = criteres;
        this.metadata = metadata;
    }

    public List<CritereDto> getCriteres() {
        return criteres;
    }

    public void setCriteres(List<CritereDto> criteres) {
        this.criteres = criteres;
    }

    public Object getMetadata() {
        return metadata;
    }

    public void setMetadata(Object metadata) {
        this.metadata = metadata;
    }
}