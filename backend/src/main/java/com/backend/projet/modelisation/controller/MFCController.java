package com.backend.projet.modelisation.controller;

import com.backend.projet.modelisation.dto.response.FluxResponse;
import com.backend.projet.modelisation.dto.response.MFCDetailResponse;
import com.backend.projet.modelisation.dto.request.MFCRequest;
import com.backend.projet.modelisation.dto.response.MFCResponse;
import com.backend.projet.modelisation.service.MFCService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/modelisation/mfc")
public class MFCController {

    private final MFCService mfcService;

    public MFCController(MFCService mfcService) {
        this.mfcService = mfcService;
    }

    /**
     * Analyse un contenu PlantUML pour en extraire les flux sans persistance.
     * Utile pour un aperçu avant sauvegarde.
     */
    @PostMapping("/analyser")
    public ResponseEntity<FluxResponse> analyser(@RequestBody String plantUmlContent) {
        try {
            FluxResponse response = mfcService.analyserPlantUML(plantUmlContent);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Analyse, transforme et enregistre un MFC en base de données.
     */
    @PostMapping("/analyser-importer")
    public ResponseEntity<?> analyserEtImporter(@RequestBody MFCRequest request) {
        String plantUmlContent = request.getPlantUmlContent();
        if (plantUmlContent == null || plantUmlContent.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    "{ \"erreur\" : \"Le champ plantUmlContent est requis et ne peut pas être vide\"}"
            );
        }
        try {
            MFCResponse mfcr = mfcService.importerEtSauvegarder(request);
            return ResponseEntity.ok(mfcr);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Charge tous les MFC d'un projet avec leurs flux et acteurs persistés.
     * Utilisé au chargement de la Phase 2B pour restaurer l'état depuis la BDD.
     */
    @GetMapping("/projet/{idProjet}")
    public ResponseEntity<List<MFCDetailResponse>> getByProjet(@PathVariable Long idProjet) {
        try {
            List<MFCDetailResponse> liste = mfcService.getMFCByProjet(idProjet);
            return ResponseEntity.ok(liste);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}