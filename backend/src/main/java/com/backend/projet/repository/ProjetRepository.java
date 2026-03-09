package com.backend.projet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.projet.entity.Projet;

@Repository
public interface ProjetRepository extends JpaRepository<Projet, Long> {

}
