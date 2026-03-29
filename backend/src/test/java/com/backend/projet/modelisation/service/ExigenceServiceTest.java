package com.backend.projet.modelisation.service;

import com.backend.projet.elicitation.entity.UserStory;
import com.backend.projet.elicitation.repository.UserStoryRepository;
import com.backend.projet.modelisation.dto.request.ExigenceRequest;
import com.backend.projet.modelisation.entity.ExigenceFonctionnelle;
import com.backend.projet.modelisation.repository.ExigenceFonctionnelleRepository;
import com.backend.projet.projet.entity.Projet;
import com.backend.projet.projet.repository.ProjetRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Classe de tests unitaires pour {@link ExigenceService}.
 * <p>Ce test valide la logique de la Phase 5, pour la génération des exigences fonctionnelles : la transformation des DTOs en entités
 * persistées et la gestion de la traçabilité avec les User Stories.</p>
 *
 * @author Aymen TORCHE
 */
@ExtendWith(MockitoExtension.class)
public class ExigenceServiceTest {

    @Mock
    private ExigenceFonctionnelleRepository exigenceRepository;

    @Mock
    private ProjetRepository projetRepository;

    @Mock
    private UserStoryRepository userStoryRepository;

    @InjectMocks
    private ExigenceService exigenceService;

    private Projet projet;
    private List<UserStory> backlogSimule;


    /**
     * Initialisation du contexte de test.
     * On prépare un projet et un backlog de User Stories existantes en base.
     */
    @BeforeEach
    void setUp() {
        projet = new Projet();
        projet.setIdProjet(41L);
        projet.setNom("Projet Test");

        backlogSimule = new ArrayList<>();

        UserStory us1 = new UserStory();
        us1.setRef("US-01");
        ReflectionTestUtils.setField(us1, "idUs", 101L);

        UserStory us2 = new UserStory();
        us2.setRef("US-02");
        ReflectionTestUtils.setField(us2, "idUs", 102L);

        backlogSimule.add(us1);
        backlogSimule.add(us2);
    }


    /**
     * Test de la méthode {@link ExigenceService#sauvegarderExigences}.
     * <p><b>Scénario :</b> Sauvegarde de deux exigences, dont une liée à deux US.</p>
     * <p><b>Vérifications :</b>
     * <ul>
     * <li>Appel de la suppression des anciennes exigences (Nettoyage).</li>
     * <li>Filtrage correct des US par leur référence ('ref').</li>
     * <li>Appel de save() pour chaque nouvelle exigence.</li>
     * </ul></p>
     */
    @Test
    void testSauvegarderExigences_Succes() {
        ExigenceRequest req = new ExigenceRequest();
        req.setCode("EF-01");
        req.setLibelle("Gestion des comptes");
        req.setDescription("Le système doit permettre de gérer les comptes.");
        req.setUsLiees(List.of("US-01", "US-02")); // L'exigence couvre deux US

        List<ExigenceRequest> requests = List.of(req);

        when(projetRepository.findById(41L)).thenReturn(Optional.of(projet));
        when(userStoryRepository.findByProjetIdProjet(41L)).thenReturn(backlogSimule);

        exigenceService.sauvegarderExigences(41L, requests);


        verify(exigenceRepository, times(1)).deleteByProjetId(41L);

        verify(exigenceRepository).save(argThat(ef ->
                ef.getCode().equals("EF-01") &&
                        ef.getProjet().getIdProjet().equals(41L) &&
                        ef.getUserStories().size() == 2 &&
                        ef.getUserStories().get(0).getRef().equals("US-01")
        ));
    }


    /**
     * Test du cas d'erreur : Projet introuvable.
     * <p>Vérifie que le service lance une RuntimeException si l'ID projet n'existe pas.</p>
     */
    @Test
    void testSauvegarderExigences_ProjetInexistant() {
        when(projetRepository.findById(99L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            exigenceService.sauvegarderExigences(99L, new ArrayList<>());
        });

        assertEquals("Projet non trouvé", exception.getMessage());
        verify(exigenceRepository, never()).deleteByProjetId(anyLong());
        verify(exigenceRepository, never()).save(any());
    }

    /**
     * Test du filtrage des User Stories liées.
     * <p>Vérifie que si une US citée dans la requête n'existe pas dans le backlog du projet,
     * elle n'est pas ajoutée à l'exigence (protection contre les données incohérentes).</p>
     */
    @Test
    void testSauvegarderExigences_FiltrageUsInconnue() {
        ExigenceRequest req = new ExigenceRequest();
        req.setUsLiees(List.of("US-999")); // US qui n'existe pas dans backlogSimule

        when(projetRepository.findById(41L)).thenReturn(Optional.of(projet));
        when(userStoryRepository.findByProjetIdProjet(41L)).thenReturn(backlogSimule);

        exigenceService.sauvegarderExigences(41L, List.of(req));

        verify(exigenceRepository).save(argThat(ef -> ef.getUserStories().isEmpty()));
    }
}