package com.backend.projet.modelisation.service;

import com.backend.projet.mistral.enums.Prompt;
import com.backend.projet.mistral.exceptions.MistralApiException;
import com.backend.projet.mistral.service.MistralService;
import com.backend.projet.modelisation.dto.request.MCDRequest;
import com.backend.projet.modelisation.dto.response.MCDAnalyseResponse;
import com.backend.projet.modelisation.dto.response.MCDResponse;
import com.backend.projet.modelisation.entity.MCD;
import com.backend.projet.modelisation.repository.MCDRepository;
import com.backend.projet.projet.entity.Projet;
import com.backend.projet.projet.exception.ResourceNotFoundException;
import com.backend.projet.projet.repository.ProjetRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MCDService {

    private final MCDRepository    mcdRepository;
    private final ProjetRepository projetRepository;
    private final MistralService   mistralService;

    public MCDService(MCDRepository mcdRepository,
                      ProjetRepository projetRepository,
                      MistralService mistralService) {
        this.mcdRepository    = mcdRepository;
        this.projetRepository = projetRepository;
        this.mistralService   = mistralService;
    }


    public MCDResponse creer(MCDRequest request) {
        Projet projet = projetRepository.findById(request.getIdProjet())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Projet non trouvé : " + request.getIdProjet()));

        MCD mcd = new MCD();
        mcd.setNom(truncate(request.getNom(), 30));
        mcd.setContenu(request.getContenu());
        mcd.setReponseMistral(request.getReponseMistral()); // pour le CLOB sinn ca pete
        mcd.setProjet(projet);

        MCD saved = mcdRepository.save(mcd);
        return toResponse(saved);
    }


    public List<MCDResponse> getByProjet(Long idProjet) {
        return mcdRepository.findByProjetIdProjet(idProjet)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }


    public MCDResponse getById(Long idMcd) {
        MCD mcd = mcdRepository.findById(idMcd)
                .orElseThrow(() -> new ResourceNotFoundException("MCD non trouvé : " + idMcd));
        return toResponse(mcd);
    }


    public MCDResponse mettreAJour(Long idMcd, MCDRequest request) {
        MCD mcd = mcdRepository.findById(idMcd)
                .orElseThrow(() -> new ResourceNotFoundException("MCD non trouvé : " + idMcd));

        if (request.getNom()            != null) mcd.setNom(truncate(request.getNom(), 30));
        if (request.getContenu()        != null) mcd.setContenu(request.getContenu());
        if (request.getReponseMistral() != null) mcd.setReponseMistral(request.getReponseMistral()); // CLOB → pas de limite

        return toResponse(mcdRepository.save(mcd));
    }


    public void supprimer(Long idMcd) {
        if (!mcdRepository.existsById(idMcd))
            throw new ResourceNotFoundException("MCD non trouvé : " + idMcd);
        mcdRepository.deleteById(idMcd);
    }


    public MCDAnalyseResponse analyser(String contenuPlantuml) throws MistralApiException {
        if (contenuPlantuml == null || contenuPlantuml.isBlank())
            throw new IllegalArgumentException("Le contenu PlantUML ne peut pas être vide.");

        return mistralService.executerAnalyse(
                contenuPlantuml,
                Prompt.MCD_ANALYSE.getPrompt(),
                MCDAnalyseResponse.class
        );
    }


    private MCDResponse toResponse(MCD mcd) {
        return new MCDResponse(
                mcd.getIdMcd(),
                mcd.getNom(),
                mcd.getProjet() != null ? mcd.getProjet().getIdProjet() : null,
                mcd.getContenu(),
                mcd.getReponseMistral()
        );
    }

    private String truncate(String value, int max) {
        if (value == null) return null;
        return value.length() > max ? value.substring(0, max) : value;
    }
}