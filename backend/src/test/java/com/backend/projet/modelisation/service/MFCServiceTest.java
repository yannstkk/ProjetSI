package com.backend.projet.modelisation.service;

import com.backend.projet.mistral.service.MistralService;
import com.backend.projet.modelisation.dto.request.MFCRequest;
import com.backend.projet.modelisation.dto.response.FluxResponse;
import com.backend.projet.modelisation.dto.response.MFCResponse;
import com.backend.projet.modelisation.entity.Acteur;
import com.backend.projet.modelisation.entity.MFC;
import com.backend.projet.modelisation.repository.ActeurRepository;
import com.backend.projet.modelisation.repository.MFCRepository;
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
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Classe de tests unitaires pour le service {@link MFCService}.
 *
 * Cette classe utilise le Design Pattern Mock vu au s5 en COO via Mockito pour isoler
 * le comportement du service de ses dépendances externes (Repositories et MistralService).
 *
 * @author Aymen TORCHE
 */
@ExtendWith(MockitoExtension.class)
public class MFCServiceTest {

    @Mock
    private MistralService mistralService;
    @Mock
    private ProjetRepository projetRepository;
    @Mock
    private MFCRepository mfcRepository;
    @Mock
    private ActeurRepository acteurRepository;

    /**
     * Instance du service testé avec injection automatique des mocks.
     */
    @InjectMocks
    private MFCService mfcService;

    private Projet projet;
    private MFCRequest request;

    /**
     * Initialisation des données de test avant chaque méthode.
     * Configure un contexte projet et une requête DTO simulée.
     */
    @BeforeEach
    void setUp() {
        projet = new Projet();
        projet.setIdProjet(41L);
        projet.setNom("Système Bancaire");

        request = new MFCRequest();
        ReflectionTestUtils.setField(request, "projetId", 41L);
        ReflectionTestUtils.setField(request, "nom", "MFC Principal");
        ReflectionTestUtils.setField(request, "plantUmlContent", "@startuml\nClient -> Serveur : Login\n@enduml");
    }

    @Test
    void testImporterEtSauvegarder_SuccesFullFlow() {
        FluxResponse fluxAnalyse = new FluxResponse();
        FluxResponse.FluxElement element = new FluxResponse.FluxElement();
        element.nom = "Demande d'authentification";
        element.emetteur = "Client";
        element.recepteur = "Serveur";
        element.data = "login, mdp";
        fluxAnalyse.flux = List.of(element);

        when(mistralService.executerAnalyse(anyString(), anyString(), eq(FluxResponse.class)))
                .thenReturn(fluxAnalyse);


        when(projetRepository.findById(41L)).thenReturn(Optional.of(projet));


        when(acteurRepository.findByProjetIdProjet(41L)).thenReturn(new ArrayList<>());


        when(acteurRepository.save(any(Acteur.class))).thenAnswer(invocation -> {
            Acteur a = invocation.getArgument(0);
            if (a.getNom().equals("Client")) ReflectionTestUtils.setField(a, "idActeur", 101L);
            if (a.getNom().equals("Serveur")) ReflectionTestUtils.setField(a, "idActeur", 102L);
            return a;
        });


        when(mfcRepository.save(any(MFC.class))).thenAnswer(invocation -> {
            MFC m = invocation.getArgument(0);
            ReflectionTestUtils.setField(m, "idMfc", 500L);
            return m;
        });


        MFCResponse result = mfcService.importerEtSauvegarder(request);


        assertNotNull(result);
        assertEquals(500L, result.getIdMfc());
        assertEquals("MFC Principal", result.getNom());
        assertEquals(41L, result.getProjetId());


        verify(acteurRepository, times(2)).save(any(Acteur.class));


        verify(mfcRepository).save(argThat(mfc ->
                mfc.getNom().equals("MFC Principal") &&
                        mfc.getFlux().size() == 1 &&
                        mfc.getActeurs().size() == 2
        ));
    }

    /**
     * Teste l'import et la sauvegarde d'un MFC
     * * <p><b>Objectifs :</b>
     * <ul>
     * <li>Vérifier la transformation du contenu PlantUML via l'IA Mistral.</li>
     * <li>Valider la création automatique des acteurs s'ils sont absents.</li>
     * <li>Vérifier la persistance finale de l'entité MFC dans Oracle.</li>
     * </ul></p>
     *
     */
    @Test
    void testGetOrCreateActeur_UtiliseLeCache() {
        FluxResponse fluxAnalyse = new FluxResponse();
        FluxResponse.FluxElement e1 = new FluxResponse.FluxElement();
        e1.emetteur = "Admin"; e1.recepteur = "Système";

        FluxResponse.FluxElement e2 = new FluxResponse.FluxElement();
        e2.emetteur = "Admin"; e2.recepteur = "Système"; // Même acteurs

        fluxAnalyse.flux = List.of(e1, e2);

        when(mistralService.executerAnalyse(anyString(), anyString(), eq(FluxResponse.class))).thenReturn(fluxAnalyse);
        when(projetRepository.findById(anyLong())).thenReturn(Optional.of(projet));
        when(acteurRepository.findByProjetIdProjet(anyLong())).thenReturn(new ArrayList<>());
        when(acteurRepository.save(any(Acteur.class))).thenAnswer(i -> i.getArgument(0));
        when(mfcRepository.save(any(MFC.class))).thenAnswer(i -> i.getArgument(0));

        mfcService.importerEtSauvegarder(request);

        verify(acteurRepository, times(2)).save(any(Acteur.class)); // 1 pour Admin, 1 pour Système
    }

    /**
     * Teste la robustesse de la gestion des acteurs via le cache interne du service.
     *
     * Le service doit réutiliser les instances d'acteurs déjà créées pour un même nom
     * au cours d'une même analyse, afin d'éviter des doublons en base de données.</p>
     */
    @Test
    void testGetMFCByProjet() {
        MFC mfc = new MFC();
        ReflectionTestUtils.setField(mfc, "idMfc", 1L);
        mfc.setNom("Test MFC");
        mfc.setProjet(projet);

        when(mfcRepository.findByProjetIdProjet(41L)).thenReturn(List.of(mfc));

        var results = mfcService.getMFCByProjet(41L);

        assertFalse(results.isEmpty());
        assertEquals("Test MFC", results.get(0).getNom());
        assertEquals(41L, results.get(0).getIdProjet());
    }
}