package com.backend.projet.besoin.dao;


import com.backend.projet.common.config.TaigaConfig;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;
import tools.jackson.databind.JsonNode;

import java.util.HashMap;
import java.util.Map;

public class TaigaDao {

    private RestTemplate restTemplate;
    private TaigaConfig taigaConfig;

    public TaigaDao(RestTemplate restTemplate, TaigaConfig taigaConfig){
        this.restTemplate = restTemplate;
        this.taigaConfig = taigaConfig;
    }

    public JsonNode AuthentificationTaiga(){
        String url = this.taigaConfig.getUrl() + "/auth";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        Map<String, String> body = new HashMap<>();
        body.put("username", this.taigaConfig.getUsername());
        body.put("password", this.taigaConfig.getPassword());
        body.put("type", "normal");
        HttpEntity<Map<String,String>> postEntity = new HttpEntity<>(body, headers);
        return this.restTemplate.postForObject(url, postEntity, JsonNode.class);
    }

    public JsonNode getUs(int idProject, String token){
        String url = this.taigaConfig.getUrl() + "/userstories?project=" + idProject;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + token);
        HttpEntity<Void> getEntity = new HttpEntity<>(headers);
        return this.restTemplate.exchange(url, HttpMethod.GET, getEntity, JsonNode.class).getBody();
    }
}
