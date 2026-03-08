package com.backend.projet.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.backend.projet.dto.response.ProjetResponse;
import com.backend.projet.entity.Projet;
import com.backend.projet.repository.ProjetRepository;

@Service
public class ProjetService {
	
	private final ProjetRepository projetRepository;
	
	public ProjetService(ProjetRepository projetRepository) {
		this.projetRepository = projetRepository;
	}
	
    public List<ProjetResponse> getAllProjets() {
        List<Projet> projets = projetRepository.findAll();
        return projets.stream()
        		.map(projet -> new ProjetResponse(
                        projet.getIdProjet(),
                        projet.getNom(),
                        projet.getDateCreation()
                ))
                .toList();
    }

}
