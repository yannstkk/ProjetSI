package com.backend.projet.elicitation.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.projet.elicitation.dto.request.NotesRequest;
import com.backend.projet.elicitation.dto.response.NotesResponse;
import com.backend.projet.elicitation.service.NotesService;

/**
 * Controller for managing raw interview notes.
 * Provides endpoints for creating, retrieving, and deleting notes associated with interviews.
 */
@RestController
@RequestMapping("/api/notes")
public class NotesController {

    private final NotesService notesService;

    public NotesController(NotesService notesService) {
        this.notesService = notesService;
    }

    /**
     * Retrieves all raw interview notes.
     * 
     * */
    @GetMapping
    public ResponseEntity<List<NotesResponse>> getAllNotes() {
        return ResponseEntity.ok(notesService.getAllNotes());
    }

    /**
     * Retrieves all raw interview notes associated with a specific interview.
     * 
     * */
    @GetMapping("/interview/{numeroInterview}")
    public ResponseEntity<List<NotesResponse>> getByInterview(
            @PathVariable Long numeroInterview) {
        return ResponseEntity.ok(notesService.getNotesByInterview(numeroInterview));
    }

    /**
     * Creates a new raw interview note.
     * 
     * */
    @PostMapping
    public ResponseEntity<NotesResponse> ajouterNote(@RequestBody NotesRequest request) {
        NotesResponse response = notesService.ajouterNote(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Deletes all notes associated with a specific interview.
     * 
     * */
    @DeleteMapping("/interview/{numeroInterview}")
    public ResponseEntity<Void> deleteByInterview(
            @PathVariable Long numeroInterview) {
        notesService.deleteByInterview(numeroInterview);
        return ResponseEntity.noContent().build();
    }
}