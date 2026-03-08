package entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

public class MFC {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mfc")
    private Long idMfc;

    @Column(name = "nom")
    private String nom;

    @ManyToOne
    @JoinColumn(name = "id_projet")
    private Projet projet;

    @ManyToMany
    @JoinTable(
        name = "PRESENCE_MFC",
        joinColumns = @JoinColumn(name = "id_mfc"),
        inverseJoinColumns = @JoinColumn(name = "id_acteur")
    )
    private List<Acteur> acteurs = new ArrayList<>();

    @OneToMany(mappedBy = "mfc", cascade = CascadeType.ALL)
    private List<Flux> flux = new ArrayList<>();

    public MFC() {}

}
