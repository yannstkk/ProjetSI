package com.backend.projet.modelisation.service;

import com.backend.projet.mistral.enums.Prompt;
import com.backend.projet.mistral.service.MistralService;
import com.backend.projet.modelisation.dto.response.ActeurResponse;
import com.backend.projet.modelisation.dto.response.FluxDto;
import com.backend.projet.modelisation.dto.response.FluxResponse;
import com.backend.projet.modelisation.dto.request.MFCRequest;
import com.backend.projet.modelisation.dto.response.MFCDetailResponse;
import com.backend.projet.modelisation.dto.response.MFCResponse;
import com.backend.projet.modelisation.entity.Acteur;
import com.backend.projet.modelisation.entity.Flux;
import com.backend.projet.modelisation.entity.MFC;
import com.backend.projet.modelisation.repository.MFCRepository;
import com.backend.projet.projet.entity.Projet;
import com.backend.projet.projet.exception.ResourceNotFoundException;
import com.backend.projet.projet.repository.ProjetRepository;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MFCService {

    private final MistralService   mistralService;
    private final ProjetRepository projetRepository;
    private final MFCRepository    mfcRepository;

    public MFCService(MistralService mistralService,
                      ProjetRepository projetRepository,
                      MFCRepository mfcRepository) {
        this.mistralService   = mistralService;
        this.projetRepository = projetRepository;
        this.mfcRepository    = mfcRepository;
    }



    public FluxResponse analyserPlantUML(String content) {
        return mistralService.executerAnalyse(content, Prompt.MFC.getPrompt(), FluxResponse.class);
    }


    public MFCResponse importerEtSauvegarder(@NonNull MFCRequest request) {
        FluxResponse fluxAnalyse = analyserPlantUML(request.getPlantUmlContent());

        Projet projet = projetRepository.findById(request.getProjetId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Projet non trouvé avec l'ID : " + request.getProjetId()));

        MFC mfc = new MFC();
        mfc.setNom(request.getNom());
        mfc.setProjet(projet);

        Map<String, Acteur> acteursCache = new HashMap<>();

        if (fluxAnalyse.flux != null) {
            for (FluxResponse.FluxElement element : fluxAnalyse.flux) {
                Flux f = new Flux();
                f.setNom(element.nom);
                f.setDescription(element.description);
                f.setData(element.data);

                Acteur emetteur  = getOrCreateActeur(element.emetteur,  acteursCache, projet);
                Acteur recepteur = getOrCreateActeur(element.recepteur, acteursCache, projet);

                f.setActeurSortie(emetteur);
                f.setActeurEntree(recepteur);
                f.setMfc(mfc);
                mfc.getFlux().add(f);

                if (!mfc.getActeurs().contains(emetteur))  mfc.getActeurs().add(emetteur);
                if (!mfc.getActeurs().contains(recepteur)) mfc.getActeurs().add(recepteur);
            }
        }

        MFC mfcSauvegarde = mfcRepository.save(mfc);

        return new MFCResponse(
                mfcSauvegarde.getId(),
                mfcSauvegarde.getNom(),
                projet.getIdProjet(),
                fluxAnalyse
        );
    }


    /**
     * Charge tous les MFC d'un projet avec leurs flux et acteurs persistés.
     * Retourne la liste au format MFCDetailResponse.
     */
    public List<MFCDetailResponse> getMFCByProjet(Long idProjet) {
        List<MFC> mfcList = mfcRepository.findByProjetIdProjet(idProjet);

        return mfcList.stream()
                .map(this::toDetailResponse)
                .collect(Collectors.toList());
    }



    /**
     * Convertit un MFC persisté en MFCDetailResponse avec ses flux et acteurs.
     */
    private MFCDetailResponse toDetailResponse(MFC mfc) {
        // Flux
        List<FluxDto> fluxDtos = mfc.getFlux().stream()
                .map(f -> new FluxDto(
                        f.getIdFlux(),
                        f.getNom(),
                        f.getDescription(),
                        f.getData(),
                        f.getActeurSortie() != null ? f.getActeurSortie().getNom() : "",
                        f.getActeurEntree() != null ? f.getActeurEntree().getNom() : ""
                ))
                .collect(Collectors.toList());

        // Acteurs
        List<ActeurResponse> acteurDtos = mfc.getActeurs().stream()
                .map(a -> new ActeurResponse(
                        a.getIdActeur(),
                        mfc.getActeurs().isEmpty() ? null
                                : (a.getProjet() != null ? a.getProjet().getIdProjet() : null),
                        a.getNom(),
                        a.getType(),
                        a.getSource(),
                        a.getRole()
                ))
                .collect(Collectors.toList());

        return new MFCDetailResponse(
                mfc.getId(),
                mfc.getNom(),
                mfc.getActeurs().isEmpty() ? null
                        : (mfc.getActeurs().get(0).getProjet() != null
                        ? mfc.getActeurs().get(0).getProjet().getIdProjet()
                        : null),
                fluxDtos,
                acteurDtos
        );
    }

    /**
     * Récupère un acteur existant dans le cache ou en crée un nouveau.
     * Le projet est maintenant correctement assigné à l'acteur.
     */
    private Acteur getOrCreateActeur(String nom, Map<String, Acteur> acteurs, Projet projet) {
        return acteurs.computeIfAbsent(nom, n -> {
            Acteur a = new Acteur();
            a.setNom(n);
            a.setProjet(projet);     // ← fix : le projet est maintenant assigné
            a.setType("internal");   // type par défaut
            a.setSource("mfc");      // source = diagramme MFC
            return a;
        });
    }
}