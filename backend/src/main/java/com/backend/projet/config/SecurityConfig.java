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


@Configuration
@EnableWebSecurity
public class SecurityConfig {


    private final JwtUtil jwtutil;

    public SecurityConfig(JwtUtil jwtutil) {
        this.jwtutil = jwtutil;
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth ->
                        auth.requestMatchers("/api/auth/login").permitAll()
                                .requestMatchers("/api/modelisation/**").permitAll()
                             .anyRequest().permitAll())
                .addFilterBefore(new JwtFilter(this.jwtutil), UsernamePasswordAuthenticationFilter.class)
                .build();
    }

}

