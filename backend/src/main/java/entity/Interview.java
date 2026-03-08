package entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import entity.identifiant.InterviewId;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "INTERVIEW")
public class Interview {

    @EmbeddedId
    private InterviewId id;

    @ManyToOne
    @MapsId("idProjet")
    @JoinColumn(name = "id_projet")
    private Projet projet;

    @Column(name = "date_interview")
    private LocalDate dateInterview;

    @Column(name = "sujet")
    private String sujet;

    @Column(name = "nominterviewer")
    private String nomInterviewer;

    @OneToMany(mappedBy = "interview", cascade = CascadeType.ALL)
    private List<Question> questions = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "PARTICIPE_INTERVIEW",
        joinColumns = {
            @JoinColumn(name = "numero_interview"),
            @JoinColumn(name = "id_projet")
        },
        inverseJoinColumns = @JoinColumn(name = "id_client")
    )
    private List<Client> clients = new ArrayList<>();

	public InterviewId getId() {
		return id;
	}

	public void setId(InterviewId id) {
		this.id = id;
	}

	public Projet getProjet() {
		return projet;
	}

	public void setProjet(Projet projet) {
		this.projet = projet;
	}

	public LocalDate getDateInterview() {
		return dateInterview;
	}

	public void setDateInterview(LocalDate dateInterview) {
		this.dateInterview = dateInterview;
	}

	public String getSujet() {
		return sujet;
	}

	public void setSujet(String sujet) {
		this.sujet = sujet;
	}

	public String getNomInterviewer() {
		return nomInterviewer;
	}

	public void setNomInterviewer(String nomInterviewer) {
		this.nomInterviewer = nomInterviewer;
	}
}