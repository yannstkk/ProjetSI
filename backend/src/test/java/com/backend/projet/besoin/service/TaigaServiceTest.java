package com.backend.projet.besoin.service;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.backend.projet.besoin.dao.TaigaDao;
import com.backend.projet.besoin.AuthTaigaException;
import com.backend.projet.besoin.TaigaDataException;
import com.backend.projet.besoin.dto.request.UserStoryRequest;
import com.backend.projet.besoin.dto.response.ProjectTaigaResponse;
import com.backend.projet.besoin.dto.response.TaigaAuthResponse;
import com.backend.projet.besoin.dto.response.UserStoryResponse;
import com.backend.projet.config.TaigaConfig;

import java.util.ArrayList;
import java.util.List;

public class TaigaServiceTest {

    protected TaigaService taigaService;
    protected MockTaigaDao mockTaigaDao;

    @BeforeEach
    public void init() {
        this.mockTaigaDao = new MockTaigaDao();
        this.taigaService = new TaigaService(this.mockTaigaDao);
    }

    @Test
    public void validCredentialsReturnsAuthResponseTest() throws AuthTaigaException {
        TaigaAuthResponse response = this.taigaService.authentificationTaiga("user", "password");
        assertEquals(1, this.mockTaigaDao.authentificationTaigaCalled);
        assertNotNull(response);
        assertEquals("fakeToken", response.getToken());
    }

    @Test
    public void cannotAuthenticateWithInvalidCredentialsTest() {
        this.mockTaigaDao.shouldFailAuth = true;
        assertThrows(AuthTaigaException.class, () -> {this.taigaService.authentificationTaiga("user", "wrongPass");});
        assertEquals(1, this.mockTaigaDao.authentificationTaigaCalled);
    }

    @Test
    public void validTokenReturnsProjectsListTest() throws AuthTaigaException, TaigaDataException {
        List<ProjectTaigaResponse> response = this.taigaService.getProjects(1L, "token");
        assertEquals(1, this.mockTaigaDao.getProjectsCalled);
        assertNotNull(response);
    }

    @Test
    public void cannotGetProjectsWithInvalidTokenTest() {
        this.mockTaigaDao.shouldFailAuth = true;
        assertThrows(AuthTaigaException.class, () -> {this.taigaService.getProjects(1L, "invalid-token");});
        assertEquals(1, this.mockTaigaDao.getProjectsCalled);
    }

    @Test
    public void cannotGetProjectsWithInvalidDataTest() {
        this.mockTaigaDao.shouldFailData = true;
        assertThrows(TaigaDataException.class, () -> {this.taigaService.getProjects(1L, "token");});
        assertEquals(1, this.mockTaigaDao.getProjectsCalled);
    }

    @Test
    public void validTokenCreatesUserStoryTest() throws AuthTaigaException {
        UserStoryRequest request = new UserStoryRequest();
        UserStoryResponse response = this.taigaService.exportUserStory(10L, request, "token");
        assertEquals(1, this.mockTaigaDao.createUserStoryCalled);
        assertNotNull(response);
        assertEquals(99L, response.getTaigaId());
    }

    @Test
    public void cannotCreateUserStoryWithInvalidTokenTest() {
        this.mockTaigaDao.shouldFailAuth = true;
        UserStoryRequest request = new UserStoryRequest();
        assertThrows(AuthTaigaException.class, () -> {this.taigaService.exportUserStory(10L, request, "invalidToken");});
        assertEquals(1, this.mockTaigaDao.createUserStoryCalled);
    }

    private class MockTaigaDao extends TaigaDao {

        public int authentificationTaigaCalled = 0;
        public int getProjectsCalled = 0;
        public int createUserStoryCalled = 0;
        public boolean shouldFailAuth = false;
        public boolean shouldFailData = false;

        public MockTaigaDao() {
            super(new RestTemplate(), new TaigaConfig(), new ObjectMapper());
        }

        @Override
        public TaigaAuthResponse authentificationTaiga(String username, String password) throws AuthTaigaException {
            this.authentificationTaigaCalled++;

            if (this.shouldFailAuth) {
                throw new AuthTaigaException("Invalid credentials");
            }

            TaigaAuthResponse response = new TaigaAuthResponse();
            response.setToken("fakeToken");
            return response;
        }

        @Override
        public List<ProjectTaigaResponse> getProjects(Long userId, String token) throws AuthTaigaException, TaigaDataException {
            this.getProjectsCalled++;
            if (this.shouldFailAuth) {
                throw new AuthTaigaException("Invalid token");
            }
            if (this.shouldFailData) {
                throw new TaigaDataException("Invalid data");
            }
            return new ArrayList<>();
        }

        @Override
        public UserStoryResponse createUserStory(Long projectId, UserStoryRequest userStory, String token) throws AuthTaigaException {
            this.createUserStoryCalled++;

            if (this.shouldFailAuth) {
                throw new AuthTaigaException("Invalid token");
            }
            UserStoryResponse response = new UserStoryResponse();
            response.setTaigaId(99L);
            return response;
        }
    }
}