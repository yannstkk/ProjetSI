package com.backend.projet.besoin.service;

import com.backend.projet.besoin.AuthTaigaException;
import com.backend.projet.besoin.TaigaDataException;
import com.backend.projet.besoin.dao.TaigaDao;
import com.backend.projet.besoin.dto.request.UserStoryRequest;
import com.backend.projet.besoin.dto.response.ProjectTaigaResponse;
import com.backend.projet.besoin.dto.response.TaigaAuthResponse;
import com.backend.projet.besoin.dto.response.UserStoryResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaigaService {

    private TaigaDao taigaDao;

    public TaigaService(TaigaDao taigaDao){
        this.taigaDao = taigaDao;
    }

    public TaigaAuthResponse authentificationTaiga(String username, String password) throws AuthTaigaException {
        return this.taigaDao.authentificationTaiga(username, password);
    }

    public List<ProjectTaigaResponse> getProjects(Long userId, String token) throws AuthTaigaException, TaigaDataException {
        return this.taigaDao.getProjects(userId, token);
    }


    public UserStoryResponse exportUserStory(Long projectId, UserStoryRequest userStory, String token) throws AuthTaigaException {
        return this.taigaDao.createUserStory(projectId, userStory, token);
    }

}
