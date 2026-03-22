package com.backend.projet.elicitation.entity.service;

import com.backend.projet.elicitation.entity.Interview;
import com.backend.projet.elicitation.entity.NotesStructurees;
import com.backend.projet.elicitation.entity.dto.request.NotesStructureesRequest;
import com.backend.projet.elicitation.entity.dto.response.NotesStructureesResponse;
import com.backend.projet.elicitation.entity.repository.InterviewRepository;
import com.backend.projet.elicitation.entity.repository.NotesStructureesRepository;
import com.backend.projet.projet.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotesStructureesService {

    private final NotesStructureesRepository notesStructureesRepository;
    private final InterviewRepository interviewRepository;

    public NotesStructureesService(NotesStructureesRepository notesStructureesRepository,
                                   InterviewRepository interviewRepository) {
        this.notesStructureesRepository = notesStructureesRepository;
        this.interviewRepository = interviewRepository;
    }

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

    public void deleteByInterview(Long numeroInterview) {
        List<NotesStructurees> liste =
                notesStructureesRepository.findByInterviewNumeroInterview(numeroInterview);
        notesStructureesRepository.deleteAll(liste);
    }
}