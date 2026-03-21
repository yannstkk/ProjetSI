package com.backend.projet.elicitation.controller;

import com.backend.projet.elicitation.dto.request.InterviewRequest;
import com.backend.projet.elicitation.dto.response.InterviewResponse;
import com.backend.projet.elicitation.service.InterviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @GetMapping("/projet/{idProjet}")
    public ResponseEntity<InterviewResponse> getByProjet(@PathVariable Long idProjet) {
        return interviewService.getByProjet(idProjet)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<InterviewResponse> create(@RequestBody InterviewRequest request) {
        try {
            InterviewResponse response = interviewService.create(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

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