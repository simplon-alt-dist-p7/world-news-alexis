# Writer Frontend

Interface de redaction pour les journalistes. Permet de creer, modifier, activer/desactiver et supprimer des articles.

**Stack** : React 19, Vite, TypeScript, React Router

## Lancement

En local, ce service tourne via Docker (voir le [README racine](../../README.md)).

```bash
# Depuis la racine du projet
docker compose up writer-front
```

L'application est accessible sur http://localhost:5173.

## Commandes

```bash
npm run dev       # Serveur de dev Vite (HMR)
npm run build     # Build de production
npm run preview   # Previsualiser le build de production
npm test          # Tests unitaires (vitest)
npm run test:e2e  # Tests end-to-end (Playwright)
```

## Tests

```bash
# Tests unitaires
npm test

# Tests E2E (necessite que l'application tourne)
npm run test:e2e
```

## Variables d'environnement

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | URL de l'API Writer (ex: `http://localhost:3000/api`) |
