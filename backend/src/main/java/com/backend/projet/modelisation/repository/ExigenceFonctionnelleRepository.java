package com.backend.projet.modelisation.repository;

import com.backend.projet.modelisation.entity.ExigenceFonctionnelle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExigenceFonctionnelleRepository extends JpaRepository<ExigenceFonctionnelle, Long> {



    // On force la requête SQL pour ne pas laisser Spring deviner le nom des champs
    @Query("SELECT e FROM ExigenceFonctionnelle e WHERE e.projet.idProjet = ?1")
    List<ExigenceFonctionnelle> findByProjetId(Long projetId);





    @Modifying
    @Query("DELETE FROM ExigenceFonctionnelle e WHERE e.projet.idProjet = ?1")
    void deleteByProjetId(Long projetId);
}