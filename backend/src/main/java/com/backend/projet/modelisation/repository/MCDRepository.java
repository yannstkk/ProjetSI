package com.backend.projet.modelisation.repository;

import com.backend.projet.modelisation.entity.MCD;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MCDRepository extends JpaRepository<MCD, Long> {

    List<MCD> findByProjetIdProjet(Long idProjet);
}
