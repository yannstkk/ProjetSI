package com.backend.projet.modelisation.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.backend.projet.modelisation.entity.MCD;

@Repository
public interface MCDRepository extends JpaRepository<MCD, Long> {

    List<MCD> findByProjetIdProjet(Long idProjet);
}
