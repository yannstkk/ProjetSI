package com.backend.projet.elicitation.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.projet.elicitation.entity.Interview;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {

	List<Interview> findByProjetIdProjet(Long idProjet);
}