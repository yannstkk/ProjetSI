package com.backend.projet.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Classe de configuration pour l'outil de gestion du format JSON.
 * Elle permet de définir comment l'application transforme le texte JSON en objets Java et inversement.
 */
@Configuration
public class JacksonConfig {

    /**
     * Crée l'outil principal pour la lecture et l'écriture des données au format JSON.
     * @return L'outil de transformation des données.
     */
    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}