package com.backend.projet.elicitation.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.projet.elicitation.dto.request.InterviewRequest;
import com.backend.projet.elicitation.dto.response.InterviewResponse;
import com.backend.projet.elicitation.service.InterviewService;

/*/**
 * Controller for managing interview sessions within a project.
 * Provides endpoints for creating, retrieving, and updating interview details.
 */
@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    /**
     * Retrieves all interview sessions associated with a specific project.
     * 
     * */
    @GetMapping("/projet/{idProjet}")
    public ResponseEntity<List<InterviewResponse>> getByProjet(@PathVariable Long idProjet) {
    	return ResponseEntity.ok(interviewService.getByProjet(idProjet));
    }

    /**
     * Creates a new interview session for a specific project.
     * 
     * */
    @PostMapping
    public ResponseEntity<InterviewResponse> create(@RequestBody InterviewRequest request) {
        try {
            InterviewResponse response = interviewService.create(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Updates an existing interview session for a specific project.
     * 
     * */
    @PutMapping("/{idProjet}")
    public ResponseEntity<InterviewResponse> update(
            @PathVariable Long idProjet,
            @RequestBody InterviewRequest request) {
        try {
            InterviewResponse response = interviewService.update(idProjet, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
