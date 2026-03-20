# Reader Backend

API REST en lecture seule pour la micro-application de consultation. Sert les articles publies depuis des vues materialisees PostgreSQL.

**Stack** : Express 5, Prisma, PostgreSQL

## Lancement

En local, ce service tourne via Docker (voir le [README racine](../../README.md)).

```bash
# Depuis la racine du projet
docker compose up reader-api
```

Le serveur est accessible sur http://localhost:3001.

## Commandes

```bash
npm run dev             # Demarrer en mode dev (tsx watch, hot reload)
npm run build           # Compiler le TypeScript
npm run start           # Lancer le build compile (production)
npm test                # Lancer les tests unitaires (vitest)
npm run test:mutation   # Tests de mutation (Stryker)
```

## Tests

Les tests utilisent la base de donnees de test (port 5433). Depuis la racine du projet :

```bash
npm run test:db:up                  # Demarrer la BDD de test
npm test --prefix reader/backend    # Lancer les tests du reader backend
npm run test:db:down                # Arreter la BDD de test
```

### Tests de mutation

```bash
npm run test:mutation    # Stryker analyse la robustesse des tests
```

## Variables d'environnement

| Variable | Description |
|----------|-------------|
| `PORT` | Port du serveur (default: 3001) |
| `FRONTEND_URL` | URL du frontend (pour le CORS) |
| `DATABASE_URL` | URL de connexion PostgreSQL complete |
