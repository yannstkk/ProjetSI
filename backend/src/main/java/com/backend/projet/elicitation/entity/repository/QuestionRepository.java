package com.backend.projet.elicitation.entity.repository;

import com.backend.projet.elicitation.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByInterviewNumeroInterview(Long numeroInterview);
}