package com.backend.projet.auth.security;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

/**
 * Filtre qui intercepte chaque requête pour vérifier si l'utilisateur est connecté.
 * Il cherche un jeton (Token) dans l'en-tête de la requête pour identifier l'utilisateur.
 */
@Component
public class JwtFilter extends OncePerRequestFilter {


    private JwtUtil jwtUtil;

    /**
     * Constructeur utilisant l'outil de gestion des jetons.
     * @param jwtUtil Utilitaire pour valider et lire les informations du jeton.
     */
    public JwtFilter(JwtUtil jwtUtil){
        this.jwtUtil = jwtUtil;
    }

    /**
     * Méthode interne qui analyse la requête pour trouver le jeton de sécurité.
     * Si le jeton est bon, elle connecte l'utilisateur au système pour cette requête.
     * @param request La requête reçue du client.
     * @param response La réponse à renvoyer au client.
     * @param filterChain La suite de la chaîne des filtres de sécurité.
     * @throws ServletException En cas d'erreur liée au traitement de la requête.
     * @throws IOException En cas d'erreur de lecture ou d'écriture.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")){
            String token = header.substring(7);
            if (this.jwtUtil.isTokenValid(token)){
                String username = this.jwtUtil.extractUsername(token);
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(username, null, new ArrayList<>());
                SecurityContextHolder.getContext().setAuthentication(auth);

            }
        }
        filterChain.doFilter(request, response);
    }

}
