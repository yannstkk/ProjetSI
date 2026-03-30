package com.backend.projet.elicitation.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.backend.projet.elicitation.entity.Interview;
import com.backend.projet.elicitation.entity.Notes;
import com.backend.projet.elicitation.dto.request.NotesRequest;
import com.backend.projet.elicitation.dto.response.NotesResponse;
import com.backend.projet.elicitation.repository.InterviewRepository;
import com.backend.projet.elicitation.repository.NotesRepository;
import com.backend.projet.projet.exception.ResourceNotFoundException;

/**
 * Service responsable des opérations liées aux notes.
*/
@Service
public class NotesService {

    private final NotesRepository notesRepository;
    private final InterviewRepository interviewRepository;

    public NotesService(NotesRepository notesRepository,
                        InterviewRepository interviewRepository) {
        this.notesRepository = notesRepository;
        this.interviewRepository = interviewRepository;
    }

    /**
     * Récupère toutes les notes.
     * @return
     */
    public List<NotesResponse> getAllNotes() {
        return notesRepository.findAll()
                .stream()
                .map(note -> new NotesResponse(
                        note.getNumeroNotes(),
                        note.getInterview().getNumeroInterview(),
                        note.getContenu()
                ))
                .toList();
    }

    /**
     * Récupère toutes les notes d'une interview.
     * @param numeroInterview
     * @return
     */
    public List<NotesResponse> getNotesByInterview(Long numeroInterview) {
        return notesRepository.findByInterviewNumeroInterview(numeroInterview)
                .stream()
                .map(note -> new NotesResponse(
                        note.getNumeroNotes(),
                        note.getInterview().getNumeroInterview(),
                        note.getContenu()
                ))
                .toList();
    }

    /**
     * Ajoute une note à une interview.
     * @param request
     * @return
     */
    public NotesResponse ajouterNote(NotesRequest request) {
        Interview interview = interviewRepository
                .findById(request.getNumeroInterview())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Interview non trouvée : " + request.getNumeroInterview()));

        Notes note = new Notes();
        note.setInterview(interview);
        note.setContenu(request.getContenu());

        Notes saved = notesRepository.save(note);

        return new NotesResponse(
                saved.getNumeroNotes(),
                saved.getInterview().getNumeroInterview(),
                saved.getContenu()
        );
    }

    /**
     * Supprime toutes les notes d'une interview.
     * @param numeroInterview
     */
    public void deleteByInterview(Long numeroInterview) {
        List<Notes> liste = notesRepository.findByInterviewNumeroInterview(numeroInterview);
        notesRepository.deleteAll(liste);
    }
}