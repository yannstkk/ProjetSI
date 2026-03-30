package com.backend.projet.besoin.service;

import com.backend.projet.besoin.AuthTaigaException;
import com.backend.projet.besoin.TaigaDataException;
import com.backend.projet.besoin.dao.TaigaDao;
import com.backend.projet.besoin.dto.request.UserStoryRequest;
import com.backend.projet.besoin.dto.response.ProjectTaigaResponse;
import com.backend.projet.besoin.dto.response.TaigaAuthResponse;
import com.backend.projet.besoin.dto.response.UserStoryResponse;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Classe qui assure la liaison entre l'application et l'outil Taiga.
 * Elle coordonne les appels pour la connexion, la récupération des projets et l'export des User Stories.
 */
@Service
public class TaigaService {

    private TaigaDao taigaDao;

    /**
     * Constructeur qui reçoit l'outil de communication avec Taiga.
     * @param taigaDao Outil pour effectuer les appels vers l'API Taiga.
     */
    public TaigaService(TaigaDao taigaDao){
        this.taigaDao = taigaDao;
    }

    /**
     * Gère la connexion d'un utilisateur sur Taiga.
     * @param username Le nom de l'utilisateur.
     * @param password Le mot de passe.
     * @return Les informations de connexion reçues de Taiga.
     * @throws AuthTaigaException Si l'identifiant est faux ou si la connexion échoue.
     */
    public TaigaAuthResponse authentificationTaiga(String username, String password) throws AuthTaigaException {
        return this.taigaDao.authentificationTaiga(username, password);
    }

    /**
     * Récupère la liste des projets auxquels l'utilisateur participe.
     * @param userId L'identifiant de l'utilisateur sur Taiga.
     * @param token Le jeton de sécurité pour l'accès.
     * @return La liste des projets disponibles.
     * @throws AuthTaigaException Si le jeton n'est plus bon.
     * @throws TaigaDataException Si les données de Taiga ne sont pas correctes.
     */
    public List<ProjectTaigaResponse> getProjects(Long userId, String token) throws AuthTaigaException, TaigaDataException {
        return this.taigaDao.getProjects(userId, token);
    }

    /**
     * Envoie une User Story vers un projet Taiga choisi.
     * @param projectId L'identifiant du projet cible.
     * @param userStory Les informations de la User Story.
     * @param token Le jeton de sécurité pour l'envoi.
     * @return La réponse confirmant la création sur Taiga.
     * @throws AuthTaigaException Si l'accès est refusé.
     */
    public UserStoryResponse exportUserStory(Long projectId, UserStoryRequest userStory, String token) throws AuthTaigaException {
        return this.taigaDao.createUserStory(projectId, userStory, token);
    }

}
