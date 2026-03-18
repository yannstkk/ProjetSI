package com.backend.projet.modelisation.service;


import com.backend.projet.mistral.enums.Prompt;
import com.backend.projet.mistral.service.MistralService;
import com.backend.projet.modelisation.dto.FluxResponse;
import com.backend.projet.modelisation.entity.Acteur;
import com.backend.projet.modelisation.entity.Flux;
import com.backend.projet.modelisation.entity.MFC;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class MFCService {
    private final MistralService mistralService;

    public MFCService(MistralService mistralService) {
        this.mistralService = mistralService;
    }

    public FluxResponse analyserPlantUML(String content) {
        return mistralService.executerAnalyse(content, Prompt.MFC.getPrompt(),FluxResponse.class );
    }


    public FluxResponse importMFC(String plantUmlContent){
        FluxResponse fluxAnalyse = mistralService.analyserMFC(plantUmlContent);
        MFC mfc = new MFC();
        Map<String, Acteur> acteurs = new HashMap<>();
        if (fluxAnalyse.flux != null){
            for(FluxResponse.FluxElement element : fluxAnalyse.flux){
                Flux f = new Flux();
                f.setNom(element.nom);
                f.setDescription(element.description);
                f.setData(element.data);
                f.setActeurSortie(getOrCreateActeur(element.emetteur, acteurs));
                f.setActeurEntree(getOrCreateActeur(element.recepteur, acteurs));
                f.setMfc(mfc);
            }
        }
        return fluxAnalyse;
    }

    private Acteur getOrCreateActeur(String nom, Map<String, Acteur> acteurs){
        return acteurs.computeIfAbsent(nom, n->{
            Acteur a = new Acteur();
            a.setNom(n);
            return a;
        });
    }
}
