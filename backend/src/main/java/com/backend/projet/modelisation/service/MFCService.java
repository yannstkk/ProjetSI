package com.backend.projet.modelisation.service;


import com.backend.projet.mistral.enums.Prompt;
import com.backend.projet.mistral.service.MistralService;
import com.backend.projet.modelisation.dto.FluxResponse;
import com.backend.projet.modelisation.dto.request.MFCRequest;
import com.backend.projet.modelisation.dto.response.MFCResponse;
import com.backend.projet.modelisation.entity.Acteur;
import com.backend.projet.modelisation.entity.Flux;
import com.backend.projet.modelisation.entity.MFC;
import com.backend.projet.modelisation.repository.MFCRepository;
import com.backend.projet.projet.entity.Projet;
import com.backend.projet.projet.exception.ResourceNotFoundException;
import com.backend.projet.projet.repository.ProjetRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class MFCService {
    private final MistralService mistralService;
    private final ProjetRepository projetRepository;
    private final MFCRepository mfcRepository;

    public MFCService(MistralService mistralService,ProjetRepository projetRepository, MFCRepository mfcRepository ) {
        this.mistralService = mistralService;
        this.projetRepository = projetRepository;
        this.mfcRepository = mfcRepository;
    }

    public FluxResponse analyserPlantUML(String content) {
        return mistralService.executerAnalyse(content, Prompt.MFC.getPrompt(),FluxResponse.class );
    }


    public MFCResponse importerEtSauvegarder(MFCRequest request) {

        FluxResponse fluxAnalyse = analyserPlantUML(request.getPlantUmlContent());

        Projet projet = projetRepository.findById(request.getProjetId())
                .orElseThrow(() -> new ResourceNotFoundException("Projet non trouvé"));


        MFC mfc = new MFC();
        mfc.setNom(request.getNom());
        mfc.setProjet(projet);


        Map<String, Acteur> acteurs = new HashMap<>();
        if (fluxAnalyse.flux != null) {
            for (FluxResponse.FluxElement element : fluxAnalyse.flux) {
                Flux f = new Flux();
                f.setNom(element.nom);
                f.setDescription(element.description);
                f.setData(element.data);
                f.setActeurSortie(getOrCreateActeur(element.emetteur, acteurs));
                f.setActeurEntree(getOrCreateActeur(element.recepteur, acteurs));
                f.setMfc(mfc);
                mfc.getFlux().add(f);

                Acteur emetteur = getOrCreateActeur(element.emetteur, acteurs);
                Acteur recepteur = getOrCreateActeur(element.recepteur, acteurs);

                f.setActeurSortie(emetteur);
                f.setActeurEntree(recepteur);
                f.setMfc(mfc);
                mfc.getFlux().add(f);

                if (!mfc.getActeurs().contains(emetteur)) mfc.getActeurs().add(emetteur);
                if (!mfc.getActeurs().contains(recepteur)) mfc.getActeurs().add(recepteur);
            }
        }

        MFC mfcSauvegarde = mfcRepository.save(mfc);
        MFCResponse response = new MFCResponse(mfcSauvegarde.getId(), mfcSauvegarde.getNom(), projet.getIdProjet(), fluxAnalyse);
        return response;
    }


    private Acteur getOrCreateActeur(String nom, Map<String, Acteur> acteurs){
        return acteurs.computeIfAbsent(nom, n->{
            Acteur a = new Acteur();
            a.setNom(n);
            return a;
        });
    }
}
