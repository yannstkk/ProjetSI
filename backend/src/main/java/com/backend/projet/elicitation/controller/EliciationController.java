package com.backend.projet.elicitation.controller;

import com.backend.projet.elicitation.dto.request.NotesRequest;
import com.backend.projet.elicitation.dto.response.AnalysisResponse;
import com.backend.projet.elicitation.service.ElicitationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for handling the elicitation process from interview notes.
 * This controller uses AI to analyze raw text and extract structured information
 * such as actors, user stories, and functional requirements.
 */
@RestController
@RequestMapping("/api/elicitation/notes")
public class EliciationController {
    private final ElicitationService elicitation;

    public EliciationController(ElicitationService elicitation){
        this.elicitation=elicitation;
    }

    /**
     * Analyzes interview notes using AI to extract structured data.
     * 
     * @param request The request body containing the raw text to analyze.
     * @return A ResponseEntity containing the structured analysis (actors, user stories, etc.).
     */
    @PostMapping("/analyser")
    public ResponseEntity<AnalysisResponse> analyser(@RequestBody NotesRequest request){
        String notesBrutes = request.getContenu();
        try{
            AnalysisResponse resultat = elicitation.analyserNotes(notesBrutes);
            return  ResponseEntity.ok(resultat);
        }catch(Exception e){
            return ResponseEntity.internalServerError().build();
        }
    }
}