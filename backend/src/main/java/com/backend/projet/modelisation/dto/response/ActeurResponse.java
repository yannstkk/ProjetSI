package com.backend.projet.modelisation.dto.response;

public class ActeurResponse {
	private Long idActeur;
	private Long idProjet;
	private String nom;
	private String type;
	private String source;
	private String role;
	public ActeurResponse(Long idActeur, Long idProjet, String nom, String type, String source, String role) {
		super();
		this.idActeur = idActeur;
		this.idProjet = idProjet;
		this.nom = nom;
		this.type = type;
		this.source = source;
		this.role = role;
	}
	public Long getIdActeur() {
		return idActeur;
	}
	public Long getIdProjet() {
		return idProjet;
	}
	public String getNom() {
		return nom;
	}
	public String getType() {
		return type;
	}
	public String getSource() {
		return source;
	}
	public String getRole() {
		return role;
	}
	
	
}
