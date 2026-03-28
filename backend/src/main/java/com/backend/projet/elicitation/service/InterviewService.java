package com.backend.projet.elicitation.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.backend.projet.elicitation.entity.Interview;
import com.backend.projet.elicitation.dto.request.InterviewRequest;
import com.backend.projet.elicitation.dto.response.InterviewResponse;
import com.backend.projet.elicitation.repository.InterviewRepository;
import com.backend.projet.projet.entity.Projet;
import com.backend.projet.projet.exception.ResourceNotFoundException;
import com.backend.projet.projet.repository.ProjetRepository;

@Service
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final ProjetRepository projetRepository;

    public InterviewService(InterviewRepository interviewRepository,
                            ProjetRepository projetRepository) {
        this.interviewRepository = interviewRepository;
        this.projetRepository = projetRepository;
    }

    public List<InterviewResponse> getByProjet(Long idProjet) {
        return interviewRepository.findByProjetIdProjet(idProjet)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public InterviewResponse create(InterviewRequest request) {
        Projet projet = projetRepository.findById(request.getIdProjet())
                .orElseThrow(() -> new ResourceNotFoundException("Projet non trouvé : " + request.getIdProjet()));

        Interview interview = new Interview();
        interview.setProjet(projet);
        interview.setDateInterview(request.getDateInterview());
        interview.setHeureInterview(request.getHeureInterview());
        interview.setTitre(request.getTitre());
        interview.setNomInterviewer(request.getNomInterviewer());
        interview.setObjectifs(request.getObjectifs());

        Interview saved = interviewRepository.save(interview);
        return toResponse(saved);
    }

    public InterviewResponse update(Long numeroInterview, InterviewRequest request) {
        Interview interview = interviewRepository.findById(numeroInterview)
                .orElseThrow(() -> new ResourceNotFoundException("Interview non trouvée : " + numeroInterview));

        interview.setDateInterview(request.getDateInterview());
        interview.setHeureInterview(request.getHeureInterview());
        interview.setTitre(request.getTitre());
        interview.setNomInterviewer(request.getNomInterviewer());
        interview.setObjectifs(request.getObjectifs());

        Interview saved = interviewRepository.save(interview);
        return toResponse(saved);
    }

    private InterviewResponse toResponse(Interview interview) {
        return new InterviewResponse(
                interview.getNumeroInterview(),
                interview.getProjet().getIdProjet(),
                interview.getDateInterview(),
                interview.getHeureInterview(),
                interview.getTitre(),
                interview.getNomInterviewer(),
                interview.getObjectifs()
        );
    }
}
