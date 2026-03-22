package com.backend.projet.besoin.controller;


import com.backend.projet.besoin.AuthTaigaException;
import com.backend.projet.besoin.TaigaDataException;
import com.backend.projet.besoin.dto.request.TaigaAuthRequest;
import com.backend.projet.besoin.dto.request.UserStoryRequest;
import com.backend.projet.besoin.dto.response.ProjectTaigaResponse;
import com.backend.projet.besoin.dto.response.TaigaAuthResponse;
import com.backend.projet.besoin.dto.response.UserStoryResponse;
import com.backend.projet.besoin.service.TaigaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/taiga")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TaigaController {

    private TaigaService taigaService;

    public TaigaController(TaigaService taigaService){
        this.taigaService = taigaService;
    }

    @PostMapping("/login")
    public ResponseEntity<TaigaAuthResponse> auth(@RequestBody TaigaAuthRequest request) {
        try {
            TaigaAuthResponse response = this.taigaService.authentificationTaiga(request.getUsername(), request.getPassword());
            return ResponseEntity.ok(response);
        } catch (AuthTaigaException e) {
            return ResponseEntity.status(401).build();
        }
    }



    @GetMapping("/projects")
    public ResponseEntity<List<ProjectTaigaResponse>> getProjects(@RequestParam Long userId, @RequestHeader("Authorization") String token){
        try {
            List<ProjectTaigaResponse> allProjects = this.taigaService.getProjects(userId, token);
            return ResponseEntity.ok(allProjects);
        } catch (AuthTaigaException e) {
            return ResponseEntity.status(401).build();
        } catch (TaigaDataException e) {
            return ResponseEntity.status(502).build();
        }
    }

    @PostMapping("/exporter-us")
    ResponseEntity<UserStoryResponse> exportUserStory(@RequestBody UserStoryRequest userStory, @RequestHeader("Authorization") String token){
        try {
            UserStoryResponse response = this.taigaService.exportUserStory(userStory.getProject(), userStory, token);
            return ResponseEntity.ok(response);
        } catch (AuthTaigaException e) {
            return ResponseEntity.status(401).build();
        }
    }

}
