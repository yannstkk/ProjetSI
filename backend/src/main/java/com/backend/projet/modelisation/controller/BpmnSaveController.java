package com.backend.projet.modelisation.controller;

import com.backend.projet.modelisation.dto.request.BpmnRequest;
import com.backend.projet.modelisation.dto.response.BpmnResponse;
import com.backend.projet.modelisation.service.BpmnService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller responsable des opérations liées aux BPMN.
 */
@RestController
@RequestMapping("/api/bpmn")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class BpmnSaveController {

    private final BpmnService bpmnService;

    public BpmnSaveController(BpmnService bpmnService) {
        this.bpmnService = bpmnService;
    }

    /**
     * Récupère tous les BPMN d'un projet
     */
    @GetMapping("/projet/{idProjet}")
    public ResponseEntity<List<BpmnResponse>> getByProjet(@PathVariable Long idProjet) {
        return ResponseEntity.ok(bpmnService.getByProjet(idProjet));
    }

    /**
     * Récupère un BPMN par son ID
     */
    @GetMapping("/{idBpmn}")
    public ResponseEntity<BpmnResponse> getById(@PathVariable Long idBpmn) {
        return ResponseEntity.ok(bpmnService.getById(idBpmn));
    }

    /**
     * Sauvegarde un nouveau BPMN
     */
    @PostMapping("/save")
    public ResponseEntity<?> saveBpmn(@RequestBody BpmnRequest request) {
        try {
            BpmnResponse response = bpmnService.save(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Validation échouée : " + e.getMessage())
            );
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    Map.of("error", "Erreur lors de la sauvegarde : " + e.getMessage())
            );
        }
    }

    /**
     * Met à jour un BPMN existant
     */
    @PutMapping("/{idBpmn}")
    public ResponseEntity<?> updateBpmn(@PathVariable Long idBpmn,
                                        @RequestBody BpmnRequest request) {
        try {
            BpmnResponse response = bpmnService.update(idBpmn, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    Map.of("error", "Erreur lors de la mise à jour : " + e.getMessage())
            );
        }
    }

    /**
     * Supprime un BPMN
     */
    @DeleteMapping("/{idBpmn}")
    public ResponseEntity<?> deleteBpmn(@PathVariable Long idBpmn) {
        try {
            bpmnService.delete(idBpmn);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    Map.of("error", "Erreur lors de la suppression : " + e.getMessage())
            );
        }
    }
}
