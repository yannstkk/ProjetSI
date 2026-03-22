package com.backend.projet.elicitation.entity.controller;

import com.backend.projet.elicitation.entity.dto.request.ParticipantRequest;
import com.backend.projet.elicitation.entity.dto.response.ParticipantResponse;
import com.backend.projet.elicitation.entity.service.ParticipantService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/participants")
public class ParticipantController {

    private final ParticipantService participantService;

    public ParticipantController(ParticipantService participantService) {
        this.participantService = participantService;
    }

    @GetMapping("/interview/{numeroInterview}")
    public ResponseEntity<List<ParticipantResponse>> getByInterview(
            @PathVariable Long numeroInterview) {
        return ResponseEntity.ok(participantService.getByInterview(numeroInterview));
    }

    @PostMapping("/interview/{numeroInterview}")
    public ResponseEntity<ParticipantResponse> ajouterParticipant(
            @PathVariable Long numeroInterview,
            @RequestBody ParticipantRequest request) {
        try {
            ParticipantResponse response =
                    participantService.ajouterParticipant(numeroInterview, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/interview/{numeroInterview}")
    public ResponseEntity<Void> deleteByInterview(
            @PathVariable Long numeroInterview) {
        participantService.deleteByInterview(numeroInterview);
        return ResponseEntity.noContent().build();
    }
}