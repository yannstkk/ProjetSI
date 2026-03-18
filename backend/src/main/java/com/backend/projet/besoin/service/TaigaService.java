package com.backend.projet.besoin.service;

import com.backend.projet.besoin.dao.TaigaDao;
import com.backend.projet.besoin.dto.request.CreateProjectTaigaRequest;
import com.backend.projet.besoin.dto.request.UserStoryRequest;
import com.backend.projet.besoin.dto.response.CreateProjectTaigaResponse;
import com.backend.projet.besoin.dto.response.TaigaAuthResponse;
import com.backend.projet.besoin.dto.response.UserStoryResponse;
import org.springframework.stereotype.Service;

@Service
public class TaigaService {

    private TaigaDao taigaDao;
    private String description;
    private CreateProjectTaigaResponse currentProjet;

    private int projectNumber;

    public TaigaService(TaigaDao taigaDao){
        this.taigaDao = taigaDao;
        this.description = "AnalyzeChecker Project";
        this.projectNumber = 1;
        this.currentProjet = null;
    }

    public CreateProjectTaigaResponse createProjectTaiga(){
        if (this.currentProjet == null) {
            TaigaAuthResponse authentification = this.taigaDao.authentificationTaiga();
            String token = authentification.getToken();
            String projectName = "Project " + this.projectNumber;
            CreateProjectTaigaRequest request = new CreateProjectTaigaRequest(projectName, this.description);
            this.currentProjet = this.taigaDao.createProject(request, token);
            this.projectNumber++;
        }
        return this.currentProjet;


    }

    public UserStoryResponse exportUserStory(String subject, Long projectId){
        TaigaAuthResponse authentification = this.taigaDao.authentificationTaiga();
        String token = authentification.getToken();
        UserStoryRequest request = new UserStoryRequest(subject, projectId);
        return this.taigaDao.createUserStory(request, token);
    }
}
