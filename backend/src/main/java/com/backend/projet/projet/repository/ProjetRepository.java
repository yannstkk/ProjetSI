package com.backend.projet.projet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.projet.projet.entity.Projet;

@Repository
public interface ProjetRepository extends JpaRepository<Projet, Long> {

    List<Projet> findByIdUtilisateur(String idUtilisateur);
}
