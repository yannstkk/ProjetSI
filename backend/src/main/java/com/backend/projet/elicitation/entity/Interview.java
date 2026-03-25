package com.backend.projet.elicitation.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.backend.projet.projet.entity.Projet;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "INTERVIEW")
public class Interview {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "numero_interview")
	private Long numeroInterview;

	@ManyToOne
	@JoinColumn(name = "id_projet")
	private Projet projet;

	@Column(name = "date_interview")
	private LocalDate dateInterview;

	@Column(name = "heure_interview")
	private LocalDateTime heureInterview;

	@Column(name = "titre")
	private String titre;

	@Column(name = "nominterviewer")
	private String nomInterviewer;

	@Column(name = "objectifs", length = 4000)
	private String objectifs;

	@OneToMany(mappedBy = "interview", cascade = CascadeType.ALL)
	private List<Question> questions = new ArrayList<>();

	@OneToMany(mappedBy = "interview", cascade = CascadeType.ALL)
	private List<Notes> notes = new ArrayList<>();

	@OneToMany(mappedBy = "interview", cascade = CascadeType.ALL)
	private List<NotesStructurees> notesStructurees = new ArrayList<>();

	@OneToMany(mappedBy = "interview", cascade = CascadeType.ALL)
	private List<ParticipeInterview> participeInterviews = new ArrayList<>();

	public Interview() {}

	public Long getNumeroInterview() { return numeroInterview; }
	public void setNumeroInterview(Long numeroInterview) { this.numeroInterview = numeroInterview; }

	public Projet getProjet() { return projet; }
	public void setProjet(Projet projet) { this.projet = projet; }

	public LocalDate getDateInterview() { return dateInterview; }
	public void setDateInterview(LocalDate dateInterview) { this.dateInterview = dateInterview; }

	public LocalDateTime getHeureInterview() { return heureInterview; }
	public void setHeureInterview(LocalDateTime heureInterview) { this.heureInterview = heureInterview; }

	public String getTitre() { return titre; }
	public void setTitre(String titre) { this.titre = titre; }

	public String getNomInterviewer() { return nomInterviewer; }
	public void setNomInterviewer(String nomInterviewer) { this.nomInterviewer = nomInterviewer; }

	public String getObjectifs() { return objectifs; }
	public void setObjectifs(String objectifs) { this.objectifs = objectifs; }

	public List<ParticipeInterview> getParticipeInterviews() { return participeInterviews; }
	public void setParticipeInterviews(List<ParticipeInterview> participeInterviews) {
		this.participeInterviews = participeInterviews;
	}
}