package com.backend.projet.elicitation.entity.service;

import java.util.List;

import com.backend.projet.elicitation.entity.dto.response.NotesResponse;
import com.backend.projet.elicitation.entity.repository.NotesRepository;

public class NotesService {
	
	private final NotesRepository notesRepository;
	
	public NotesService(NotesRepository notesRepository) {
		this.notesRepository = notesRepository;
	}
	
    public List<NotesResponse> getAllNotes() {
        return notesRepository.findAll()
                .stream()
                .map(note -> new NotesResponse(
                        note.getNumeroNotes(),
                        note.getIdProjet(),
                        note.getContenu()
                ))
                .toList();
    }

}
