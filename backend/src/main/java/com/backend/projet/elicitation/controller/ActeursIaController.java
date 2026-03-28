package com.backend.projet.elicitation.controller;


import com.backend.projet.elicitation.dto.request.NotesRequest;
import com.backend.projet.elicitation.dto.response.ActeurIaResponse;
import com.backend.projet.elicitation.service.ActeursIaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mistral")
public class ActeursIaController {
    private final ActeursIaService ais;

    public ActeursIaController(ActeursIaService ais){
        this.ais = ais;
    }

    @PostMapping("/detecter-acteurs")
    public ResponseEntity<?> detecter(@RequestBody NotesRequest notes){ // de ce que j'ai compris le ? c'est pour plsr types.
        String contenu = notes.getContenu();
        if(contenu==null || contenu.trim().isEmpty()){
            return ResponseEntity.badRequest().body("{\"error\": \"Le champ notes est requis et ne peut pas être vide\"}");
        }
        try{
            ActeurIaResponse resultat = ais.detecterActeurs(contenu);
            return  ResponseEntity.ok(resultat);
        }catch (Exception e){
            return ResponseEntity.internalServerError().build();
        }
    }

    // Pareil, les acteurs ne sont pas sauvegardés en base à cette étape ...

}
