package com.backend.projet.modelisation.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.projet.modelisation.dto.request.ActeurRequest;
import com.backend.projet.modelisation.dto.response.ActeurResponse;
import com.backend.projet.modelisation.service.ActeurService;




@RestController
@RequestMapping("/api/acteur")
public class ActeurController {

	private final ActeurService acteurService;
	
    public ActeurController(ActeurService acteurService) {
        this.acteurService = acteurService;
    }
    
    @GetMapping("/projet/{idProjet}")
    public ResponseEntity<List<ActeurResponse>> getByProjet(@PathVariable Long idProjet) {
        return ResponseEntity.ok(acteurService.getByProjet(idProjet));
    }
    
    @PostMapping
    public ResponseEntity<ActeurResponse> create(@RequestBody ActeurRequest request) {
        try {
            ActeurResponse response = acteurService.create(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
