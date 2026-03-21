package com.backend.projet.elicitation.repository;

import com.backend.projet.elicitation.entity.Interview;
import com.backend.projet.elicitation.entity.identifiant.InterviewId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, InterviewId> {

    Optional<Interview> findByIdProjet(Long idProjet);
}