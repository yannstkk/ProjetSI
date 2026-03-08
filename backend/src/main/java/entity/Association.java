package entity;

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
@Table(name = "ASSOCIATION")
public class Association {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_association")
    private Long idAssociation;

    @Column(name = "nom")
    private String nom;

    @ManyToMany
    @JoinTable(
        name = "ASSOCIE_ENTITE",
        joinColumns = @JoinColumn(name = "id_association"),
        inverseJoinColumns = @JoinColumn(name = "id_entite")
    )
    private List<Entite> entites = new ArrayList<>();

    @OneToMany(mappedBy = "association", cascade = CascadeType.ALL)
    private List<Donnee> donnees = new ArrayList<>();

    public Association() {}

    // getters/setters
}
