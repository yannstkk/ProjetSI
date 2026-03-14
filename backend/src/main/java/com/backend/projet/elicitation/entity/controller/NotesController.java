package com.backend.projet.elicitation.entity.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.projet.elicitation.entity.dto.response.NotesResponse;
import com.backend.projet.elicitation.entity.service.NotesService;

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

}
