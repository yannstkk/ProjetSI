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
import com.backend.projet.modelisation.repository.ActeurRepository;
import com.backend.projet.modelisation.repository.MFCRepository;
import com.backend.projet.projet.entity.Projet;
import com.backend.projet.projet.exception.ResourceNotFoundException;
import com.backend.projet.projet.repository.ProjetRepository;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service gérant les opérations liées aux MFCs des projets.
 */
@Service
public class MFCService {

    private final MistralService   mistralService;
    private final ProjetRepository projetRepository;
    private final MFCRepository    mfcRepository;
    private final ActeurRepository acteurRepository; // ← ajouté

    public MFCService(MistralService mistralService,
                      ProjetRepository projetRepository,
                      MFCRepository mfcRepository,
                      ActeurRepository acteurRepository) {
        this.mistralService   = mistralService;
        this.projetRepository = projetRepository;
        this.mfcRepository    = mfcRepository;
        this.acteurRepository = acteurRepository;
    }

    /**
     * Analyse un contenu PlantUML.
     * @param content
     * @return
     */
    public FluxResponse analyserPlantUML(String content) {
        return mistralService.executerAnalyse(content, Prompt.MFC.getPrompt(), FluxResponse.class);
    }

    /**
     * Importe et sauvegarde un MFC à partir d'un contenu PlantUML.
     * @param request
     * @return
     */
    @Transactional
    public MFCResponse importerEtSauvegarder(@NonNull MFCRequest request) {
        FluxResponse fluxAnalyse = analyserPlantUML(request.getPlantUmlContent());

        Projet projet = projetRepository.findById(request.getProjetId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Projet non trouvé avec l'ID : " + request.getProjetId()));

        MFC mfc = new MFC();
        mfc.setNom(request.getNom());
        mfc.setProjet(projet);
        mfc.setContenuPlantuml(request.getPlantUmlContent());


        // Cache nom → Acteur persisté (avec id_acteur garanti)
        Map<String, Acteur> acteursCache = new HashMap<>();

        if (fluxAnalyse.flux != null) {
            for (FluxResponse.FluxElement element : fluxAnalyse.flux) {
                Flux f = new Flux();
                f.setNom(element.nom);
                f.setDescription(element.description);
                f.setData(element.data);

                // ← acteurs sauvegardés en base AVANT l'INSERT dans PRESENCE_MFC
                Acteur emetteur  = getOrCreateActeurPersiste(element.emetteur,  acteursCache, projet);
                Acteur recepteur = getOrCreateActeurPersiste(element.recepteur, acteursCache, projet);

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
     * Récupère tous les MFCs d'un projet.
     * @param idProjet
     * @return
     */
    public List<MFCDetailResponse> getMFCByProjet(Long idProjet) {
        List<MFC> mfcList = mfcRepository.findByProjetIdProjet(idProjet);
        return mfcList.stream()
                .map(this::toDetailResponse)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Cherche l'acteur dans le cache local, puis en base (nom + projet).
     * S'il n'existe pas → crée ET persiste via acteurRepository.save()
     * → l'acteur a un id_acteur avant l'INSERT dans PRESENCE_MFC.
     */
    private Acteur getOrCreateActeurPersiste(String nom,
                                             Map<String, Acteur> cache,
                                             Projet projet) {
        String key = (nom == null || nom.isBlank()) ? "Inconnu" : nom.trim();

        // 1. Cache local
        if (cache.containsKey(key)) {
            return cache.get(key);
        }

        // 2. Déjà en base pour ce projet
        Optional<Acteur> existant = acteurRepository
                .findByProjetIdProjet(projet.getIdProjet())
                .stream()
                .filter(a -> key.equalsIgnoreCase(a.getNom()))
                .findFirst();

        if (existant.isPresent()) {
            cache.put(key, existant.get());
            return existant.get();
        }

        // 3. Créer + sauvegarder → id_acteur généré par Oracle avant l'association
        Acteur nouvel = new Acteur();
        nouvel.setNom(key);
        nouvel.setProjet(projet);
        nouvel.setType("internal");
        nouvel.setSource("mfc");
        Acteur persiste = acteurRepository.save(nouvel);

        cache.put(key, persiste);
        return persiste;
    }

    /**
     * Transforme un MFC en MFCDetailResponse.
     * @param mfc
     * @return
     */
    private MFCDetailResponse toDetailResponse(MFC mfc) {
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

        List<ActeurResponse> acteurDtos = mfc.getActeurs().stream()
                .map(a -> new ActeurResponse(
                        a.getIdActeur(),
                        a.getProjet() != null ? a.getProjet().getIdProjet() : null,
                        a.getNom(),
                        a.getType(),
                        a.getSource(),
                        a.getRole()
                ))
                .collect(Collectors.toList());

        Long idProjet = mfc.getProjet() != null ? mfc.getProjet().getIdProjet() : null;

        return new MFCDetailResponse(
                mfc.getId(),
                mfc.getNom(),
                idProjet,
                mfc.getContenuPlantuml(),
                fluxDtos,
                acteurDtos
        );
    }
}