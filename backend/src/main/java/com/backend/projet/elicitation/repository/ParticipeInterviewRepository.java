package com.backend.projet.elicitation.repository;

import com.backend.projet.elicitation.entity.ParticipeInterview;
import com.backend.projet.elicitation.identifiant.ParticipeInterviewId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for ParticipeInterview entity.
 * Provides methods to perform CRUD operations and custom queries.
 */
@Repository
public interface ParticipeInterviewRepository
        extends JpaRepository<ParticipeInterview, ParticipeInterviewId> {

    List<ParticipeInterview> findByInterviewNumeroInterview(Long numeroInterview);
}