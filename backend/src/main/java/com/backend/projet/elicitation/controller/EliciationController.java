package com.backend.projet.elicitation.controller;

import com.backend.projet.elicitation.dto.request.NotesRequest;
import com.backend.projet.elicitation.dto.response.AnalysisResponse;
import com.backend.projet.elicitation.service.ElicitationService;
import com.backend.projet.mistral.service.MistralService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/elicitation/notes")
public class EliciationController {
    private final ElicitationService elicitation;

    public EliciationController(ElicitationService elicitation){
        this.elicitation=elicitation;
    }

    @PostMapping("/analyser")
    public ResponseEntity<AnalysisResponse> analyser(@RequestBody NotesRequest request){
        String notesBrutes = request.getContenu();
        try{
            AnalysisResponse resultat = elicitation.analyserNotes(notesBrutes);
            return  ResponseEntity.ok(resultat);
        }catch(Exception e){
            return ResponseEntity.internalServerError().build();
        }
    }

    // Pour l'instant, rien n'est sauvegardé en base ...
}
