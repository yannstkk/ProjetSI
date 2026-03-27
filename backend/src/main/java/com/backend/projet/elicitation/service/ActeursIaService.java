package com.backend.projet.elicitation.service;

import com.backend.projet.elicitation.dto.response.ActeurIaResponse;
import com.backend.projet.mistral.enums.Prompt;
import com.backend.projet.mistral.service.MistralService;
import org.springframework.stereotype.Service;

@Service
public class ActeursIaService {
    private final MistralService mistralService;
    private final String prompt;

    public ActeursIaService(MistralService mistralService){
        this.mistralService = mistralService;
        this.prompt = Prompt.ACTEURIA.getPrompt();
    }

    public ActeurIaResponse detecterActeurs(String notesBrutes){
        if (notesBrutes == null || notesBrutes.isBlank()) {
            throw new IllegalArgumentException("Les notes ne peuvent pas être vides");
        }

        return mistralService.executerAnalyse(notesBrutes, prompt, ActeurIaResponse.class);
    }
}