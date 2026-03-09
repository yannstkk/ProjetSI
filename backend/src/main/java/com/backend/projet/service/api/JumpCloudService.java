package com.backend.projet.service.api;

import com.backend.projet.dao.JumpCloudDao;
import com.backend.projet.dto.response.ApiResponse;
import com.backend.projet.exception.InvalidLoginException;
import org.springframework.stereotype.Service;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class JumpCloudService {

    private final AtomicLong counter = new AtomicLong();
    private final JumpCloudDao jumpCloudDao;
    private static final String SUCCESS = "TOKEN_GENERE";

    public JumpCloudService(JumpCloudDao jumpcloud) {
        this.jumpCloudDao = jumpcloud;
    }

    public ApiResponse login(String username, String password){
        long startTime = System.currentTimeMillis();
        long requestId = counter.incrementAndGet();
        String duration = (System.currentTimeMillis() - startTime) + " ms";

        if (!this.jumpCloudDao.checkLogin(username, password)) {
            return new ApiResponse(requestId, true, duration, SUCCESS);
        }

        return new ApiResponse(requestId, false, duration, SUCCESS);
    }
}
