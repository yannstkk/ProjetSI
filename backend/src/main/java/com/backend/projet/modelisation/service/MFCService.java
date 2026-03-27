package com.backend.projet.modelisation.service;


import com.backend.projet.mistral.enums.Prompt;
import com.backend.projet.mistral.service.MistralService;
import com.backend.projet.modelisation.dto.response.FluxResponse;
import com.backend.projet.modelisation.dto.request.MFCRequest;
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

import java.util.HashMap;
import java.util.Map;

/**
 * Service gérant la modélisation des Modèles de Flux Conceptuels (MFC).
 * Ce service permet d'analyser du contenu PlantUML via une IA (Mistral)
 * et de persister les résultats (MFC, Flux, Acteurs) en base de données.
 */
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

    /**
     * Envoie le contenu PlantUML au service d'IA pour extraction des flux.
     *
     * @param content Chaîne de caractères représentant le diagramme PlantUML.
     * @return Un objet {@link FluxResponse} contenant la liste des flux détectés.
     */
    public FluxResponse analyserPlantUML(String content) {
        return mistralService.executerAnalyse(content, Prompt.MFC.getPrompt(),FluxResponse.class );
    }


    /**
     * Analyse un contenu PlantUML, crée les entités correspondantes et les sauvegarde en base de données.
     * <p>
     * Cette méthode effectue les étapes suivantes :
     * 1. Analyse du contenu via l'IA.
     * 2. Vérification de l'existence du projet rattaché.
     * 3. Création du MFC et mapping des flux et acteurs.
     * 4. Persistance en cascade.
     * </p>
     *
     * @param request Objet contenant le contenu PlantUML, l'ID du projet et le nom du MFC.
     * @return {@link MFCResponse} représentant l'état sauvegardé et l'analyse effectuée.
     * @throws ResourceNotFoundException si l'ID du projet fourni n'existe pas.
     */
    public MFCResponse importerEtSauvegarder(@NonNull MFCRequest request) {
        FluxResponse fluxAnalyse = analyserPlantUML(request.getPlantUmlContent());

        Projet projet = projetRepository.findById(request.getProjetId())
                .orElseThrow(() -> new ResourceNotFoundException("Projet non trouvé avec l'ID : " + request.getProjetId()));

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

                Acteur emetteur = getOrCreateActeur(element.emetteur, acteursCache);
                Acteur recepteur = getOrCreateActeur(element.recepteur, acteursCache);

                f.setActeurSortie(emetteur);
                f.setActeurEntree(recepteur);

                f.setMfc(mfc);
                mfc.getFlux().add(f);

                if (!mfc.getActeurs().contains(emetteur)) mfc.getActeurs().add(emetteur);
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
     * Récupère un acteur existant dans la map locale ou en crée un nouveau si absent.
     *
     * @param nom Nom de l'acteur à rechercher/créer.
     * @param acteurs Map servant de cache temporaire durant le processus d'import.
     * @return L'instance de l'{@link Acteur} correspondante.
     */
    private Acteur getOrCreateActeur(String nom, Map<String, Acteur> acteurs){
        return acteurs.computeIfAbsent(nom, n->{
            Acteur a = new Acteur();
            a.setNom(n);
            return a;
        });
    }
}