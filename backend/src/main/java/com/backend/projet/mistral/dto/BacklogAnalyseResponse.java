package com.backend.projet.mistral.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class BacklogAnalyseResponse {

    private String       resume;
    private List<Alerte> alertes;

    public BacklogAnalyseResponse() {}

    public String getResume()            { return resume; }
    public void setResume(String r)      { this.resume = r; }

    public List<Alerte> getAlertes()          { return alertes; }
    public void setAlertes(List<Alerte> a)    { this.alertes = a; }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Alerte {
        private String type;         // "erreur" | "avertissement" | "suggestion"
        private String usId;         // ex: "US-001" (peut être null si global)
        private String titre;
        private String description;

        public String getType()              { return type; }
        public void setType(String t)        { this.type = t; }

        public String getUsId()              { return usId; }
        public void setUsId(String id)       { this.usId = id; }

        public String getTitre()             { return titre; }
        public void setTitre(String t)       { this.titre = t; }

        public String getDescription()           { return description; }
        public void setDescription(String d)     { this.description = d; }
    }
}