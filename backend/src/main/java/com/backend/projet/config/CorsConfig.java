package com.backend.projet.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * Classe qui configure les droits d'accès pour permettre au frontend (React) de communiquer avec l'API.
 * Elle définit quelles adresses, quelles méthodes et quels types de messages sont autorisés.
 */
@Configuration
public class CorsConfig {

    /**
     * Définit les règles de partage des ressources (CORS) pour toute l'application.
     * Cette méthode autorise notamment les requêtes venant du port 3000 et l'envoi de jetons de connexion.
     * @return La configuration des accès autorisés.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        configuration.setAllowedOrigins(List.of(
            "http://localhost:3000"
        ));
        
        configuration.setAllowedMethods(List.of(
            "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));
        
        configuration.setAllowedHeaders(List.of("*"));
        
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
