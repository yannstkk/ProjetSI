package com.backend.projet.auth.service;

import com.backend.projet.auth.dao.JumpCloudDao;
import com.backend.projet.auth.dto.LoginResponse;
import com.backend.projet.auth.security.JwtUtil;
import org.springframework.stereotype.Service;
import java.util.concurrent.atomic.AtomicLong;
import com.backend.projet.auth.AuthentificationException;

@Service
public class JumpCloudService {

    private final AtomicLong counter = new AtomicLong();
    private final JumpCloudDao jumpCloudDao;
    private final JwtUtil jwtUtil;
    private static final String SUCCESS = "LOGIN_OK";
    private static final String FAILURE = "IDENTIFIERS_INVALIDS";

    public JumpCloudService(JumpCloudDao jumpcloud, JwtUtil jwtUtil) {
        this.jumpCloudDao = jumpcloud;
        this.jwtUtil = jwtUtil;
    }
  
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
