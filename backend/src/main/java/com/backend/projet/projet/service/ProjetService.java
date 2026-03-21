package com.backend.projet.projet.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.backend.projet.projet.dto.request.ProjetRequest;
import com.backend.projet.projet.dto.response.ProjetResponse;
import com.backend.projet.projet.entity.Projet;
import com.backend.projet.projet.repository.ProjetRepository;

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
                        projet.getDateCreation(),
                        projet.getIdUtilisateur() 
                ))
                .toList();
    }

	public ProjetResponse creerProjet(ProjetRequest request) {
        Projet projet = new Projet();
        projet.setNom(request.getNom());
        projet.setDateCreation(LocalDate.now());
		projet.setIdUtilisateur(request.getUser());



		Projet saved = projetRepository.save(projet);

        return new ProjetResponse(
                saved.getIdProjet(),
                saved.getNom(),
                saved.getDateCreation(),
                saved.getIdUtilisateur()
        );
	}
	
	public List<ProjetResponse> getProjetsByUser(String idUtilisateur) {
	    return projetRepository.findByIdUtilisateur(idUtilisateur)
	            .stream()
	            .map(projet -> new ProjetResponse(
	                    projet.getIdProjet(),
	                    projet.getNom(),
	                    projet.getDateCreation(),
	                    projet.getIdUtilisateur()
	            ))
	            .toList();
	}

	// ← nouveau
	public ProjetResponse getProjetById(Long id) {
		Projet projet = projetRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Projet introuvable : " + id));
		return new ProjetResponse(
				projet.getIdProjet(),
				projet.getNom(),
				projet.getDateCreation(),
				projet.getIdUtilisateur()
		);
	}

}
