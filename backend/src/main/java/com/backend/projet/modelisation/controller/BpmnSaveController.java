package com.backend.projet.modelisation.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/bpmn")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class BpmnSaveController {

    @PostMapping("/save")
    public ResponseEntity<?> saveBpmn(@RequestBody Map<String, Object> data) {

        Object titreObj = data.get("titre");
        Object contenuObj = data.get("contenu");

        String titre = titreObj != null ? titreObj.toString() : null;
        String contenu = contenuObj != null ? contenuObj.toString() : null;

        if (titre == null || titre.isBlank() || contenu == null || contenu.isBlank()) {
            return ResponseEntity.badRequest().body("Données invalides");
        }

        System.out.println("BPMN sauvegardé : " + titre);

        return ResponseEntity.ok(Map.of("idBpmn", 1));
    }
}