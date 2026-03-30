package com.backend.projet.modelisation.entity;

import com.backend.projet.projet.entity.Projet;
import jakarta.persistence.*;

/**
 * Représente un modèle de conception de données.
 */
@Entity
@Table(name = "MCD")
public class MCD {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_mcd")
	private Long idMcd;

	@Column(name = "nom", length = 30)
	private String nom;

	@Lob
	@Column(name = "contenu")
	private String contenu;

	@Lob
	@Column(name = "reponse_mistral", length = 4000)
	private String reponseMistral;

	@ManyToOne
	@JoinColumn(name = "id_projet")
	private Projet projet;

	public MCD() {}

	public Long getIdMcd()                      { return idMcd; }
	public void setIdMcd(Long idMcd)            { this.idMcd = idMcd; }

	public String getNom()                      { return nom; }
	public void setNom(String nom)              { this.nom = nom; }

	public String getContenu()                  { return contenu; }
	public void setContenu(String contenu)      { this.contenu = contenu; }

	public String getReponseMistral()                       { return reponseMistral; }
	public void setReponseMistral(String reponseMistral)    { this.reponseMistral = reponseMistral; }

	public Projet getProjet()                   { return projet; }
	public void setProjet(Projet projet)        { this.projet = projet; }
}