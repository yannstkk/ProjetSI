package com.backend.projet.besoin.service;

import com.backend.projet.besoin.dto.response.CritereIaResponse;
import com.backend.projet.mistral.enums.Prompt;
import com.backend.projet.mistral.exceptions.MistralApiException;
import com.backend.projet.mistral.service.MistralService;
import org.springframework.stereotype.Service;

@Service
public class CritereIaService {
    private final MistralService mistralService;

    private final String prompt;

    public CritereIaService(MistralService mistralService){

        this.mistralService = mistralService;
        this.prompt = Prompt.CRITEREIA.getPrompt();
    }

    public CritereIaResponse genererCritereIa(String acteur, String veux, String afin ) throws MistralApiException {
        if(acteur == null || acteur.isBlank() || veux == null || veux.isBlank() || afin == null || afin.isBlank()){
            throw new IllegalArgumentException("L'acteur, la raison ou le pourquoi manquent! ");
        }
        String us = "En tant que " + acteur + ", je veux que : " + "afin de :" + afin;
        return mistralService.executerAnalyse(us, prompt, CritereIaResponse.class);
    }
}
