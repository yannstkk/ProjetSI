package com.backend.projet.modelisation.controller;

import com.backend.projet.mistral.exceptions.MistralApiException;
import com.backend.projet.mistral.service.MistralService;
import com.backend.projet.modelisation.dto.request.BpmnAnalyseRequest;
import com.backend.projet.modelisation.dto.response.BpmnCoherenceIaResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/** 
 * Controller responsable de l'analyse de cohérence des diagrammes BPMN via l'IA.
 */
@RestController
@RequestMapping("/api/bpmn")
public class BpmnAnalyseController {

    private final MistralService mistralService;

    public BpmnAnalyseController(MistralService mistralService) {
        this.mistralService = mistralService;
    }

    /**
     * Analyse la cohérence entre un diagramme BPMN et les User Stories associées.
     * @param request Contient le XML BPMN et les User Stories.
     * @return Un objet BpmnCoherenceIaResponse contenant le score et les explications.
     */
    @PostMapping("/analyser-coherence")
    public ResponseEntity<?> analyserCoherence(@RequestBody BpmnAnalyseRequest request) {
        try {
            if (request.getContenuBpmn() == null || request.getContenuBpmn().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Le contenu BPMN est requis.");
            }

            if (request.getUserStories() == null || request.getUserStories().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Les User Stories sont requises.");
            }

            BpmnCoherenceIaResponse response = mistralService.analyserCoherenceBpmn(
                    request.getContenuBpmn(),
                    request.getUserStories()
            );

            return ResponseEntity.ok(response);

        } catch (MistralApiException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur Mistral : " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur serveur : " + e.getMessage());
        }
    }
}