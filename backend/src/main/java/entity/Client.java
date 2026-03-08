package entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "CLIENT")
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_client")
    private Long idClient;

    @Column(name = "nom")
    private String nom;

    // relations
    @ManyToMany(mappedBy = "clients")
    private List<Projet> projets = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "PARTICIPE_INTERVIEW",
        joinColumns = @JoinColumn(name = "id_client"),
        inverseJoinColumns = {
            @JoinColumn(name = "numero_interview"),
            @JoinColumn(name = "id_projet")
        }
    )
    private List<Interview> interviews = new ArrayList<>();

    public Client() {}
    public Client(String nom) {
        this.nom = nom;
    }
    
	public Long getIdClient() {
		return idClient;
	}
	
	public void setIdClient(Long idClient) {
		this.idClient = idClient;
	}
	
	public String getNom() {
		return nom;
	}
	
	public void setNom(String nom) {
		this.nom = nom;
	}

    
}
