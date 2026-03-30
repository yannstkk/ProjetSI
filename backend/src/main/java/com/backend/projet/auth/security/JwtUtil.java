package com.backend.projet.auth.security;

import com.backend.projet.config.JwtConfig;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 * Classe utilitaire pour gérer les jetons de connexion (JWT).
 * Elle permet de créer des jetons, de les lire et de vérifier s'ils sont valides.
 */
@Component
public class JwtUtil {

    private JwtConfig jwtConfig;

    /**
     * Constructeur recevant la configuration des jetons.
     *
     * @param jwtConfig contient la clé secrète et la durée de validité.
     */
    public JwtUtil(JwtConfig jwtConfig) {
        this.jwtConfig = jwtConfig;
    }

    /**
     * Crée un nouveau jeton de connexion pour un utilisateur.
     * @param username Le nom de l'utilisateur pour qui on crée le jeton.
     * @return Le jeton sous forme de texte.
     */
    public String generateToken(String username){
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + this.jwtConfig.getExpirationTime()))
                .signWith(SignatureAlgorithm.HS512, this.jwtConfig.getSecret())
                .compact();
    }

    /**
     * Récupère le nom de l'utilisateur enregistré dans le jeton.
     * @param token Le jeton à analyser.
     * @return Le nom de l'utilisateur trouvé dans le jeton.
     */
    public String extractUsername(String token){
        return Jwts.parserBuilder()
                .setSigningKey(this.jwtConfig.getSecret())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    /**
     * Vérifie si un jeton est valide et n'a pas été modifié.
     * @param token Le jeton à vérifier.
     * @return True si le jeton est bon, False s'il est invalide ou expiré.
     */
    public Boolean isTokenValid(String token){
        try {
            Jwts.parserBuilder().setSigningKey(this.jwtConfig.getSecret()).build().parseClaimsJws(token);
            return true;
        } catch (Exception e){
            return false;
        }
    }



}
