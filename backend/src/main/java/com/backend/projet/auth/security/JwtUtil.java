package com.backend.projet.auth.security;

import com.backend.projet.config.JwtConfig;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    private JwtConfig jwtConfig;


    public String generateToken(String username){
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + this.jwtConfig.getExpirationTime()))
                .signWith(SignatureAlgorithm.HS512, this.jwtConfig.getSecret())
                .compact();
    }

    public String extractUsername(String token){
        return Jwts.parserBuilder()
                .setSigningKey(this.jwtConfig.getSecret())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public Boolean isTokenValid(String token){
        try {
            Jwts.parserBuilder().setSigningKey(this.jwtConfig.getSecret()).build().parseClaimsJws(token);
            return true;
        } catch (Exception e){
            return false;
        }
    }



}
