package com.backend.projet.modelisation.controller;

import com.backend.projet.mistral.exceptions.MistralApiException;
import com.backend.projet.modelisation.dto.request.MCDAnalyseRequest;
import com.backend.projet.modelisation.dto.request.MCDRequest;
import com.backend.projet.modelisation.dto.response.MCDAnalyseResponse;
import com.backend.projet.modelisation.dto.response.MCDResponse;
import com.backend.projet.modelisation.service.MCDService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller responsable des opérations liées aux MCD.
 */
@RestController
@RequestMapping("/api/mcd")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MCDController {

    private final MCDService mcdService;

    public MCDController(MCDService mcdService) {
        this.mcdService = mcdService;
    }

    /**
     * Créer un nouveau MCD.
     * @param request
     * @return
     */
    @PostMapping
    public ResponseEntity<MCDResponse> creer(@RequestBody MCDRequest request) {
        try {
            MCDResponse response = mcdService.creer(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Récupère tous les MCD d'un projet.
     * @param idProjet
     * @return
     */
    @GetMapping("/projet/{idProjet}")
    public ResponseEntity<List<MCDResponse>> getByProjet(@PathVariable Long idProjet) {
        try {
            return ResponseEntity.ok(mcdService.getByProjet(idProjet));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Récupère un MCD par son ID.
     * @param idMcd
     * @return
     */
    @GetMapping("/{idMcd}")
    public ResponseEntity<MCDResponse> getById(@PathVariable Long idMcd) {
        try {
            return ResponseEntity.ok(mcdService.getById(idMcd));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Met à jour un MCD existant.
     * @param idMcd
     * @return
     */
    @PutMapping("/{idMcd}")
    public ResponseEntity<MCDResponse> mettreAJour(
            @PathVariable Long idMcd,
            @RequestBody MCDRequest request) {
        try {
            return ResponseEntity.ok(mcdService.mettreAJour(idMcd, request));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Supprime un MCD.
     * @param idMcd
     * @return
     */
    @DeleteMapping("/{idMcd}")
    public ResponseEntity<Void> supprimer(@PathVariable Long idMcd) {
        try {
            mcdService.supprimer(idMcd);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Analyse un contenu PlantUML pour en extraire les flux sans persistance.
     * Utile pour un aperçu avant sauvegarde.
     * @param request
     * @return
     */
    @PostMapping("/analyser")
    public ResponseEntity<?> analyser(@RequestBody MCDAnalyseRequest request) {
        if (request.getContenuPlantuml() == null
                || request.getContenuPlantuml().isBlank()) {
            return ResponseEntity.badRequest()
                    .body("{\"error\": \"Le contenu PlantUML est requis.\"}");
        }
        try {
            MCDAnalyseResponse result = mcdService.analyser(request.getContenuPlantuml());
            return ResponseEntity.ok(result);
        } catch (MistralApiException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}