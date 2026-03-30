package com.backend.projet.elicitation.controller;

import com.backend.projet.elicitation.dto.request.NotesStructureesRequest;
import com.backend.projet.elicitation.dto.response.NotesStructureesResponse;
import com.backend.projet.elicitation.service.NotesStructureesService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for handling structured interview notes.
 * */
@RestController
@RequestMapping("/api/notes-structurees")
public class NotesStructureesController {

    private final NotesStructureesService notesStructureesService;

    public NotesStructureesController(NotesStructureesService notesStructureesService) {
        this.notesStructureesService = notesStructureesService;
    }

    /**
     * Retrieves all structured interview notes associated with a specific interview.
     * 
     * */
    @GetMapping("/interview/{numeroInterview}")
    public ResponseEntity<List<NotesStructureesResponse>> getByInterview(
            @PathVariable Long numeroInterview) {
        return ResponseEntity.ok(notesStructureesService.getByInterview(numeroInterview));
    }

    /**
     * Creates a new structured interview note.
     * 
     * */
    @PostMapping
    public ResponseEntity<NotesStructureesResponse> creer(
            @RequestBody NotesStructureesRequest request) {
        try {
            NotesStructureesResponse response = notesStructureesService.creer(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Deletes all structured notes associated with a specific interview.
     * 
     * */
    @DeleteMapping("/interview/{numeroInterview}")
    public ResponseEntity<Void> deleteByInterview(
            @PathVariable Long numeroInterview) {
        notesStructureesService.deleteByInterview(numeroInterview);
        return ResponseEntity.noContent().build();
    }
}