package com.backend.projet.elicitation.controller;

import com.backend.projet.elicitation.dto.request.NotesStructureesRequest;
import com.backend.projet.elicitation.dto.response.NotesStructureesResponse;
import com.backend.projet.elicitation.service.NotesStructureesService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes-structurees")
public class NotesStructureesController {

    private final NotesStructureesService notesStructureesService;

    public NotesStructureesController(NotesStructureesService notesStructureesService) {
        this.notesStructureesService = notesStructureesService;
    }

    @GetMapping("/interview/{numeroInterview}")
    public ResponseEntity<List<NotesStructureesResponse>> getByInterview(
            @PathVariable Long numeroInterview) {
        return ResponseEntity.ok(notesStructureesService.getByInterview(numeroInterview));
    }

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

    @DeleteMapping("/interview/{numeroInterview}")
    public ResponseEntity<Void> deleteByInterview(
            @PathVariable Long numeroInterview) {
        notesStructureesService.deleteByInterview(numeroInterview);
        return ResponseEntity.noContent().build();
    }
}