package com.backend.projet.modelisation.controller;

import com.backend.projet.modelisation.dto.response.FluxResponse;
import com.backend.projet.modelisation.dto.request.MFCRequest;
import com.backend.projet.modelisation.dto.response.MFCResponse;
import com.backend.projet.modelisation.service.MFCService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Contrôleur REST pour la gestion des Modèles de Flux Conceptuels (MFC).
 * <p>
 * Fournit des points d'accès pour l'analyse de diagrammes PlantUML via l'IA
 * et l'importation de ces données dans le système de persistance.
 * </p>
 */
@RestController
@RequestMapping("/api/modelisation/mfc")
public class MFCController {
    private final MFCService mfcService;

    public MFCController(MFCService mfcService) {
        this.mfcService = mfcService;
    }

    /**
     * Analyse un contenu PlantUML pour en extraire les flux sans persistance.
     * <p>
     * Cet endpoint est utile pour obtenir un aperçu (preview) du résultat de l'analyse
     * avant de décider de l'enregistrer officiellement.
     * </p>
     * * @param plantUmlContent Le texte brut du diagramme PlantUML à analyser.
     * @return {@link ResponseEntity} contenant un {@link FluxResponse} avec les flux détectés.
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
     * Analyse, transforme et enregistre un MFC en base de données pour un projet spécifique.
     * <p>
     * Cette méthode valide la présence du contenu PlantUML, utilise l'IA pour le mapper
     * en objets métier (Acteurs, Flux), puis sauvegarde l'ensemble des entités.
     * </p>
     * * @param request Objet {@link MFCRequest} contenant le PlantUML, l'ID du projet et le nom souhaité pour le MFC.
     * @return {@link ResponseEntity} contenant le {@link MFCResponse} (incluant l'ID généré) ou une erreur 400/500.
     */
    @PostMapping("/analyser-importer")
    public ResponseEntity<?> analyserEtImporter(@RequestBody MFCRequest request){
        String plantUmlContent = request.getPlantUmlContent();
        if(plantUmlContent==null || plantUmlContent.trim().isEmpty()){
            return ResponseEntity.badRequest().body(""" 
                    { "erreur" : "Le champ plantUmlContent est requis et ne peut pas être vide"}""");
        }
        try{
            MFCResponse mfcr = mfcService.importerEtSauvegarder(request);
            return ResponseEntity.ok(mfcr);
        } catch (Exception e) {
            return  ResponseEntity.internalServerError().build();
        }
    }

}
