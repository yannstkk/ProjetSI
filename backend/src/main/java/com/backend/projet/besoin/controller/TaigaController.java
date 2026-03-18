package com.backend.projet.besoin.controller;


import com.backend.projet.besoin.dto.request.UserStoryRequest;
import com.backend.projet.besoin.dto.response.CreateProjectTaigaResponse;
import com.backend.projet.besoin.dto.response.UserStoryResponse;
import com.backend.projet.besoin.service.TaigaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TaigaController {

    private TaigaService taigaService;

    public TaigaController(TaigaService taigaService){
        this.taigaService = taigaService;
    }

    @PostMapping("")
    public ResponseEntity<CreateProjectTaigaResponse> createProject(){
        CreateProjectTaigaResponse project = this.taigaService.createProjectTaiga();
        return ResponseEntity.ok(project);

    }

    @PostMapping("")
    ResponseEntity<UserStoryResponse> exportUserStory(@RequestBody UserStoryRequest request){
        UserStoryResponse response = this.taigaService.exportUserStory(request.getSubject(), request.getProject());
        return ResponseEntity.ok(response);
    }


}
