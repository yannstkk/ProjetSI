package com.backend.projet.besoin.dao;


import com.backend.projet.besoin.dto.request.CreateProjectTaigaRequest;
import com.backend.projet.besoin.dto.request.UserStoryRequest;
import com.backend.projet.besoin.dto.response.CreateProjectTaigaResponse;
import com.backend.projet.besoin.dto.request.TaigaAuthRequest;
import com.backend.projet.besoin.dto.response.TaigaAuthResponse;
import com.backend.projet.besoin.dto.response.UserStoryResponse;
import com.backend.projet.config.TaigaConfig;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;


public class TaigaDao {

    private RestTemplate restTemplate;
    private TaigaConfig taigaConfig;

    public TaigaDao(RestTemplate restTemplate, TaigaConfig taigaConfig){
        this.restTemplate = restTemplate;
        this.taigaConfig = taigaConfig;
    }

    public TaigaAuthResponse authentificationTaiga(){
        String url = this.taigaConfig.getUrl() + "/auth";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        TaigaAuthRequest authRequest = new TaigaAuthRequest(this.taigaConfig.getUsername(), this.taigaConfig.getPassword());
        HttpEntity<TaigaAuthRequest> postEntity = new HttpEntity<>(authRequest, headers);
        return this.restTemplate.exchange(url,HttpMethod.POST, postEntity, TaigaAuthResponse.class).getBody();
    }

    public CreateProjectTaigaResponse createProject(CreateProjectTaigaRequest createProject, String token){
        String url = this.taigaConfig.getUrl() + "/projects";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + token);
        HttpEntity<CreateProjectTaigaRequest> postEntity = new HttpEntity<>(createProject,headers);
        return this.restTemplate.exchange(url, HttpMethod.POST, postEntity, CreateProjectTaigaResponse.class).getBody();
    }

    public UserStoryResponse createUserStory(UserStoryRequest userStory, String token){
        String url = this.taigaConfig.getUrl() + "/userstories";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + token);
        HttpEntity<UserStoryRequest> postEntity = new HttpEntity<>(userStory,headers);
        return this.restTemplate.exchange(url, HttpMethod.POST, postEntity, UserStoryResponse.class).getBody();
    }
}
