package com.backend.projet.auth.controller;

import com.backend.projet.auth.service.JumpCloudService;
import com.backend.projet.auth.dto.LoginResponse;
import com.backend.projet.auth.dto.LoginRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Contrôleur REST qui s'occupe des requêtes pour l'authentification.
 * C'est le point d'entrée pour se connecter avec JumpCloud.
 */
@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    private final JumpCloudService jumpCloudService;

    /**
     * Constructeur recevant le service JumpCloud.
     * @param jumpCloudService Service qui s'occupe de la logique de connexion.
     */
    public AuthController(JumpCloudService jumpCloudService) {
        this.jumpCloudService = jumpCloudService;
    }

    /**
     * Vérifie l'utilisateur et donne un jeton de connexion, renvoie une erreur 401 si les identifiants sont faux.
     * @param data Contient le nom d'utilisateur et le mot de passe.
     * @return La réponse avec le jeton ou une erreur.
     */
    @PostMapping("/api/auth/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest data) {
        LoginResponse response = this.jumpCloudService.login(data.getUsername(), data.getPassword());

        if (response.getIsError()) {
            return ResponseEntity.status(401).body(response);
        }
        return ResponseEntity.ok(response);
    }
}