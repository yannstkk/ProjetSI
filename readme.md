# AnalyseChecker : Plateforme pour Business Analyste 

## À propos de ce projet

Ce projet a été développé dans le cadre de la **soutenance de Licence 3 MIAGE** de l'Université de Lille.

**Membres du groupe :**
- Zaidi Yani
- Aymen Torche
- Hiba Tazi
- Cyrille Riguet
- Azdad Billal

**Année académique :** 2025-2026

---

Une application web complète pour l'analyse de projets d'ingénierie système, avec support de l'IA pour l'élicitation des exigences, la modélisation de données, et l'analyse de processus.

## Objectif

AnalyseChecker guide les utilisateurs à travers un processus d'ingénierie système en 7 phases, de l'entretien avec les parties prenantes à la modélisation complète du système, avec des analyses IA intégrées pour extraire automatiquement les exigences et valider la cohérence.

---

## Les 7 Phases du Projet

### **Phase 1 : Interviewer le métier**
- Enregistrement des entretiens avec les stakeholders
- Structuration automatique des notes en **besoins**, **solutions**, **règles**, **contraintes** et **données**
- Génération de questions suggérées via IA
- Export et import de données

### **Phase 2 : Domaine & Acteurs**
- Détection automatique des acteurs depuis les notes
- Modélisation des flux avec **diagrammes MFC (PlantUML)**
- Analyse IA des flux de données
- Gestion des acteurs (internes/externes)

### **Phase 3 : Élicitation** 
- Classification des éléments en colonnes Kanban :
    - Besoins fonctionnels
    - Contraintes
    - Données métier
- Validation manuelle et détection de doublons
- Fusion intelligente des éléments

### **Phase 4 : User Stories** 
- Création et gestion du backlog de User Stories
- Format : "En tant que [acteur], je veux [action] afin de [bénéfice]"
- Priorités (Haute/Moyenne/Basse)
- Validation IA du backlog
- Analyse de cohérence et de complétude

### **Phase 5 : Exigences**
- Génération d'exigences formalisées
- Matrice de traçabilité (Exigences ↔ User Stories)
- Vérification de la couverture
- Export documenté
- Cette n'a pas pu etre terminé

### **Phase 6 : BPMN** 
- Import de diagrammes BPMN (XML)
- Sauvegarde en base de données
- Analyse de cohérence par rapport aux User Stories
- Visualisation des processus
- Vérification de la couverture des processus

### **Phase 7 : Modèle de Données (MCD)**
- Import de diagrammes MCD (PlantUML)
- Analyse IA pour extraction automatique :
    - Entités et attributs
    - Associations et cardinalités
    - Alertes et anomalies
- Gestion des versions
- Sauvegarde en base de données

---

##  Architecture

### Frontend
```
frontend/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── phase1/        # Entretiens
│   │   │   ├── phase2/        # Acteurs & Flux
│   │   │   ├── phase3/        # Élicitation
│   │   │   ├── phase4/        # User Stories
│   │   │   ├── phase5/        # Exigences
│   │   │   ├── phase6/        # BPMN
│   │   │   ├── phase7/        # MCD
│   │   │   └── Cockpit.jsx    # Dashboard principal
│   │   ├── components/        # Composants réutilisables
│   │   │   ├── BoutonIA.jsx   # Bouton stylisé pour IA
│   │   │   ├── ui/            # Composants UI (Card, Input, etc.)
│   │   │   └── layout/        # Layout, Sidebar, etc.
│   │   └── services/          # Services (auth, API, stockage)
│   └── assets/
├── package.json
└── vite.config.js
```

### Backend (Spring Boot)
```
backend/
├── src/main/java/com/backend/projet/
│   ├── elicitation/           # Phase 1 (Interviews, Notes)
│   ├── modelisation/          # Phases 2, 6, 7 (BPMN, MCD, Acteurs)
│   ├── projet/                # Gestion des projets
│   ├── mistral/               # Intégration IA (Mistral)
│   └── Main.java              # Point d'entrée
└── pom.xml                    # Dépendances Maven
```

### Base de Données (Oracle SQL)
- Schéma utilisateur : `RIGUET`
- Tables principales :
    - `PROJET` - Projets
    - `INTERVIEW` - Entretiens
    - `NOTES` - Notes d'entretiens
    - `PARTICIPANT` - Participants
    - `ACTEUR` - Acteurs du domaine
    - `BPMN` - Diagrammes de processus
    - `MCD` - Modèles conceptuels de données
    - `USER_STORY` - User Stories
    - `FLUX`, `MFC` - Flux métier

---

## Installation

### Prérequis
- **Node.js** 18+ et npm
- **Java** 17+
- **Maven** 3.8+
- **Oracle Database** 19+ (ou accès à une instance)
- **Clé API Mistral** pour les fonctionnalités IA

### Configuration Frontend

```bash
cd frontend
npm install
```

Créez un fichier `.env` :
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=votre_id_google
```

Démarrage :
```bash
npm run dev
```

L'app sera disponible sur `http://localhost:3000`

### Configuration Backend

```bash
cd backend
```

Modifiez `application.properties` :
```properties
# Database Oracle
spring.datasource.url=jdbc:oracle:thin:@oracle.fil.univ-lille.fr:1521:filora
spring.datasource.username=RIGUET
spring.datasource.password=***
spring.datasource.driver-class-name=oracle.jdbc.OracleDriver

# Mistral IA
mistral.api.key=your_mistral_api_key
mistral.api.url=https://api.mistral.ai/v1

# Auth
spring.security.oauth2.resourceserver.jwt.issuer-uri=...
```

Démarrage :
```bash
mvn spring-boot:run
```

Le backend sera disponible sur `http://localhost:8080`

---

##  Fonctionnalités Principales

###  Intelligence Artificielle (Mistral)
-  Détection automatique d'acteurs
-  Génération de questions suggérées
-  Analyse de flux (MFC)
-  Extraction d'entités depuis MCD
-  Validation de cohérence BPMN ↔ User Stories
-  Analyse et suggestion d'améliorations du backlog

###  Gestion des Données
-  Sauvegarde en base de données Oracle
-  SessionStorage pour brouillons et travail local
-  Export/Import de fichiers XML, PlantUML
-  Traçabilité complète des modifications

###  Visualisations
-  Diagrammes BPMN (bpmn-js)
-  Diagrammes PlantUML (MFC, MCD)
-  Dashboard Cockpit avec progression globale
-  Matrices de traçabilité

###  Sécurité
-  Authentification OAuth 2.0 (Google)
-  JWT pour les requêtes API
-  Isolation des données par projet et utilisateur

---

##  Interface Utilisateur

### Cockpit (Dashboard)
Vue d'ensemble avec :
- Progression de chaque phase
- Nombre d'éléments par phase
- Navigation directe vers chaque phase
- Statut global du projet

### Barre Latérale
Navigation par phase avec sous-menus pour chaque étape clé.

### Boutons IA
Boutons stylisés avec animation de scan et curseur clignotant pour toutes les opérations IA.

### Gestion des Erreurs
- Messages d'erreur détaillés
- Alertes visuelles (rouge, orange, vert)
- Suggestions de correction

---

##  API Endpoints Principaux

### Interviews (Phase 1)
```
GET  /api/interviews
POST /api/interviews
GET  /api/interviews/{id}
PUT  /api/interviews/{id}
```

### Acteurs (Phase 2)
```
GET  /api/acteur/projet/{idProjet}
POST /api/acteur
PUT  /api/acteur/{id}
POST /api/acteur/detect  (IA)
```

### BPMN (Phase 6)
```
POST /api/bpmn/save
GET  /api/bpmn/{idBpmn}
GET  /api/bpmn/projet/{idProjet}
POST /api/bpmn/analyser-coherence  (IA)
```

### MCD (Phase 7)
```
POST /api/mcd
GET  /api/mcd/{idMcd}
POST /api/mcd/analyser  (IA)
```

### User Stories (Phase 4)
```
POST /api/user-stories
GET  /api/user-stories/projet/{idProjet}
POST /api/mistral/analyser-backlog  (IA)
```

---

##  Design & UX

### Palette de Couleurs par Phase
| Phase | Couleur | Hex |
|-------|---------|-----|
| 1 | Violet | `#7c6ef0` |
| 2 | Bleu | `#4a90e2` |
| 3 | Cyan | `#17a2b8` |
| 4 | Vert | `#2e9e6e` |
| 5 | Ambre | `#f5a623` |
| 6 | Orange | `#f06a28` |
| 7 | Rose | `#e84057` |

### Framework UI
- **Tailwind CSS** pour le styling
- **Lucide Icons** pour les icônes
- **React DnD** pour le drag-and-drop
- **Recharts** pour les graphiques

---

##  Technologies Utilisées

### Frontend
- React 18+
- Vite
- Tailwind CSS
- bpmn-js (visualisation BPMN)
- DnD Kit (drag-and-drop)
- Lucide React (icônes)

### Backend
- Spring Boot 3.x
- Spring Data JPA
- Spring Security OAuth 2.0
- Oracle JDBC
- Mistral API Client

### Base de Données
- Oracle Database 19c
- SQL PL/SQL

---

##  Utilisation

### Flux Typique

1. **Créer un projet** via le tableau de bord
2. **Phase 1** : Importer des entretiens ou créer des notes
3. **Phase 2** : Laisser l'IA détecter les acteurs, ajouter les flux
4. **Phase 3** : Classer les éléments en colonnes
5. **Phase 4** : Créer les User Stories et valider le backlog
6. **Phase 5** : Générer les exigences formalisées
7. **Phase 6** : Importer le BPMN et vérifier la cohérence
8. **Phase 7** : Importer le MCD et analyser la structure de données


### Services Clés

**authFetch.js** - Wrapper pour les requêtes API avec JWT
```javascript
const response = await authFetch('/api/endpoint', { method: 'POST', body: JSON.stringify(data) });
```

**projetCourant.js** - Gestion du projet actif
```javascript
const projet = getProjetCourant();
```

**SessionStorage** - Stockage local par phase
```javascript
// Phase 4
loadBacklog() / saveBacklog(data) / clearBacklog()

// Phase 6
loadBpmn() / saveBpmn(data) / clearBpmn()

// Phase 7
loadMCD() / saveMCD(data) / clearMCD()
```

### Patterns Utilisés
- **React Hooks** (useState, useEffect, useRef, useContext)
- **Custom Hooks** pour la logique métier
- **Composition** de composants
- **Local State** + SessionStorage + Base de données

---

