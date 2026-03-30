package com.backend.projet.besoin.controller;


import com.backend.projet.besoin.AuthTaigaException;
import com.backend.projet.besoin.TaigaDataException;
import com.backend.projet.besoin.dto.request.TaigaAuthRequest;
import com.backend.projet.besoin.dto.request.UserStoryRequest;
import com.backend.projet.besoin.dto.response.ProjectTaigaResponse;
import com.backend.projet.besoin.dto.response.TaigaAuthResponse;
import com.backend.projet.besoin.dto.response.UserStoryResponse;
import com.backend.projet.besoin.service.TaigaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur qui gère les échanges avec l'outil de gestion de projet Taiga.
 * Il permet de s'identifier, de lister les projets et d'exporter des User Stories.
 */
@RestController
@RequestMapping("/api/taiga")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TaigaController {

    private TaigaService taigaService;

    /**
     * Constructeur qui reçoit l'outil pour discuter avec Taiga.
     * @param taigaService Outil qui contient la logique métier pour Taiga.
     */
    public TaigaController(TaigaService taigaService){
        this.taigaService = taigaService;
    }

    /**
     * Connecte un utilisateur à son compte Taiga.
     * @param request Contient le nom d'utilisateur et le mot de passe Taiga.
     * @return La réponse avec le jeton d'accès Taiga ou une erreur 401.
     */
    @PostMapping("/login")
    public ResponseEntity<TaigaAuthResponse> auth(@RequestBody TaigaAuthRequest request) {
        try {
            TaigaAuthResponse response = this.taigaService.authentificationTaiga(request.getUsername(), request.getPassword());
            return ResponseEntity.ok(response);
        } catch (AuthTaigaException e) {
            return ResponseEntity.status(401).build();
        }
    }


    /**
     * Récupère la liste des projets Taiga d'un utilisateur.
     * @param userId Identifiant de l'utilisateur sur Taiga.
     * @param token Jeton d'autorisation pour accéder aux données.
     * @return La liste des projets ou une erreur si l'accès est refusé.
     */
    @GetMapping("/projects")
    public ResponseEntity<List<ProjectTaigaResponse>> getProjects(@RequestParam Long userId, @RequestHeader("Authorization") String token){
        try {
            List<ProjectTaigaResponse> allProjects = this.taigaService.getProjects(userId, token);
            return ResponseEntity.ok(allProjects);
        } catch (AuthTaigaException e) {
            return ResponseEntity.status(401).build();
        } catch (TaigaDataException e) {
            return ResponseEntity.status(502).build();
        }
    }

    /**
     * Envoie une User Story vers un projet spécifique sur Taiga.
     * @param userStory Les informations de la User Story à exporter.
     * @param token Jeton d'autorisation pour l'export.
     * @return La réponse de Taiga confirmant la création.
     */
    @PostMapping("/exporter-us")
    ResponseEntity<UserStoryResponse> exportUserStory(@RequestBody UserStoryRequest userStory, @RequestHeader("Authorization") String token){
        try {
            UserStoryResponse response = this.taigaService.exportUserStory(userStory.getProject(), userStory, token);
            return ResponseEntity.ok(response);
        } catch (AuthTaigaException e) {
            return ResponseEntity.status(401).build();
        }
    }

}
