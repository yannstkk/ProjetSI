package com.backend.projet.elicitation.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.projet.elicitation.dto.request.NotesRequest;
import com.backend.projet.elicitation.dto.response.NotesResponse;
import com.backend.projet.elicitation.service.NotesService;

@RestController
@RequestMapping("/api/notes") 
public class NotesController {
	private final NotesService notesService;
	
	public NotesController(NotesService notesService) {
		this.notesService = notesService;
	}
	
    @GetMapping
    public ResponseEntity<List<NotesResponse>> getAllNotes() {
        return ResponseEntity.ok(notesService.getAllNotes());
    }
    
    @PostMapping
    public ResponseEntity<NotesResponse> ajouterNote(@RequestBody NotesRequest request) {
        NotesResponse response = notesService.ajouterNote(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

}
