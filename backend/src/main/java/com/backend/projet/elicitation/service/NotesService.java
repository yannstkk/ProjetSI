package com.backend.projet.elicitation.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.backend.projet.elicitation.dto.request.NotesRequest;
import com.backend.projet.elicitation.dto.response.NotesResponse;
import com.backend.projet.elicitation.entity.Notes;
import com.backend.projet.elicitation.entity.identifiant.NotesId;
import com.backend.projet.elicitation.repository.NotesRepository;
import com.backend.projet.projet.entity.Projet;
import com.backend.projet.projet.repository.ProjetRepository;

@Service
public class NotesService {

    private NotesRepository notesRepository;
    private ProjetRepository projetRepository;

    public NotesService(NotesRepository notesRepository,
                        ProjetRepository projetRepository) {
        this.notesRepository = notesRepository;
        this.projetRepository = projetRepository;
    }

    // Existant
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

    // Nouveau — filtrer par projet
    public List<NotesResponse> getNotesByProjet(Long idProjet) {
        return notesRepository.findByIdProjet(idProjet)
                .stream()
                .map(note -> new NotesResponse(
                        note.getNumeroNotes(),
                        note.getIdProjet(),
                        note.getContenu()
                ))
                .toList();
    }

    // Existant
    public NotesResponse ajouterNote(NotesRequest request) {
        Projet projet = projetRepository.findById(request.getIdProjet())
                .orElseThrow();

        // Générer le prochain numeroNotes pour ce projet
        List<Notes> existantes = notesRepository.findByIdProjet(request.getIdProjet());
        Long nextNumero = existantes.isEmpty()
                ? 1L
                : existantes.stream()
                .mapToLong(Notes::getNumeroNotes)
                .max()
                .getAsLong() + 1;

        Notes note = new Notes();
        note.setNumeroNotes(nextNumero);
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

    // Nouveau — modifier une note existante
    public NotesResponse modifierNote(Long numeroNotes, Long idProjet,
                                      NotesRequest request) {
        NotesId id = new NotesId(numeroNotes, idProjet);
        Notes note = notesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Note introuvable : " + numeroNotes + "/" + idProjet));

        note.setContenu(request.getContenu());
        Notes saved = notesRepository.save(note);

        return new NotesResponse(
                saved.getNumeroNotes(),
                saved.getIdProjet(),
                saved.getContenu()
        );
    }
}