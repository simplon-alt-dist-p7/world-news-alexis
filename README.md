# World News

Application de presse en architecture **microservices / microfrontends**.

Deux micro-applications independantes :

- **Writer** — interface de redaction (CRUD articles, generation IA via Gemini)
- **Reader** — interface de lecture publique (consultation des articles publies)

## Demo

| Service | URL |
|---------|-----|
| Writer (front) | https://worldnews-writer.vercel.app |
| Reader (front) | https://worldnews-reader.vercel.app |
| Writer API | https://worldnews-writer-api.onrender.com |
| Reader API | https://worldnews-reader-api.onrender.com |

## Stack

| Couche | Writer | Reader |
|--------|--------|--------|
| Frontend | React, Vite, React Router | React, Vite, React Router |
| Backend | Express 5, TypeORM | Express 5, Prisma |
| Base de donnees | PostgreSQL (schema `writer`) | PostgreSQL (vues materialisees, schema `reader`) |

## Prerequis

- [Docker](https://www.docker.com/) et Docker Compose
- [Node.js](https://nodejs.org/) >= 20 (pour les hooks git et le linter)

## Installation

```bash
# Cloner le repo
git clone <url-du-repo>
cd world-news

# Installer les dependances racine (husky, biome, commitlint)
npm install

# Creer le fichier d'environnement
cp .env.example .env
# Remplir les valeurs dans .env (mot de passe PostgreSQL, cle Gemini)
```

## Lancer l'application (Docker)

```bash
# Demarrer tous les services (db + 4 micro-services)
docker compose up

# Rebuild si les Dockerfiles ou les dependances ont change
docker compose up --build

# Arreter
docker compose down

# Arreter et supprimer les donnees de la base
docker compose down -v
```

Une fois lance :

| Service | URL locale |
|---------|-----------|
| Writer front | http://localhost:5173 |
| Reader front | http://localhost:5174 |
| Writer API | http://localhost:3000 |
| Reader API | http://localhost:3001 |
| PostgreSQL | localhost:5432 |

## Tests

Tous les tests s'executent via une base de donnees de test dediee (conteneur Docker sur le port 5433, donnees en RAM via tmpfs).

```bash
# Lancer tous les tests (demarre et arrete la BDD de test automatiquement)
npm test

# Gerer la BDD de test manuellement
npm run test:db:up    # demarrer le conteneur de test
npm run test:db:down  # arreter le conteneur de test
```

Pour lancer les tests d'un seul service, voir le README du service concerne.

## Qualite de code

```bash
# Linter (Biome)
npm run lint
npm run lint:fix

# Typecheck de tous les workspaces
npm run typecheck
```

Les hooks git (Husky) executent automatiquement :
- **pre-commit** — lint-staged (Biome) + typecheck
- **pre-push** — tous les tests
- **commit-msg** — commitlint (Conventional Commits)

## Structure du projet

```
world-news/
  db/                  # Scripts SQL d'initialisation
  writer/
    backend/           # API Writer (Express + TypeORM)
    frontend/          # Front Writer (React + Vite)
  reader/
    backend/           # API Reader (Express + Prisma)
    frontend/          # Front Reader (React + Vite)
```

Chaque micro-service a son propre README avec ses commandes specifiques.
