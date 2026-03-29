package com.backend.projet.modelisation.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.backend.projet.modelisation.dto.request.MCDRequest;
import com.backend.projet.modelisation.dto.response.MCDResponse;
import com.backend.projet.modelisation.entity.MCD;
import com.backend.projet.modelisation.repository.MCDRepository;
import com.backend.projet.projet.entity.Projet;
import com.backend.projet.projet.exception.ResourceNotFoundException;
import com.backend.projet.projet.repository.ProjetRepository;

@Service
public class MCDService {

    private final MCDRepository mcdRepository;
    private final ProjetRepository projetRepository;

    public MCDService(MCDRepository mcdRepository, ProjetRepository projetRepository) {
        this.mcdRepository = mcdRepository;
        this.projetRepository = projetRepository;
    }

    public List<MCDResponse> getByProjet(Long idProjet) {
        return mcdRepository.findByProjetIdProjet(idProjet)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public MCDResponse create(MCDRequest request) {
        Projet projet = projetRepository.findById(request.getIdProjet())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Projet non trouvé : " + request.getIdProjet()));

        MCD mcd = new MCD();
        mcd.setContenu(request.getContenu());
        mcd.setProjet(projet);

        MCD saved = mcdRepository.save(mcd);
        return toResponse(saved);
    }

    private MCDResponse toResponse(MCD mcd) {
        return new MCDResponse(
                mcd.getIdMcd(),
                mcd.getContenu(),
                mcd.getReponseMistral(),
                mcd.getProjet().getIdProjet()
        );
    }
}