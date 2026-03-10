package com.backend.projet.service.api;

import com.backend.projet.dao.JumpCloudDao;
import com.backend.projet.dto.response.ApiResponse;
import org.springframework.stereotype.Service;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class JumpCloudService {

    private final AtomicLong counter = new AtomicLong();
    private final JumpCloudDao jumpCloudDao;
    private static final String SUCCESS = "LOGIN_OK";
    private static final String FAILURE = "IDENTIFIANTS_INVALIDES";

    public JumpCloudService(JumpCloudDao jumpcloud) {
        this.jumpCloudDao = jumpcloud;
    }
  
    public ApiResponse login(String username, String password) {
        long startTime = System.currentTimeMillis();
        long requestId = counter.incrementAndGet();

        boolean ok = this.jumpCloudDao.checkLogin(username, password);

        String duration = (System.currentTimeMillis() - startTime) + " ms";

        // BUG CORRIGÉ : avant c'était if (!ok) { isError=true } ce qui était inversé
        if (ok) {
            return new ApiResponse(requestId, false, duration, SUCCESS);
        } else {
            return new ApiResponse(requestId, true, duration, FAILURE);
        }
    }
}
