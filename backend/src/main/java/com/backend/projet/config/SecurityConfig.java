package com.backend.projet.config;


import com.backend.projet.auth.security.JwtFilter;
import com.backend.projet.auth.security.JwtUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.HttpSecurityDsl;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Classe qui définit les règles de sécurité de l'application.
 * Elle décide quelles pages sont publiques, lesquelles sont protégées et comment vérifier l'identité des utilisateurs.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {


    private final JwtUtil jwtutil;

    /**
     * Constructeur qui reçoit l'outil de gestion des jetons.
     * @param jwtutil Outil pour valider les jetons lors des accès sécurisés.
     */
    public SecurityConfig(JwtUtil jwtutil) {
        this.jwtutil = jwtutil;
    }

    /**
     * Configure la chaîne de sécurité (le filtre principal) de l'application.
     * Cette méthode désactive la protection CSRF, autorise l'accès libre à la connexion et à Taiga, et ajoute le filtre pour les jetons.
     * @param http Outil de configuration de la sécurité HTTP.
     * @return La chaîne de sécurité configurée.
     * @throws Exception En cas d'erreur de configuration.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth ->
                        auth.requestMatchers("/api/auth/login").permitAll()
                                .requestMatchers("/api/taiga/**").permitAll()
                                    .anyRequest().authenticated())
                .addFilterBefore(new JwtFilter(this.jwtutil), UsernamePasswordAuthenticationFilter.class)
                .build();
    }

}

