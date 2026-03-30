package com.backend.projet.elicitation.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.backend.projet.elicitation.entity.UserStory;
import com.backend.projet.elicitation.dto.request.UserStoryRequest;
import com.backend.projet.elicitation.dto.response.UserStoryResponse;
import com.backend.projet.elicitation.repository.UserStoryRepository;
import com.backend.projet.modelisation.entity.Acteur;
import com.backend.projet.modelisation.repository.ActeurRepository;
import com.backend.projet.projet.entity.Projet;
import com.backend.projet.projet.exception.ResourceNotFoundException;
import com.backend.projet.projet.repository.ProjetRepository;

/**
 * Service responsable des opérations liées aux User Stories.
 */
@Service
public class UserStoryService {

    private final UserStoryRepository userStoryRepository;
    private final ProjetRepository projetRepository;
    private final ActeurRepository acteurRepository;

    public UserStoryService(UserStoryRepository userStoryRepository,
                            ProjetRepository projetRepository,
                            ActeurRepository acteurRepository) {
        this.userStoryRepository = userStoryRepository;
        this.projetRepository = projetRepository;
        this.acteurRepository = acteurRepository;
    }

    /**
     * Récupère toutes les User Stories d'un projet.
     * @param idProjet
     * @return
     */
    public List<UserStoryResponse> getByProjet(Long idProjet) {
        return userStoryRepository.findByProjetIdProjet(idProjet)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Ajoute une nouvelle User Story.
     * @param request
     * @return
     */
    public UserStoryResponse add(UserStoryRequest request) {
        Projet projet = projetRepository.findById(request.getIdProjet())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Projet non trouvé : " + request.getIdProjet()));

        Acteur acteur = null;
        if (request.getIdActeur() != null) {
            acteur = acteurRepository.findById(request.getIdActeur())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Acteur non trouvé : " + request.getIdActeur()));
        }

        UserStory us = new UserStory();
        us.setRef(request.getRef());
        us.setVeux(request.getVeux());
        us.setAfin(request.getAfin());
        us.setPriorite(request.getPriorite());
        us.setCriteres(request.getCriteres());
        us.setFlux(request.getFlux());
        us.setTaigaRef(request.getTaigaRef());
        us.setProjet(projet);
        us.setActeur(acteur);

        UserStory saved = userStoryRepository.save(us);
        return toResponse(saved);
    }

    /**
     * Met à jour une User Story existante.
     * @param idUs
     * @return
     */
    public void delete(Long idUs) {
        if (!userStoryRepository.existsById(idUs)) {
            throw new ResourceNotFoundException("User Story non trouvée : " + idUs);
        }
        userStoryRepository.deleteById(idUs);
    }

    /**
     * Supprime toutes les User Stories d'un projet.
     * @param idProjet
     */
    private UserStoryResponse toResponse(UserStory us) {
        return new UserStoryResponse(
                us.getIdUs(),
                us.getRef(),
                us.getVeux(),
                us.getAfin(),
                us.getPriorite(),
                us.getCriteres(),
                us.getFlux(),
                us.getTaigaRef(),
                us.getProjet().getIdProjet(),
                us.getActeur() != null ? us.getActeur().getIdActeur() : null
        );
    }
}