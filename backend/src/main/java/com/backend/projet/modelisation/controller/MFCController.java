package com.backend.projet.modelisation.controller;

import com.backend.projet.modelisation.dto.FluxResponse;
import com.backend.projet.modelisation.service.MFCService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/api/modelisation/mfc")
public class MFCController {
    private final MFCService mfcService;

    public MFCController(MFCService mfcService) {
        this.mfcService = mfcService;
    }

    @PostMapping("/analyser")
    public ResponseEntity<FluxResponse> analyser(@RequestBody String plantUmlContent) {
        try {
            FluxResponse response = mfcService.analyserPlantUML(plantUmlContent);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}
