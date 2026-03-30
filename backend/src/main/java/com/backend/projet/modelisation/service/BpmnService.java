package com.backend.projet.modelisation.service;

import com.backend.projet.modelisation.dto.request.BpmnRequest;
import com.backend.projet.modelisation.dto.response.BpmnResponse;
import com.backend.projet.modelisation.entity.Bpmn;
import com.backend.projet.modelisation.repository.BpmnRepository;
import com.backend.projet.projet.entity.Projet;
import com.backend.projet.projet.exception.ResourceNotFoundException;
import com.backend.projet.projet.repository.ProjetRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BpmnService {

    private final BpmnRepository bpmnRepository;
    private final ProjetRepository projetRepository;

    public BpmnService(BpmnRepository bpmnRepository,
                       ProjetRepository projetRepository) {
        this.bpmnRepository = bpmnRepository;
        this.projetRepository = projetRepository;
    }

    /**
     * Récupère tous les BPMN d'un projet
     */
    public List<BpmnResponse> getByProjet(Long idProjet) {
        return bpmnRepository.findByProjetIdProjet(idProjet)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Récupère un BPMN par son ID
     */
    public BpmnResponse getById(Long idBpmn) {
        Bpmn bpmn = bpmnRepository.findById(idBpmn)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "BPMN non trouvé : " + idBpmn));
        return toResponse(bpmn);
    }

    /**
     * Sauvegarde un nouveau BPMN
     */
    public BpmnResponse save(BpmnRequest request) {
        Projet projet = projetRepository.findById(request.getIdProjet())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Projet non trouvé : " + request.getIdProjet()));

        if (request.getTitre() == null || request.getTitre().isBlank()) {
            throw new IllegalArgumentException("Le titre du BPMN est requis");
        }

        if (request.getContenu() == null || request.getContenu().isBlank()) {
            throw new IllegalArgumentException("Le contenu du BPMN est requis");
        }

        Bpmn bpmn = new Bpmn();
        bpmn.setProjet(projet);
        bpmn.setTitre(request.getTitre());
        bpmn.setContenu(request.getContenu());

        Bpmn saved = bpmnRepository.save(bpmn);
        return toResponse(saved);
    }

    /**
     * Met à jour un BPMN existant
     */
    public BpmnResponse update(Long idBpmn, BpmnRequest request) {
        Bpmn bpmn = bpmnRepository.findById(idBpmn)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "BPMN non trouvé : " + idBpmn));

        if (request.getTitre() != null && !request.getTitre().isBlank()) {
            bpmn.setTitre(request.getTitre());
        }

        if (request.getContenu() != null && !request.getContenu().isBlank()) {
            bpmn.setContenu(request.getContenu());
        }

        Bpmn updated = bpmnRepository.save(bpmn);
        return toResponse(updated);
    }

    /**
     * Supprime un BPMN
     */
    public void delete(Long idBpmn) {
        if (!bpmnRepository.existsById(idBpmn)) {
            throw new ResourceNotFoundException("BPMN non trouvé : " + idBpmn);
        }
        bpmnRepository.deleteById(idBpmn);
    }

    /**
     * Convertit une entité BPMN en DTO Response
     */
    private BpmnResponse toResponse(Bpmn bpmn) {
        return new BpmnResponse(
                bpmn.getIdBpmn(),
                bpmn.getProjet().getIdProjet(),
                bpmn.getTitre(),
                bpmn.getContenu()
        );
    }
}