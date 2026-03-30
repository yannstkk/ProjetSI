package com.backend.projet.elicitation.service;

import com.backend.projet.elicitation.dto.response.AnalysisResponse;
import com.backend.projet.mistral.enums.Prompt;
import com.backend.projet.mistral.exceptions.MistralApiException;
import com.backend.projet.mistral.service.MistralService;
import org.springframework.stereotype.Service;

/**
 * Service responsable de l'analyse automatique des notes d'interview
 * via l'intelligence artificielle (Mistral).
 */
@Service
public class ElicitationService {
    private final MistralService mistralService;
    private final String prompt;

    public ElicitationService(MistralService mistralService) {
        this.mistralService = mistralService;
        this.prompt = Prompt.ELICITATION.getPrompt();
    }

    /**
     * Analyse les notes d'interview pour en extraire une structure (questions, participants, notes structurées).
     * @param notesBrutes Le texte brut de l'interview.
     * @return Un objet AnalysisResponse contenant les données extraites.
     * @throws MistralApiException Si une erreur survient lors de l'appel à l'API Mistral.
     */
    public AnalysisResponse analyserNotes(String notesBrutes) throws MistralApiException {
        if (notesBrutes == null || notesBrutes.isBlank()) {
            throw new IllegalArgumentException("Les notes ne peuvent pas être vides");
        }

        return mistralService.executerAnalyse(notesBrutes, prompt, AnalysisResponse.class);
    }
}