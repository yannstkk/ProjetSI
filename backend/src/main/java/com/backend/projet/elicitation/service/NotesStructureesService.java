package com.backend.projet.elicitation.service;

import com.backend.projet.elicitation.entity.Interview;
import com.backend.projet.elicitation.entity.NotesStructurees;
import com.backend.projet.elicitation.dto.request.NotesStructureesRequest;
import com.backend.projet.elicitation.dto.response.NotesStructureesResponse;
import com.backend.projet.elicitation.repository.InterviewRepository;
import com.backend.projet.elicitation.repository.NotesStructureesRepository;
import com.backend.projet.projet.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service responsable des opérations liées aux notes structurées.
 */
@Service
public class NotesStructureesService {

    private final NotesStructureesRepository notesStructureesRepository;
    private final InterviewRepository interviewRepository;

    public NotesStructureesService(NotesStructureesRepository notesStructureesRepository,
                                   InterviewRepository interviewRepository) {
        this.notesStructureesRepository = notesStructureesRepository;
        this.interviewRepository = interviewRepository;
    }

    /**
     * Récupère toutes les notes structurées d'une interview.
     * @param numeroInterview
     * @return
     */
    public List<NotesStructureesResponse> getByInterview(Long numeroInterview) {
        return notesStructureesRepository
                .findByInterviewNumeroInterview(numeroInterview)
                .stream()
                .map(n -> new NotesStructureesResponse(
                        n.getIdNotesStructurees(),
                        n.getInterview().getNumeroInterview(),
                        n.getCategorie(),
                        n.getContenu()
                ))
                .toList();
    }

    /**
     * Crée une nouvelle note structurée pour une interview.
     * @param request
     * @return
     */
    public NotesStructureesResponse creer(NotesStructureesRequest request) {
        Interview interview = interviewRepository
                .findById(request.getNumeroInterview())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Interview non trouvée : " + request.getNumeroInterview()));

        NotesStructurees ns = new NotesStructurees();
        ns.setInterview(interview);
        ns.setCategorie(request.getCategorie());
        ns.setContenu(request.getContenu());

        NotesStructurees saved = notesStructureesRepository.save(ns);

        return new NotesStructureesResponse(
                saved.getIdNotesStructurees(),
                saved.getInterview().getNumeroInterview(),
                saved.getCategorie(),
                saved.getContenu()
        );
    }

    /**
     * Supprime toutes les notes structurées d'une interview.
     * @param numeroInterview
     */
    public void deleteByInterview(Long numeroInterview) {
        List<NotesStructurees> liste =
                notesStructureesRepository.findByInterviewNumeroInterview(numeroInterview);
        notesStructureesRepository.deleteAll(liste);
    }
}