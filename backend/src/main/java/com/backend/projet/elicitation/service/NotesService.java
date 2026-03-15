package com.backend.projet.elicitation.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.backend.projet.elicitation.dto.response.NotesResponse;
import com.backend.projet.elicitation.repository.NotesRepository;

@Service
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
