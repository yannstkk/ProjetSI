package com.backend.projet.modelisation.controller;

import com.backend.projet.elicitation.entity.UserStory;
import com.backend.projet.elicitation.repository.UserStoryRepository;
import com.backend.projet.mistral.enums.Prompt;
import com.backend.projet.mistral.exceptions.MistralApiException;
import com.backend.projet.mistral.service.MistralService;
import com.backend.projet.modelisation.dto.request.ExigenceRequest;
import com.backend.projet.modelisation.dto.response.ExigenceResponse;
import com.backend.projet.modelisation.service.ExigenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/modelisation/exigences")
@CrossOrigin(origins = "*")
public class ExigenceController {

    @Autowired
    private MistralService mistralService;

    @Autowired
    private ExigenceService exigenceService;

    @Autowired
    private UserStoryRepository userStoryRepository;

    /**
     * Phase 5A : Génération automatique des EF via Mistral AI
     */
    @PostMapping("/generer/{projetId}")
    public ResponseEntity<Map<String, List<ExigenceResponse>>> generer(@PathVariable Long projetId) {
        // 1. Récupérer toutes les User Stories du projet
        List<UserStory> backlog = userStoryRepository.findByProjetIdProjet(projetId);
        System.out.println("NB User Stories trouvées : " + backlog.size()); // <--- ICI

        if (backlog.isEmpty()) {
            return ResponseEntity.ok(Map.of("exigences", List.of()));
        }

        // 2. Transformer le backlog en texte pour l'IA
        String backlogTexte = backlog.stream()
                .map(us -> String.format("[%s] En tant que %s, je veux %s afin de %s",
                        us.getIdUs(), us.getActeur(), us.getVeux(), us.getAfin()))
                .collect(Collectors.joining("\n"));

        System.out.println("Texte envoyé à Mistral : \n" + backlogTexte); // <--- ET ICI

        // 3. Appeler Mistral via la méthode générique executerAnalyse
        try {
            ExigencesWrapper iaResult = mistralService.executerAnalyse(
                    backlogTexte,
                    Prompt.SYNTHESE_EF.getPrompt(),
                    ExigencesWrapper.class
            );

            return ResponseEntity.ok(Map.of("exigences", iaResult.getExigences()));

        } catch (MistralApiException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Phase 5A : Sauvegarde manuelle des exigences validées/modifiées
     */
    @PostMapping("/sauvegarder/{projetId}")
    public ResponseEntity<Void> sauvegarder(@PathVariable Long projetId, @RequestBody List<ExigenceRequest> exigences) {
        exigenceService.sauvegarderExigences(projetId, exigences);
        return ResponseEntity.ok().build();
    }

    /**
     * Classe interne pour mapper le JSON de Mistral { "exigences": [...] }
     */
    public static class ExigencesWrapper {
        private List<ExigenceResponse> exigences;
        public List<ExigenceResponse> getExigences() { return exigences; }
        public void setExigences(List<ExigenceResponse> exigences) { this.exigences = exigences; }
    }
}