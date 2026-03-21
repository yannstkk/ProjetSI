package com.backend.projet.elicitation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.projet.elicitation.entity.Notes;
import com.backend.projet.elicitation.entity.identifiant.NotesId;

@Repository
public interface NotesRepository extends JpaRepository<Notes, NotesId> {

    // Nouveau
    List<Notes> findByIdProjet(Long idProjet);
}