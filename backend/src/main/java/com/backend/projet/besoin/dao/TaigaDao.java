package com.backend.projet.besoin.dao;


import com.backend.projet.besoin.AuthTaigaException;
import com.backend.projet.besoin.TaigaDataException;
import com.backend.projet.besoin.dto.request.UserStoryRequest;
import com.backend.projet.besoin.dto.request.TaigaAuthRequest;
import com.backend.projet.besoin.dto.response.ProjectTaigaResponse;
import com.backend.projet.besoin.dto.response.TaigaAuthResponse;
import com.backend.projet.besoin.dto.response.UserStoryResponse;
import com.backend.projet.config.TaigaConfig;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

@Repository
public class TaigaDao {

    private RestTemplate restTemplate;
    private TaigaConfig taigaConfig;
    private ObjectMapper objectMapper;

    public TaigaDao(RestTemplate restTemplate, TaigaConfig taigaConfig, ObjectMapper objectMapper ){
        this.restTemplate = restTemplate;
        this.taigaConfig = taigaConfig;
        this.objectMapper = objectMapper;
    }

    public TaigaAuthResponse authentificationTaiga(String username, String password) throws AuthTaigaException {
        try {
            String url = this.taigaConfig.getUrl() + "/auth";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            TaigaAuthRequest authRequest = new TaigaAuthRequest(username, password);
            HttpEntity<TaigaAuthRequest> postEntity = new HttpEntity<>(authRequest, headers);

            return this.restTemplate.exchange(url, HttpMethod.POST, postEntity, TaigaAuthResponse.class).getBody();

        } catch (HttpClientErrorException.Unauthorized e) {
            throw new AuthTaigaException("Identifiants Taiga incorrects.");
        } catch (RestClientException e) {
            throw new AuthTaigaException("Erreur de communication avec Taiga.");
        }
    }

    public List<ProjectTaigaResponse> getProjects(Long userId, String token) throws AuthTaigaException, TaigaDataException {
        try {
            String url = this.taigaConfig.getUrl() + "/projects?member=" + userId;
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", token);
            HttpEntity<Void> entity = new HttpEntity<>(headers);
            String jsonResponse = this.restTemplate.exchange(url, HttpMethod.GET, entity, String.class).getBody();
            return this.objectMapper.readerForListOf(ProjectTaigaResponse.class).readValue(jsonResponse);

        } catch (HttpClientErrorException.Unauthorized e) {
            throw new AuthTaigaException("Token invalide ou expiré.");
        } catch (RestClientException e) {
            throw new AuthTaigaException("Erreur de communicationavec Taiga.");
        } catch (JsonMappingException e) {
            throw new TaigaDataException("Les données Taiga reçu ne correspondent pas à ce qui est attendus");
        } catch (JsonProcessingException e) {
            throw new TaigaDataException("Les données sont invalides");
        }
    }

    public UserStoryResponse createUserStory(Long projectId, UserStoryRequest userStory, String token) throws AuthTaigaException {
        try {
            String url = this.taigaConfig.getUrl() + "/userstories";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", token);
            HttpEntity<UserStoryRequest> postEntity = new HttpEntity<>(userStory,headers);
            userStory.setProject(projectId);
            return this.restTemplate.exchange(url, HttpMethod.POST, postEntity, UserStoryResponse.class).getBody();
        } catch (HttpClientErrorException.Unauthorized e) {
            throw new AuthTaigaException("Identifiants Taiga incorrects.");
        } catch (RestClientException e) {
            throw new AuthTaigaException("Erreur de communication avec Taiga.");
        }
    }
}
