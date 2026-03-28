package com.backend.projet.modelisation.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.backend.projet.modelisation.dto.request.ActeurRequest;
import com.backend.projet.modelisation.dto.response.ActeurResponse;
import com.backend.projet.modelisation.entity.Acteur;
import com.backend.projet.modelisation.repository.ActeurRepository;
import com.backend.projet.projet.entity.Projet;
import com.backend.projet.projet.exception.ResourceNotFoundException;
import com.backend.projet.projet.repository.ProjetRepository;

@Service
public class ActeurService {

	private final ActeurRepository acteurRepository;
    private final ProjetRepository projetRepository;
	
    public ActeurService(ActeurRepository acteurRepository, ProjetRepository projetRepository) {
		super();
		this.acteurRepository = acteurRepository;
		this.projetRepository = projetRepository;
	}
	
    public List<ActeurResponse> getByProjet(Long idProjet) {
        return acteurRepository.findByProjetIdProjet(idProjet)
                .stream()
                .map(this::toResponse)
                .toList();
    }
    
    private ActeurResponse toResponse(Acteur acteur) {
    	return new ActeurResponse(
    		acteur.getIdActeur(),
    		acteur.getProjet().getIdProjet(),
    		acteur.getNom(),
    		acteur.getType(),
    		acteur.getSource(),
    		acteur.getRole()
    	);
    }
    
    public ActeurResponse create(ActeurRequest request) {
        Projet projet = projetRepository.findById(request.getIdProjet())
                .orElseThrow(() -> new ResourceNotFoundException("Projet non trouvé : " + request.getIdProjet()));

        Acteur acteur = new Acteur();
        acteur.setProjet(projet);
        acteur.setNom(request.getNom());
        acteur.setType(request.getType());
        acteur.setSource(request.getSource());
        acteur.setRole(request.getRole());

        Acteur saved = acteurRepository.save(acteur);
        return toResponse(saved);
    }
}
