package com.backend.projet.elicitation.service;

import com.backend.projet.mistral.enums.Prompt;
import com.backend.projet.mistral.service.MistralService;

public class QuestionService {
    private final MistralService mistralService;
    private final String prompt;

    public QuestionService(MistralService mistralService) {
        this.mistralService = mistralService;
        this.prompt = Prompt.ACTEURIA.getPrompt();
    }

    public ActeurIaResponse analyserActeur(String notes){
        return mistralService.executerAnalyse(notes, prompt, ActeurIaRequest.class);
    }
}
