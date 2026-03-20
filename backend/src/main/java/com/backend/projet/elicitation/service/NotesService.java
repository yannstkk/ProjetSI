package com.backend.projet.elicitation.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.backend.projet.elicitation.dto.request.NotesRequest;
import com.backend.projet.elicitation.dto.response.NotesResponse;
import com.backend.projet.elicitation.repository.NotesRepository;
import com.backend.projet.elicitation.entity.Notes;
import com.backend.projet.projet.entity.Projet;
import com.backend.projet.projet.repository.ProjetRepository;


@Service
public class NotesService {
	
	private NotesRepository notesRepository;
	private ProjetRepository projetRepository;
	
	public NotesService(NotesRepository notesRepository, ProjetRepository projetRepository) {
		this.notesRepository = notesRepository;
		this.projetRepository = projetRepository;
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
    
    public NotesResponse ajouterNote(NotesRequest request) {
        Projet projet = projetRepository.findById(request.getIdProjet())
                .orElseThrow();

        Notes note = new Notes();
        note.setProjet(projet);
        note.setIdProjet(projet.getIdProjet());
        note.setContenu(request.getContenu());

        Notes saved = notesRepository.save(note);

        return new NotesResponse(
                saved.getNumeroNotes(),
                saved.getIdProjet(),
                saved.getContenu()
        );
    }

}
