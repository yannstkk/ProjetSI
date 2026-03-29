package com.backend.projet.modelisation.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "COHERENCE")
@IdClass(CoherenceId.class)
public class Coherence {

    @Id
    @Column(name = "id_evenement", insertable = false, updatable = false)
    private Long idEvenement;

    @Id
    @Column(name = "id_flux", insertable = false, updatable = false)
    private Long idFlux;

    @ManyToOne
    @JoinColumn(name = "id_evenement")
    private Evenement evenement;

    @ManyToOne
    @JoinColumn(name = "id_flux")
    private Flux flux;

    public Coherence() {}

    public Long getIdEvenement() { return idEvenement; }
    public void setIdEvenement(Long idEvenement) { this.idEvenement = idEvenement; }
    public Long getIdFlux() { return idFlux; }
    public void setIdFlux(Long idFlux) { this.idFlux = idFlux; }
    public Evenement getEvenement() { return evenement; }
    public void setEvenement(Evenement evenement) { this.evenement = evenement; }
    public Flux getFlux() { return flux; }
    public void setFlux(Flux flux) { this.flux = flux; }
}