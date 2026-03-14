package com.backend.projet.auth.dto;

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
