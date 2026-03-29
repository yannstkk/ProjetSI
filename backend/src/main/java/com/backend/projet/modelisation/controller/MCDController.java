package com.backend.projet.modelisation.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.backend.projet.modelisation.dto.request.MCDRequest;
import com.backend.projet.modelisation.dto.response.MCDResponse;
import com.backend.projet.modelisation.service.MCDService;

@RestController
@RequestMapping("/api/mcd")
public class MCDController {

    private final MCDService mcdService;

    public MCDController(MCDService mcdService) {
        this.mcdService = mcdService;
    }

    @GetMapping("/projet/{idProjet}")
    public ResponseEntity<List<MCDResponse>> getByProjet(@PathVariable Long idProjet) {
        return ResponseEntity.ok(mcdService.getByProjet(idProjet));
    }

    @PostMapping
    public ResponseEntity<MCDResponse> create(@RequestBody MCDRequest request) {
        try {
            MCDResponse response = mcdService.create(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
