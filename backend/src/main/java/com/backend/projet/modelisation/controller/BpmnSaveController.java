package com.backend.projet.modelisation.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller responsable des opérations de sauvegarde de diagrammes BPMN.
 */
@RestController
@RequestMapping("/api/bpmn")
@CrossOrigin(origins = "*")
public class BpmnSaveController {

    /**
     * Sauvegarde un diagramme BPMN.
     * @param data
     * @return
     */
    @PostMapping("/save")
    public ResponseEntity<?> saveBpmn(@RequestBody Map<String, Object> data) {

        Object titreObj = data.get("titre");
        Object contenuObj = data.get("contenu");

        String titre = titreObj != null ? titreObj.toString() : null;
        String contenu = contenuObj != null ? contenuObj.toString() : null;

        if (titre == null || titre.isBlank() || contenu == null || contenu.isBlank()) {
            return ResponseEntity.badRequest().body("DonnÃ©es invalides");
        }

        System.out.println("BPMN sauvegardÃ© : " + titre);

        return ResponseEntity.ok(Map.of("idBpmn", 1));
    }
}
