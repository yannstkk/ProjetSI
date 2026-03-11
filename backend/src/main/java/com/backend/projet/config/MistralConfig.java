package com.backend.projet.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class MistralConfig {
    @Bean
    public static RestTemplate restTemplate(){
        return new RestTemplate();
    }
}
