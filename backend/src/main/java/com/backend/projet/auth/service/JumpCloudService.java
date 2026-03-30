package com.backend.projet.auth.service;

import com.backend.projet.auth.dao.JumpCloudDao;
import com.backend.projet.auth.dto.LoginResponse;
import com.backend.projet.auth.security.JwtUtil;
import org.springframework.stereotype.Service;
import java.util.concurrent.atomic.AtomicLong;
import com.backend.projet.auth.AuthentificationException;

/**
 * Service qui gère la logique de connexion des utilisateurs.
 * Il vérifie les identifiants via JumpCloud et crée un jeton de sécurité si la connexion réussit.
 */
@Service
public class JumpCloudService {

    private final AtomicLong counter = new AtomicLong();
    private final JumpCloudDao jumpCloudDao;
    private final JwtUtil jwtUtil;
    private static final String SUCCESS = "LOGIN_OK";
    private static final String FAILURE = "IDENTIFIERS_INVALIDS";

    /**
     * Constructeur qui reçoit l'outil de connexion JumpCloud et l'outil pour les jetons.
     *  @param jumpcloud permet de communiquer avec le serveur JumpCloud.
     * @param jwtUtil permet de fabriquer les jetons de connexion.
     */
    public JumpCloudService(JumpCloudDao jumpcloud, JwtUtil jwtUtil) {
        this.jumpCloudDao = jumpcloud;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Réalise la connexion d'un utilisateur.
     * Cette méthode vérifie le mot de passe, calcule le temps de réponse et génère un jeton.
     * @param username Le nom de l'utilisateur.
     * @param password Le mot de passe de l'utilisateur.
     * @return Une réponse contenant l'identifiant de la demande, la durée, et le jeton ou une erreur.
     */
    public LoginResponse login(String username, String password) {
        long startTime = System.currentTimeMillis();
        long requestId = counter.incrementAndGet();

        try {

            this.jumpCloudDao.checkLogin(username, password);
            String duration = (System.currentTimeMillis() - startTime) + " ms";
            String token = this.jwtUtil.generateToken(username);
            return new LoginResponse(requestId, false, duration, token);

        } catch (AuthentificationException e) {
            String duration = (System.currentTimeMillis() - startTime) + " ms";
            return new LoginResponse(requestId, true, duration, FAILURE);
        }
    }
}
