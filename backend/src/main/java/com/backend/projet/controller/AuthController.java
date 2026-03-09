package com.backend.projet.controller;

import com.backend.projet.exception.InvalidLoginException;
import com.backend.projet.service.api.JumpCloudService;
import com.backend.projet.dto.response.ApiResponse;
import com.backend.projet.dto.request.LoginRequest;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController {

    private final JumpCloudService jumpCloudService;

    public AuthController(JumpCloudService jumpCloudService){
        this.jumpCloudService = jumpCloudService;
    }

    @PostMapping("/api/interne/auth/login")
    public ApiResponse login(@RequestBody LoginRequest data) {
        return this.jumpCloudService.login(data.getUsername(), data.getPassword());
    }
}

