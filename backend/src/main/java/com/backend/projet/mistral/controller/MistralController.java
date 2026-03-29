package com.backend.projet.mistral.controller;

import com.backend.projet.besoin.dto.request.CritereIaRequest;
import com.backend.projet.besoin.dto.response.CritereIaResponse;
import com.backend.projet.besoin.service.CritereIaService;
import com.backend.projet.elicitation.dto.request.NotesRequest;
import com.backend.projet.mistral.dto.BacklogAnalyseResponse;
import com.backend.projet.mistral.service.MistralService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mistral")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MistralController {

    private final MistralService   mistralService;
    private final CritereIaService critereIaService;

    public MistralController(MistralService mistralService, CritereIaService critereIaService) {
        this.mistralService   = mistralService;
        this.critereIaService = critereIaService;
    }

    @PostMapping("/suggerer-questions")
    public ResponseEntity<String> suggererQuestions(@RequestBody NotesRequest request) {
        if (request.getContenu() == null || request.getContenu().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    "{\"error\": \"Le champ notes est requis et ne peut pas être vide\"}"
            );
        }
        String result = mistralService.suggererQuestions(request.getContenu());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/generer-criteres")
    public ResponseEntity<CritereIaResponse> genererCriteresIa(@RequestBody CritereIaRequest req) {
        CritereIaResponse result = critereIaService.genererCritereIa(
                req.getActeur(), req.getVeux(), req.getAfin()
        );
        return ResponseEntity.ok(result);
    }

    /**
     * Analyse le backlog complet et retourne les incohérences, doublons,
     * erreurs de formulation et suggestions d'amélioration.
     */
    @PostMapping("/analyser-backlog")
    public ResponseEntity<?> analyserBacklog(@RequestBody NotesRequest request) {
        if (request.getContenu() == null || request.getContenu().trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("{\"error\": \"Le contenu du backlog est requis.\"}");
        }
        try {
            BacklogAnalyseResponse result = mistralService.analyserBacklog(request.getContenu());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}