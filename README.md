# World News

Prototype d'application de presse en **architecture microservices**, developpe dans le cadre d'un exercice pedagogique a Simplon. Le projet compare cette approche a une architecture monolithique classique.

## Structure du projet

```
Wold News/
  ms_reader/        Microservice lecture (consultation des articles)
  ms_writer/        Microservice redaction (CRUD articles + generation IA)
  Db/               Scripts SQL d'initialisation et de seed
  Docs/             Diagrammes MCD / MLD
```

Chaque microservice possede son propre README avec les details d'installation, les endpoints et la configuration :

- [ms_reader/README.md](./ms_reader/README.md)
- [ms_writer/README.md](./ms_writer/README.md)

## Demarrage rapide

> Par defaut, le reader frontend tourne sur `localhost:5173` et le writer frontend sur `localhost:5174`. Verifier que la variable `FRONTEND_URL` du backend correspond au port du frontend associe.

## Architecture

```
                  PostgreSQL 16
                 /             \
  ms_reader (Prisma)      ms_writer (TypeORM)
     |                         |
  schema reader            schema writer
  (vues materialisees)     (tables articles, categories)
```

Les vues materialisees du schema `reader` sont rafraichies automatiquement par des triggers lors des operations CRUD sur le schema `writer`.