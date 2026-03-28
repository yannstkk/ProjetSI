package com.backend.projet.modelisation.service;

import com.backend.projet.elicitation.entity.UserStory;
import com.backend.projet.elicitation.repository.UserStoryRepository;
import com.backend.projet.modelisation.dto.request.ExigenceRequest;
import com.backend.projet.modelisation.entity.ExigenceFonctionnelle;
import com.backend.projet.modelisation.repository.ExigenceFonctionnelleRepository;
import com.backend.projet.projet.entity.Projet;
import com.backend.projet.projet.repository.ProjetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ExigenceService {

    @Autowired
    private ExigenceFonctionnelleRepository exigenceRepository;

    @Autowired
    private ProjetRepository projetRepository;

    @Autowired
    private UserStoryRepository userStoryRepository;

    @Transactional
    public void sauvegarderExigences(Long projetId, List<ExigenceRequest> requests) {
        Projet projet = projetRepository.findById(projetId)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé"));

        // 1. On récupère toutes les US du projet une seule fois
        List<UserStory> toutesLesUs = userStoryRepository.findByProjetIdProjet(projetId);

        // 2. Supprimer les anciennes exigences
        exigenceRepository.deleteByProjetId(projetId);

        for (ExigenceRequest req : requests) {
            ExigenceFonctionnelle ef = new ExigenceFonctionnelle();
            ef.setCode(req.getCode());
            ef.setLibelle(req.getLibelle());
            ef.setDescription(req.getDescription());
            ef.setProjet(projet);

            // 3. Liaison : on cherche dans notre liste 'toutesLesUs' celles dont la 'ref'
            // est présente dans la liste envoyée par le front (req.getUsLiees())
            if (req.getUsLiees() != null) {
                List<UserStory> storiesLiees = toutesLesUs.stream()
                        .filter(us -> req.getUsLiees().contains(us.getRef())) // Utilise 'ref' ici !
                        .collect(Collectors.toList());

                ef.setUserStories(storiesLiees);
            }

            exigenceRepository.save(ef);
        }
    }
}