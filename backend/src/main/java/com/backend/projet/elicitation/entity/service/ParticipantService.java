package com.backend.projet.elicitation.entity.service;

import com.backend.projet.elicitation.entity.Interview;
import com.backend.projet.elicitation.entity.Participant;
import com.backend.projet.elicitation.entity.ParticipeInterview;
import com.backend.projet.elicitation.entity.dto.request.ParticipantRequest;
import com.backend.projet.elicitation.entity.dto.response.ParticipantResponse;
import com.backend.projet.elicitation.entity.identifiant.ParticipeInterviewId;
import com.backend.projet.elicitation.entity.repository.InterviewRepository;
import com.backend.projet.elicitation.entity.repository.ParticipantRepository;
import com.backend.projet.elicitation.entity.repository.ParticipeInterviewRepository;
import com.backend.projet.projet.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParticipantService {

    private final ParticipantRepository participantRepository;
    private final ParticipeInterviewRepository participeInterviewRepository;
    private final InterviewRepository interviewRepository;

    public ParticipantService(
            ParticipantRepository participantRepository,
            ParticipeInterviewRepository participeInterviewRepository,
            InterviewRepository interviewRepository) {
        this.participantRepository = participantRepository;
        this.participeInterviewRepository = participeInterviewRepository;
        this.interviewRepository = interviewRepository;
    }

    /**
     * Récupère tous les participants d'une interview avec leur rôle.
     */
    public List<ParticipantResponse> getByInterview(Long numeroInterview) {
        return participeInterviewRepository
                .findByInterviewNumeroInterview(numeroInterview)
                .stream()
                .map(pi -> new ParticipantResponse(
                        pi.getParticipant().getIdParticipant(),
                        pi.getParticipant().getNom(),
                        pi.getRole()
                ))
                .toList();
    }

    /**
     * Ajoute un participant à une interview.
     * Si le participant (par son nom) n'existe pas encore en BDD, il est créé.
     * Si la liaison existe déjà, on met juste à jour le rôle.
     */
    public ParticipantResponse ajouterParticipant(Long numeroInterview,
                                                  ParticipantRequest request) {
        Interview interview = interviewRepository
                .findById(numeroInterview)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Interview non trouvée : " + numeroInterview));

        // Récupérer ou créer le participant par son nom
        Participant participant = participantRepository
                .findByNom(request.getNom())
                .orElseGet(() -> {
                    Participant p = new Participant();
                    p.setNom(request.getNom());
                    return participantRepository.save(p);
                });

        // Créer ou mettre à jour la liaison PARTICIPE_INTERVIEW
        ParticipeInterviewId pid = new ParticipeInterviewId(
                participant.getIdParticipant(),
                interview.getNumeroInterview()
        );

        ParticipeInterview pi = participeInterviewRepository
                .findById(pid)
                .orElseGet(() -> {
                    ParticipeInterview newPi = new ParticipeInterview();
                    newPi.setId(pid);
                    newPi.setParticipant(participant);
                    newPi.setInterview(interview);
                    return newPi;
                });

        pi.setRole(request.getRole());
        ParticipeInterview saved = participeInterviewRepository.save(pi);

        return new ParticipantResponse(
                saved.getParticipant().getIdParticipant(),
                saved.getParticipant().getNom(),
                saved.getRole()
        );
    }

    /**
     * Supprime tous les participants d'une interview (avant re-sauvegarde).
     */
    public void deleteByInterview(Long numeroInterview) {
        List<ParticipeInterview> liste =
                participeInterviewRepository.findByInterviewNumeroInterview(numeroInterview);
        participeInterviewRepository.deleteAll(liste);
    }
}