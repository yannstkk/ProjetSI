package com.backend.projet.elicitation.service;

import com.backend.projet.elicitation.dto.request.InterviewRequest;
import com.backend.projet.elicitation.dto.response.InterviewResponse;
import com.backend.projet.elicitation.entity.Interview;
import com.backend.projet.elicitation.repository.InterviewRepository;
import com.backend.projet.projet.entity.Projet;
import com.backend.projet.projet.repository.ProjetRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final ProjetRepository projetRepository;

    public InterviewService(InterviewRepository interviewRepository,
                            ProjetRepository projetRepository) {
        this.interviewRepository = interviewRepository;
        this.projetRepository    = projetRepository;
    }

    public Optional<InterviewResponse> getByProjet(Long idProjet) {
        return interviewRepository.findByIdProjet(idProjet)
                .map(this::toResponse);
    }

    public InterviewResponse create(InterviewRequest request) {
        Projet projet = projetRepository.findById(request.getIdProjet())
                .orElseThrow(() -> new RuntimeException("Projet introuvable : " + request.getIdProjet()));

        // Générer le numéro d'interview (1 par projet)
        Long numeroInterview = 1L;

        Interview interview = new Interview();
        interview.setNumeroInterview(numeroInterview);
        interview.setProjet(projet);
        interview.setIdProjet(projet.getIdProjet());
        interview.setSujet(request.getSujet());
        interview.setDateInterview(request.getDateInterview());
        interview.setNomInterviewer(request.getNomInterviewer());
        interview.setParticipants(request.getParticipants());
        interview.setBesoins(request.getBesoins());
        interview.setRegles(request.getRegles());
        interview.setDonnees(request.getDonnees());
        interview.setContraintes(request.getContraintes());
        interview.setSolutions(request.getSolutions());

        Interview saved = interviewRepository.save(interview);
        return toResponse(saved);
    }

    public InterviewResponse update(Long idProjet, InterviewRequest request) {
        Interview interview = interviewRepository.findByIdProjet(idProjet)
                .orElseThrow(() -> new RuntimeException("Interview introuvable pour le projet : " + idProjet));

        interview.setSujet(request.getSujet());
        interview.setDateInterview(request.getDateInterview());
        interview.setNomInterviewer(request.getNomInterviewer());
        interview.setParticipants(request.getParticipants());
        interview.setBesoins(request.getBesoins());
        interview.setRegles(request.getRegles());
        interview.setDonnees(request.getDonnees());
        interview.setContraintes(request.getContraintes());
        interview.setSolutions(request.getSolutions());

        Interview saved = interviewRepository.save(interview);
        return toResponse(saved);
    }

    private InterviewResponse toResponse(Interview i) {
        return new InterviewResponse(
                i.getNumeroInterview(),
                i.getIdProjet(),
                i.getSujet(),
                i.getDateInterview(),
                i.getNomInterviewer(),
                i.getParticipants(),
                i.getBesoins(),
                i.getRegles(),
                i.getDonnees(),
                i.getContraintes(),
                i.getSolutions()
        );
    }
}