# FrontAppSportActual

Application frontend pour le suivi des sports en direct, réalisée avec React, TypeScript et Vite.

## Fonctionnalités

- **Dashboard** : Vue d'ensemble avec stats, matches en direct, actualités et compétitions
- **Matches** : Liste des matches avec filtres (tous, en direct, à venir, terminés)
- **Compétitions** : Liste des compétitions par sport
- **Équipes** : Liste des équipes avec recherche
- **Actualités** : Fil d'actualités sportives

## Technologies

- React 18 + TypeScript
- Vite (bundler)
- React Router (routing)
- Zustand (gestion d'état)
- Axios (API client)
- Lucide React (icônes)
- date-fns (dates)

## Configuration

```bash
npm install
npm run dev
```

Le serveur de développement fonctionne sur http://localhost:5173

## API Backend

Le frontend communique avec le backend Spring Boot sur le port 8080 via un proxy Vite.

Endpoints attendus :
- `POST /api/auth/login` - Authentification
- `GET /api/sports` - Liste des sports
- `GET /api/competitions` - Liste des compétitions
- `GET /api/matches` - Liste des matches
- `GET /api/matches/live` - Matches en direct
- `GET /api/teams` - Liste des équipes
- `GET /api/news` - Liste des actualités