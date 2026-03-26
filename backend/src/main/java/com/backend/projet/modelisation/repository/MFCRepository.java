package com.backend.projet.modelisation.repository;

import com.backend.projet.modelisation.entity.MFC;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MFCRepository extends JpaRepository<MFC, Long> {
    List<MFC> findByProjetIdProjet(Long idProjet);
}
