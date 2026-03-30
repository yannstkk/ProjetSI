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

import com.backend.projet.elicitation.dto.request.UserStoryRequest;
import com.backend.projet.elicitation.dto.response.UserStoryResponse;
import com.backend.projet.elicitation.service.UserStoryService;

/**
 * Controller for managing user stories within a project.
 * Provides endpoints for creating, retrieving, and deleting user stories.
 */
@RestController
@RequestMapping("/api/userstories")
public class UserStoryController {

    private final UserStoryService userStoryService;

    public UserStoryController(UserStoryService userStoryService) {
        this.userStoryService = userStoryService;
    }

    /**
     * Retrieves all user stories associated with a specific project.
     * 
     * */
    @GetMapping("/projet/{idProjet}")
    public ResponseEntity<List<UserStoryResponse>> getByProjet(@PathVariable Long idProjet) {
        return ResponseEntity.ok(userStoryService.getByProjet(idProjet));
    }

    /**
     * Creates a new user story for a specific project.
     * 
     * */
    @PostMapping
    public ResponseEntity<UserStoryResponse> add(@RequestBody UserStoryRequest request) {
        UserStoryResponse response = userStoryService.add(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Deletes a user story by its ID.
     * 
     * */
    @DeleteMapping("/{idUs}")
    public ResponseEntity<Void> delete(@PathVariable Long idUs) {
        userStoryService.delete(idUs);
        return ResponseEntity.noContent().build();   // 204 No Content
    }
}