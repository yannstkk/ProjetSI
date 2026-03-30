package com.backend.projet.elicitation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.projet.elicitation.entity.Notes;

/**
 * Repository interface for Notes entity.
 * Provides methods to perform CRUD operations and custom queries.
 */
@Repository
public interface NotesRepository extends JpaRepository<Notes, Long> {

	List<Notes> findByInterviewNumeroInterview(Long numeroInterview);
}
