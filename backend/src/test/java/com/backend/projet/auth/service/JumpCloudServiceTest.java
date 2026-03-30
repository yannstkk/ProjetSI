package com.backend.projet.auth.service;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.backend.projet.auth.dao.JumpCloudDao;
import com.backend.projet.auth.dto.LoginResponse;
import com.backend.projet.auth.security.JwtUtil;
import com.backend.projet.auth.AuthentificationException;
import com.backend.projet.config.LdapConfig;
import com.backend.projet.config.JwtConfig;

public class JumpCloudServiceTest {

    protected JumpCloudService jumpCloudService;
    protected MockJumpCloudDao mockDao;
    protected MockJwtUtil mockJwt;

    @BeforeEach
    public void init() {
        this.mockDao = new MockJumpCloudDao();
        this.mockJwt = new MockJwtUtil();
        this.jumpCloudService = new JumpCloudService(this.mockDao, this.mockJwt);
    }

    @Test
    public void LoginReturnsValidTokenOnSuccessTest() {
        LoginResponse response = this.jumpCloudService.login("user", "pass");
        assertEquals(1, this.mockDao.checkLoginCalled);
        assertEquals(1, this.mockJwt.generateTokenCalled);
        assertFalse(response.getIsError());
        assertEquals(MockJwtUtil.MOCK_TOKEN, response.getContent());
    }

    @Test
    public void LoginReturnsErrorMessageWhenCredentialsAreInvalid() {
        this.mockDao.shouldFail = true;
        LoginResponse response = this.jumpCloudService.login("user", "wrongPass");
        assertEquals(1, this.mockDao.checkLoginCalled);
        assertEquals(0, this.mockJwt.generateTokenCalled);
        assertTrue(response.getIsError());
        assertEquals("IDENTIFIERS_INVALIDS", response.getContent());
    }

    @Test
    public void requestIdIncrementsOnMultipleLoginCallsTest() {
        LoginResponse r1 = this.jumpCloudService.login("user", "pass");
        LoginResponse r2 = this.jumpCloudService.login("user", "pass");
        LoginResponse r3 = this.jumpCloudService.login("user", "pass");
        assertEquals(1, r1.getResponseId());
        assertEquals(2, r2.getResponseId());
        assertEquals(3, r3.getResponseId());
        assertEquals(3, this.mockDao.checkLoginCalled);
    }

    private class MockJumpCloudDao extends JumpCloudDao {

        public int checkLoginCalled = 0;
        public boolean shouldFail = false;

        public MockJumpCloudDao() {
            super(new LdapConfig());
        }

        @Override
        public void checkLogin(String username, String password) throws AuthentificationException {
            this.checkLoginCalled++;

            if (this.shouldFail) {
                throw new AuthentificationException("Invalid credentials");
            }
        }
    }

    private class MockJwtUtil extends JwtUtil {

        public int generateTokenCalled = 0;
        public static final String MOCK_TOKEN = "mock-token";

        public MockJwtUtil() {
            super(new JwtConfig());
        }

        @Override
        public String generateToken(String username) {
            this.generateTokenCalled++;
            return MOCK_TOKEN;
        }
    }
}