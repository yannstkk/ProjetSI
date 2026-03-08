package entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "FLUX")
public class Flux {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_flux")
    private Long idFlux;

    @Column(name = "nom")
    private String nom;

    @Column(name = "description")
    private String description;

    @Column(name = "type")
    private String type;

    @ManyToOne
    @JoinColumn(name = "id_acteur_entree")
    private Acteur acteurEntree;

    @ManyToOne
    @JoinColumn(name = "id_acteur_sortie")
    private Acteur acteurSortie;

    @ManyToOne
    @JoinColumn(name = "id_mfc")
    private MFC mfc;

    @ManyToMany(mappedBy = "flux")
    private List<Evenement> evenements = new ArrayList<>();

    public Flux() {}

	public Long getIdFlux() {
		return idFlux;
	}

	public void setIdFlux(Long idFlux) {
		this.idFlux = idFlux;
	}

	public String getNom() {
		return nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Acteur getActeurEntree() {
		return acteurEntree;
	}

	public void setActeurEntree(Acteur acteurEntree) {
		this.acteurEntree = acteurEntree;
	}

	public Acteur getActeurSortie() {
		return acteurSortie;
	}

	public void setActeurSortie(Acteur acteurSortie) {
		this.acteurSortie = acteurSortie;
	}

	public MFC getMfc() {
		return mfc;
	}

	public void setMfc(MFC mfc) {
		this.mfc = mfc;
	}

    
}
