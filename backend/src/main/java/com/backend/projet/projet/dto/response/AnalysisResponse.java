<<<<<<<< HEAD:backend/src/main/java/com/backend/projet/projet/dto/response/AnalysisResponse.java
package com.backend.projet.projet.dto.response;

========
package com.backend.projet.common.util.response;
>>>>>>>> 390f512 (gestion du service api mistral):backend/src/main/java/com/backend/projet/common/util/response/AnalysisResponse.java
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
public class AnalysisResponse {
    public List<AnalyseElement> elements;

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AnalyseElement {
        public String categorie;    // Acteurs, Actions, Objets Métiers, etc.
        public String valeur;       // Le concept extrait par l'IA
        public String phraseSource; // La preuve textuelle (citation exacte)
    }
}