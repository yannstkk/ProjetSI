package com.backend.projet.elicitation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.projet.elicitation.entity.Interview;

/**
 * Repository interface for Interview entity.
 * Provides methods to perform CRUD operations and custom queries.
 */
@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {

	List<Interview> findByProjetIdProjet(Long idProjet);
}