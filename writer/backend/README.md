# Writer Backend

API REST pour la micro-application de redaction. Gere le CRUD des articles et des categories, ainsi que la generation de contenu via Google Gemini.

**Stack** : Express 5, TypeORM, PostgreSQL, Google Generative AI

## Lancement

En local, ce service tourne via Docker (voir le [README racine](../../README.md)).

```bash
# Depuis la racine du projet
docker compose up writer-api
```

Le serveur est accessible sur http://localhost:3000.

## Commandes

```bash
npm run dev      # Demarrer en mode dev (tsx watch, hot reload)
npm run build    # Compiler le TypeScript
npm run start    # Lancer le build compile (production)
npm test         # Lancer les tests unitaires (vitest)
npm run seed     # Peupler la base avec des articles de test
```

## Tests

Les tests utilisent la base de donnees de test (port 5433). Depuis la racine du projet :

```bash
npm run test:db:up                  # Demarrer la BDD de test
npm test --prefix writer/backend    # Lancer les tests du writer backend
npm run test:db:down                # Arreter la BDD de test
```

## Variables d'environnement

| Variable | Description |
|----------|-------------|
| `PORT` | Port du serveur (default: 3000) |
| `NODE_ENV` | Environnement (`development` / `production`) |
| `FRONTEND_URL` | URL du frontend (pour le CORS) |
| `DB_HOST` | Hote PostgreSQL (`db` en Docker, `localhost` en local) |
| `DB_PORT` | Port PostgreSQL (5432) |
| `DB_NAME` | Nom de la base |
| `DB_USER` | Utilisateur PostgreSQL |
| `DB_PASSWORD` | Mot de passe PostgreSQL |
| `GEMINI_API_KEY` | Cle API Google Gemini |
