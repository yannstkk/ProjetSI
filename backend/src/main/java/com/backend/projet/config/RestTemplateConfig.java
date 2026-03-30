package com.backend.projet.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * Classe de configuration pour l'outil d'appels HTTP.
 * Elle permet de créer l'outil nécessaire pour envoyer des requêtes vers d'autres serveurs.
 */
@Configuration
public class RestTemplateConfig {

    /**
     * Crée l'outil qui permet d'effectuer des appels HTTP vers des services externes.
     * @return L'outil d'envoi de requêtes.
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
