package com.backend.projet.elicitation.entity.service;

import com.backend.projet.elicitation.entity.Interview;
import com.backend.projet.elicitation.entity.Question;
import com.backend.projet.elicitation.entity.dto.request.QuestionRequest;
import com.backend.projet.elicitation.entity.dto.response.QuestionResponse;
import com.backend.projet.elicitation.entity.repository.InterviewRepository;
import com.backend.projet.elicitation.entity.repository.QuestionRepository;
import com.backend.projet.projet.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final InterviewRepository interviewRepository;

    public QuestionService(QuestionRepository questionRepository,
                           InterviewRepository interviewRepository) {
        this.questionRepository = questionRepository;
        this.interviewRepository = interviewRepository;
    }

    public List<QuestionResponse> getByInterview(Long numeroInterview) {
        return questionRepository
                .findByInterviewNumeroInterview(numeroInterview)
                .stream()
                .map(q -> new QuestionResponse(
                        q.getNumeroQuestion(),
                        q.getInterview().getNumeroInterview(),
                        q.getLibelle()
                ))
                .toList();
    }

    public QuestionResponse creer(QuestionRequest request) {
        Interview interview = interviewRepository
                .findById(request.getNumeroInterview())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Interview non trouvée : " + request.getNumeroInterview()));

        Question question = new Question();
        question.setInterview(interview);
        question.setLibelle(request.getLibelle());

        Question saved = questionRepository.save(question);

        return new QuestionResponse(
                saved.getNumeroQuestion(),
                saved.getInterview().getNumeroInterview(),
                saved.getLibelle()
        );
    }

    public void deleteByInterview(Long numeroInterview) {
        List<Question> liste =
                questionRepository.findByInterviewNumeroInterview(numeroInterview);
        questionRepository.deleteAll(liste);
    }
}