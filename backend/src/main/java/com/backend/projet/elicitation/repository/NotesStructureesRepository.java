package com.backend.projet.elicitation.repository;

import com.backend.projet.elicitation.entity.NotesStructurees;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotesStructureesRepository extends JpaRepository<NotesStructurees, Long> {

    List<NotesStructurees> findByInterviewNumeroInterview(Long numeroInterview);
}