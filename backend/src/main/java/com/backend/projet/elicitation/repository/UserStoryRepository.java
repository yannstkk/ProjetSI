package com.backend.projet.elicitation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.projet.elicitation.entity.UserStory;

/**
 * Repository interface for UserStory entity.
 * Provides methods to perform CRUD operations and custom queries.
 */
@Repository
public interface UserStoryRepository extends JpaRepository<UserStory, Long> {

    List<UserStory> findByProjetIdProjet(Long idProjet);
}