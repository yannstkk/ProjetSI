package entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "PROJET")
public class Projet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_projet")
    private Long idProjet;

    @Column(name = "nom")
    private String nom;

    @Column(name = "date_creation")
    private LocalDate dateCreation;

    @OneToMany(mappedBy = "projet", cascade = CascadeType.ALL)
    private List<Interview> interviews = new ArrayList<>();

    @OneToMany(mappedBy = "projet", cascade = CascadeType.ALL)
    private List<Notes> notes = new ArrayList<>();

    @OneToMany(mappedBy = "projet", cascade = CascadeType.ALL)
    private List<BPMN> bpmns = new ArrayList<>();

    @OneToMany(mappedBy = "projet", cascade = CascadeType.ALL)
    private List<MFC> mfcs = new ArrayList<>();

    @OneToMany(mappedBy = "projet", cascade = CascadeType.ALL)
    private List<MCD> mcds = new ArrayList<>();

    @OneToMany(mappedBy = "projet", cascade = CascadeType.ALL)
    private List<DictionnaireDonnee> dictionnaires = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "COMMANDE_PROJET",
        joinColumns = @JoinColumn(name = "id_projet"),
        inverseJoinColumns = @JoinColumn(name = "id_client")
    )
    private List<Client> clients = new ArrayList<>();

    public Projet() {}
    public Projet(String nom) {
        this.nom = nom;
        this.dateCreation = LocalDate.now();
    }
	public Long getIdProjet() {
		return idProjet;
	}
	public void setIdProjet(Long idProjet) {
		this.idProjet = idProjet;
	}
	public String getNom() {
		return nom;
	}
	public void setNom(String nom) {
		this.nom = nom;
	}
	public LocalDate getDateCreation() {
		return dateCreation;
	}
	public void setDateCreation(LocalDate dateCreation) {
		this.dateCreation = dateCreation;
	}

}
