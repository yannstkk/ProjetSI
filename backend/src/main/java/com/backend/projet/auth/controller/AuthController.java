package com.backend.projet.auth.controller;

import com.backend.projet.auth.service.JumpCloudService;
import com.backend.projet.common.util.ApiResponse;
import com.backend.projet.auth.dto.LoginRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    private final JumpCloudService jumpCloudService;

    public AuthController(JumpCloudService jumpCloudService) {
        this.jumpCloudService = jumpCloudService;
    }

    @PostMapping("/api/auth/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest data) {
        ApiResponse response = this.jumpCloudService.login(data.getUsername(), data.getPassword());

        if (response.getIsError()) {
            return ResponseEntity.status(401).body(response);
        }
        return ResponseEntity.ok(response);
    }
}