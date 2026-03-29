package com.backend.projet.modelisation.dto.request;

public class MCDRequest {

<<<<<<< HEAD
    private String contenu;
    private Long idProjet;

    public MCDRequest() {}

    public String getContenu() { return contenu; }
    public void setContenu(String contenu) { this.contenu = contenu; }
    public Long getIdProjet() { return idProjet; }
    public void setIdProjet(Long idProjet) { this.idProjet = idProjet; }
=======
    private Long   idProjet;
    private String nom;
    private String contenu;
    private String reponseMistral;

    public MCDRequest() {}

    public Long   getIdProjet()                         { return idProjet; }
    public void   setIdProjet(Long idProjet)            { this.idProjet = idProjet; }

    public String getNom()                              { return nom; }
    public void   setNom(String nom)                    { this.nom = nom; }

    public String getContenu()                          { return contenu; }
    public void   setContenu(String contenu)            { this.contenu = contenu; }

    public String getReponseMistral()                           { return reponseMistral; }
    public void   setReponseMistral(String reponseMistral)      { this.reponseMistral = reponseMistral; }
>>>>>>> main
}