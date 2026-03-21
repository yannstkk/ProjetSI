package com.backend.projet.mistral.controller;


import com.backend.projet.mistral.service.MistralService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mistral")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MistralController {

    private final MistralService mistralService;

    public MistralController(MistralService mistralService) {
        this.mistralService = mistralService;
    }

    @PostMapping("/suggerer-questions")
    public ResponseEntity<String> suggererQuestions(@RequestBody NotesRequest request) {
        if (request.getNotes() == null || request.getNotes().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    "{\"error\": \"Le champ notes est requis et ne peut pas être vide\"}"
            );
        }
        String result = mistralService.suggererQuestions(request.getNotes());

        // MistralService retourne "Erreur API : ..." en cas d'échec
        // On détecte ce cas et on renvoie un 502 plutôt qu'un 200 avec du texte non-JSON
        if (result != null && result.startsWith("Erreur API")) {
            return ResponseEntity.status(502)
                    .body("{\"error\": \" hallucination IA \uD83D\uDE35\u200D\uD83D\uDCAB\u200B\"}");
        }else {

            return ResponseEntity.ok(result);
        }


    }


    public static class NotesRequest {
        private String notes;
        public String getNotes() {
            return notes;
        }
        public void setNotes(String notes) {
            this.notes = notes;
        }
    }
}



