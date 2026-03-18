package com.backend.projet.projet.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.projet.projet.dto.request.ProjetRequest;
import com.backend.projet.projet.dto.response.ProjetResponse;
import com.backend.projet.projet.service.ProjetService;

@RestController
@RequestMapping("/api/projets") 
public class ProjetController {
    private final ProjetService projetService;

    public ProjetController(ProjetService projetService) {
        this.projetService = projetService;
    }
    
    @GetMapping
    public ResponseEntity<List<ProjetResponse>> getAllProjets() {
        return ResponseEntity.ok(projetService.getAllProjets());
    }
    
    @PostMapping
    public ResponseEntity<ProjetResponse> creerProjet(@RequestBody ProjetRequest request) {
        ProjetResponse response = projetService.creerProjet(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
