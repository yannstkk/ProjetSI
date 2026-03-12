package com.backend.projet.modelisation.service;

import com.backend.projet.common.util.service.MistralService;
import com.backend.projet.modelisation.dto.FluxResponse;
import com.backend.projet.modelisation.entity.Acteur;
import com.backend.projet.modelisation.entity.Flux;
import com.backend.projet.modelisation.entity.MFC;
import org.springframework.stereotype.Service;

@Service
public class MFCService {
    private final MistralService mistralService;

    public MFCService(MistralService mistralService) {
        this.mistralService = mistralService;
    }
    public FluxResponse importMFC(String plantUmlContent){
        FluxResponse res = mistralService.analyserMFC(plantUmlContent);
        MFC mfc = new MFC();
        if (res.flux != null){
            for(FluxResponse.FluxElement element : res.flux){
                Flux f = new Flux();
                f.setNom(element.nom);
                f.setDescription(element.description);
                // pbq : on n'a pas de moyen de savoir si un acteur est interne ou externe
                Acteur emetteur = new Acteur();
                emetteur.setNom(element.emetteur);
                Acteur recepteur = new Acteur();
                recepteur.setNom(element.recepteur);
                f.setActeurEntree(emetteur);
                f.setActeurSortie(recepteur);
                // il manque le type ? Mais est il vraiment utile ?
                f.setMfc(mfc);
            }
        }
        return res;
    }
}
