package com.backend.projet.besoin.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CreateProjectTaigaRequest {

    private String name;

    private String description;

    @JsonProperty("is_kanban_activated")
    private boolean isBacklogActivated;

    @JsonProperty("is_backlog_activated")
    private boolean isKanbanActivated;

    public CreateProjectTaigaRequest(String name, String description){
        this.name = name;
        this.description = description;
        this.isBacklogActivated = true;
        this.isKanbanActivated = false;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean getIsBacklogActivated() {
        return this.isBacklogActivated;
    }

    public void setIsBacklogActivated(boolean isBacklogActivated) {
        this.isBacklogActivated = isBacklogActivated;
    }


    public boolean isKanbanActivated() {
        return this.isKanbanActivated;
    }

    public void setKanbanActivated(boolean isKanbanActivated) {
        this.isKanbanActivated = isKanbanActivated;
    }

}
