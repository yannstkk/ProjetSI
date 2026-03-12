package com.backend.projet.auth.service;

import com.backend.projet.auth.dao.JumpCloudDao;
import com.backend.projet.common.util.ApiResponse;
import org.springframework.stereotype.Service;
import java.util.concurrent.atomic.AtomicLong;
import com.backend.projet.common.exception.AuthentificationException;

@Service
public class JumpCloudService {

    private final AtomicLong counter = new AtomicLong();
    private final JumpCloudDao jumpCloudDao;
    private static final String SUCCESS = "LOGIN_OK";
    private static final String FAILURE = "IDENTIFIERS_INVALIDS";

    public JumpCloudService(JumpCloudDao jumpcloud) {
        this.jumpCloudDao = jumpcloud;
    }
  
    public ApiResponse login(String username, String password) {
        long startTime = System.currentTimeMillis();
        long requestId = counter.incrementAndGet();

        try {

            this.jumpCloudDao.checkLogin(username, password);
            String duration = (System.currentTimeMillis() - startTime) + " ms";
            return new ApiResponse(requestId, false, duration, SUCCESS);

        } catch (AuthentificationException e) {
            String duration = (System.currentTimeMillis() - startTime) + " ms";
            return new ApiResponse(requestId, true, duration, FAILURE);
        }
    }
}
