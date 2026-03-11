<<<<<<<< HEAD:backend/src/main/java/com/backend/projet/auth/dto/LoginResponse.java
package com.backend.projet.auth.dto;
========
package com.backend.projet.common.util.response;
>>>>>>>> 390f512 (gestion du service api mistral):backend/src/main/java/com/backend/projet/common/util/response/ApiResponse.java

public class LoginResponse {
    private final long responseId;
    private final boolean isError;
    private final String duration;
    private final String content;

    public LoginResponse(long responseId, boolean isError, String duration, String content){
        this.responseId = responseId;
        this.isError = isError;
        this.duration = duration;
        this.content = content;
    }

    public long getResponseId() {
        return this.responseId;
    }

    public boolean getIsError(){
        return this.isError;
    }

    public String getDuration() {
        return this.duration;
    }

    public String getContent(){
        return this.content;
    }
}
