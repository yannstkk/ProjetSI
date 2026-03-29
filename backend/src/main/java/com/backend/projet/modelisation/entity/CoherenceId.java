package com.backend.projet.modelisation.entity;

import java.io.Serializable;
import java.util.Objects;

public class CoherenceId implements Serializable {

    private Long idEvenement;
    private Long idFlux;

    public CoherenceId() {}
    public CoherenceId(Long idEvenement, Long idFlux) {
        this.idEvenement = idEvenement;
        this.idFlux = idFlux;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CoherenceId)) return false;
        CoherenceId that = (CoherenceId) o;
        return Objects.equals(idEvenement, that.idEvenement) &&
               Objects.equals(idFlux, that.idFlux);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idEvenement, idFlux);
    }

    public Long getIdEvenement() { return idEvenement; }
    public void setIdEvenement(Long idEvenement) { this.idEvenement = idEvenement; }
    public Long getIdFlux() { return idFlux; }
    public void setIdFlux(Long idFlux) { this.idFlux = idFlux; }
}
