package com.backend.projet.modelisation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.projet.modelisation.entity.Acteur;

/**
 * Repository interface pour l'entité Acteur.
 */
@Repository
public interface ActeurRepository extends JpaRepository<Acteur, Long> {

    List<Acteur> findByProjetIdProjet(Long idProjet);

}