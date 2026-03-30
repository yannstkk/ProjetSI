package com.backend.projet.modelisation.repository;

import com.backend.projet.modelisation.entity.Bpmn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BpmnRepository extends JpaRepository<Bpmn, Long> {

    List<Bpmn> findByProjetIdProjet(Long idProjet);
}