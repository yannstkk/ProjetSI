package com.backend.projet.elicitation.controller;

import com.backend.projet.elicitation.dto.request.QuestionRequest;
import com.backend.projet.elicitation.dto.response.QuestionResponse;
import com.backend.projet.elicitation.service.QuestionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for managing interview questions.
 * */
@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    /**
     * Retrieves all questions associated with a specific interview.
     * 
     * */
    @GetMapping("/interview/{numeroInterview}")
    public ResponseEntity<List<QuestionResponse>> getByInterview(
            @PathVariable Long numeroInterview) {
        return ResponseEntity.ok(questionService.getByInterview(numeroInterview));
    }

    /**
     * Creates a new question for a specific interview.
     * 
     * */
    @PostMapping
    public ResponseEntity<QuestionResponse> creer(
            @RequestBody QuestionRequest request) {
        try {
            QuestionResponse response = questionService.creer(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Deletes all questions associated with a specific interview.
     * 
     * */
    @DeleteMapping("/interview/{numeroInterview}")
    public ResponseEntity<Void> deleteByInterview(
            @PathVariable Long numeroInterview) {
        questionService.deleteByInterview(numeroInterview);
        return ResponseEntity.noContent().build();
    }
}