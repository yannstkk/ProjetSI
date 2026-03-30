package com.backend.projet.projet.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.projet.projet.dto.request.ProjetRequest;
import com.backend.projet.projet.dto.response.ProjetResponse;
import com.backend.projet.projet.service.ProjetService;

/**
 *  * Controller for managing project-related operations.
 * Provides endpoints for retrieving, creating, and filtering projects by user.
 */
@RestController
@RequestMapping("/api/projets")
public class ProjetController {
    private final ProjetService projetService;

    public ProjetController(ProjetService projetService) {
        this.projetService = projetService;
    }

    /**
     * Retrieves a list of all projects.
     * @return
     */
    @GetMapping
    public ResponseEntity<List<ProjetResponse>> getAllProjets() {
        return ResponseEntity.ok(projetService.getAllProjets());
    }

    /**
     * Retrieves a list of projects associated with a specific user.
     * @param idUtilisateur
     * @return
     */
    @GetMapping("/user/{idUtilisateur}")
    public ResponseEntity<List<ProjetResponse>> getProjetsByUser(
            @PathVariable String idUtilisateur) {
        return ResponseEntity.ok(projetService.getProjetsByUser(idUtilisateur));
    }

    /**
     * Retrieves a project by its ID.
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProjetResponse> getProjetById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(projetService.getProjetById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Creates a new project.
     * @param request
     * @return
     */
    @PostMapping
    public ResponseEntity<ProjetResponse> creerProjet(@RequestBody ProjetRequest request) {
        ProjetResponse response = projetService.creerProjet(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
