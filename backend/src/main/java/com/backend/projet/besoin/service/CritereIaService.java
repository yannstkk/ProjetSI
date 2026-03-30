package com.backend.projet.besoin.service;

import com.backend.projet.besoin.dto.response.CritereIaResponse;
import com.backend.projet.mistral.enums.Prompt;
import com.backend.projet.mistral.exceptions.MistralApiException;
import com.backend.projet.mistral.service.MistralService;
import org.springframework.stereotype.Service;

/**
 * Classe qui permet de générer des critères d'acceptation en utilisant l'IA.
 * Elle prépare les éléments de la User Story pour les envoyer au service Mistral.
 */
@Service
public class CritereIaService {
    private final MistralService mistralService;

    private final String prompt;

    /**
     * Constructeur qui reçoit le service Mistral.
     * @param mistralService Service chargé de la communication avec l'IA.
     */
    public CritereIaService(MistralService mistralService){

        this.mistralService = mistralService;
        this.prompt = Prompt.CRITEREIA.getPrompt();
    }

    /**
     * Génère des critères d'acceptation à partir de l'acteur, de l'action et du but.
     * Vérifie que tous les champs sont remplis avant de lancer l'analyse.
     * @param acteur Le rôle de l'utilisateur (En tant que...).
     * @param veux L'action souhaitée (Je veux...).
     * @param afin La raison de l'action (Afin de...).
     * @return La réponse de l'IA contenant la liste des critères.
     * @throws MistralApiException Si l'API de l'IA rencontre un problème.
     */
    public CritereIaResponse genererCritereIa(String acteur, String veux, String afin ) throws MistralApiException {
        if(acteur == null || acteur.isBlank() || veux == null || veux.isBlank() || afin == null || afin.isBlank()){
            throw new IllegalArgumentException("L'acteur, la raison ou le pourquoi manquent! ");
        }
        String us = "En tant que " + acteur + ", je veux que : " + "afin de :" + afin;
        return mistralService.executerAnalyse(us, prompt, CritereIaResponse.class);
    }
}