package com.backend.projet.auth.dto;

/**
 * Classe qui contient la réponse renvoyée après une tentative de connexion.
 * Il regroupe l'identifiant de réponse, le statut d'erreur, la durée et le contenu (jeton ou message).
 */
public class LoginResponse {

    private final long responseId;
    private final boolean isError;
    private final String duration;
    private final String content;

    /**
     * Constructeur pour créer une réponse de connexion complète.
     * @param responseId Identifiant unique de la réponse.
     * @param isError Indique si la connexion a échoué (true) ou réussi (false).
     * @param duration Temps qu'a pris la vérification.
     * @param content Contient le jeton JWT en cas de succès ou le message en cas d'erreur.
     */
    public LoginResponse(long responseId, boolean isError, String duration, String content){
        this.responseId = responseId;
        this.isError = isError;
        this.duration = duration;
        this.content = content;
    }

    /**
     * Donne l'identifiant de la réponse.
     * @return L'identifiant unique.
     */
    public long getResponseId() {
        return this.responseId;
    }

    /**
     * Indique s'il y a eu une erreur.
     * @return True si c'est une erreur, False sinon.
     */
    public boolean getIsError(){
        return this.isError;
    }

    /**
     * Donne la durée de l'opération.
     * @return Le temps de traitement sous forme de texte.
     */
    public String getDuration() {
        return this.duration;
    }

    /**
     * Donne le contenu de la réponse.
     * @return Le jeton de connexion ou le message d'erreur.
     */
    public String getContent(){
        return this.content;
    }
}
