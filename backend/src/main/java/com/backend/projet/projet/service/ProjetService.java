package com.backend.projet.projet.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.backend.projet.projet.dto.request.ProjetRequest;
import com.backend.projet.projet.dto.response.ProjetResponse;
import com.backend.projet.projet.entity.Projet;
import com.backend.projet.projet.exception.ResourceNotFoundException;
import com.backend.projet.projet.repository.ProjetRepository;

/**
 * Service for managing project-related operations.
 */
@Service
public class ProjetService {

    private final ProjetRepository projetRepository;

    public ProjetService(ProjetRepository projetRepository) {
        this.projetRepository = projetRepository;
    }

    /**
     * Retrieves a list of all projects.
     * @return
     */
    public List<ProjetResponse> getAllProjets() {
        return projetRepository.findAll()
                .stream()
                .map(projet -> new ProjetResponse(
                        projet.getIdProjet(),
                        projet.getNom(),
                        projet.getDateCreation(),
                        projet.getIdUser()
                ))
                .toList();
    }

    /**
     * Retrieves a list of projects associated with a specific user.
     * @param idUser
     * @return
     */
    public List<ProjetResponse> getProjetsByUser(String idUser) {
        return projetRepository.findByIdUser(idUser)
                .stream()
                .map(projet -> new ProjetResponse(
                        projet.getIdProjet(),
                        projet.getNom(),
                        projet.getDateCreation(),
                        projet.getIdUser()
                ))
                .toList();
    }

    /**
     * Creates a new project.
     * @param request
     * @return
     */
    public ProjetResponse creerProjet(ProjetRequest request) {
        Projet projet = new Projet();
        projet.setNom(request.getNom());
        projet.setIdUser(request.getIdUser());
        projet.setDateCreation(LocalDate.now());

        Projet saved = projetRepository.save(projet);

        return new ProjetResponse(
                saved.getIdProjet(),
                saved.getNom(),
                saved.getDateCreation(),
                saved.getIdUser()
        );
    }
    
    /**
     * Retrieves a project by its ID.
     * @param id
     * @return
     */
    public ProjetResponse getProjetById(Long id) {
        Projet projet = projetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projet non trouvé : " + id));
        return new ProjetResponse(
                projet.getIdProjet(),
                projet.getNom(),
                projet.getDateCreation(),
                projet.getIdUser()
        );
    }
}
