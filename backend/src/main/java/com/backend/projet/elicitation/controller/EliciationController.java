package com.backend.projet.elicitation.controller;

import com.backend.projet.common.util.service.MistralService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/elicitation/notes")
public class EliciationController {
    private final MistralService mistral;

    public EliciationController(MistralService mistral){
        this.mistral=mistral;
    }

    @PostMapping("/analyser")
    public ResponseEntity<String> analyser(@RequestBody String notesBrutes){
        try{
            String resultat = mistral.analyserNotes(notesBrutes);
            return  ResponseEntity.ok(resultat);
        }catch(Exception e){
            return ResponseEntity.internalServerError().body("Erreur :" + e.getMessage());
        }
    }

}
