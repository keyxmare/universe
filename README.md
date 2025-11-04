# Monorepo Symfony + Vue

Modèle A: chaque application garde son propre manifest (`composer.json` dans le backend, `package.json` dans le frontend). Pas de dépendances croisées runtime; la synchronisation se fait via les contrats OpenAPI et des types générés.

## Sommaire
1. Objectifs & Philosophie
2. Structure d'architecture
3. Sous-domaines & Accès dev
4. Flux OpenAPI / Types partagés
5. Prérequis & Installation
6. Démarrage développement
7. Configuration Front (Vite / API Base)
8. Génération des contrats & Types
9. Qualité & Lint
10. Tests
11. Conventions de contribution
12. Décisions (ADR)
13. Roadmap
14. FAQ rapide
15. Cibles Makefile
16. Sécurité (prévision)
17. Contribution

---
## 1. Objectifs & Philosophie
- Séparer clairement backend (API HTTP REST/JSON) et frontend (SPA Vue + Vite).
- Favoriser l'évolution indépendante (cycles de release différents).
- Réduire le couplage par un contrat explicite (OpenAPI) versionné dans `packages/contracts`.
- Partager uniquement des types générés (`packages/shared-js`).
- Rester minimaliste et itératif; ajouter seulement ce qui sert un besoin concret.

## 2. Structure d'architecture
```
apps/
  backend/         # Projet Symfony (API Platform ultérieurement, Domain, Application, Interface)
  frontend/        # Projet Vue (stratifié: domain/application/infrastructure/interface)
packages/
  contracts/       # Fichier openapi.json exporté depuis backend
  shared-js/       # Types TS générés + helpers transversaux
infra/
  docker/          # Dockerfiles & config nginx, Traefik (docker externe)
  compose.yaml     # Définition des services (node, php, nginx)
docs/              # Documentation technique, ADR
Makefile           # Cibles build/test/outils
```
Backend (couches):
```
apps/backend/src/
  Domain/          # Entités métier, Value Objects (sans Symfony)
  Application/     # Use cases / services applicatifs (sans Symfony)
  Interface/       # Adaptateurs (Controllers HTTP, CLI, etc.)
  Infrastructure/  # Adapters externes (DB, FS, etc.)
```
Frontend (couches):
```
apps/frontend/src/
  domain/          # Modèle métier & types internes
  application/     # Orchestration des use cases (services)
  infrastructure/  # Gateways HTTP, store Pinia, persistance locale
  interface/       # Vue components (views, router, main)
```

## 3. Sous-domaines & Accès dev
En environnement docker + Traefik:
- Frontend: `universe.localhost`
- Backend/API: `api.universe.localhost`

Ajouter dans `/etc/hosts` (ou équivalent) :
```
127.0.0.1 universe.localhost api.universe.localhost
```
Tous les endpoints backend sont servis directement sur le sous-domaine API (pas de préfixe `/api`). Exemple ping: `https://api.universe.localhost/ping`.
Le domaine frontend ne sert que la SPA (proxy Vite) et ne doit pas exposer d'endpoints PHP.

## 4. Flux OpenAPI / Types partagés
1. Export backend du schéma (`make gen-openapi`).
2. Commit dans `packages/contracts/openapi.json`.
3. Génération des types TypeScript (`make gen-types`) dans `packages/shared-js/src/types/api-types.ts`.
4. Import des types côté frontend (ex: `import { ... } from 'packages/shared-js/src/types/api-types'`).
5. Régénérer à chaque changement d'entités ou de routes.

## 5. Prérequis & Installation
Outils locaux (optionnels si usage Docker):
- PHP ≥ 8.3 + Composer
- Node.js ≥ 20 + npm
- Docker + Traefik (réseau externe `traefik`)

Installation locale:
```
(cd apps/backend && composer install)
(cd apps/frontend && npm install)
```
Via Makefile (containers):
```
make backend-install
make frontend-install
```

## 6. Démarrage développement
Lancer services (php, node, nginx) via docker compose (cf. `infra/compose.yaml`) ou cibles Makefile:
```
make dev            # (optionnel: script combiné si ajouté)
make frontend-dev   # Vite sur 5173 (proxy via universe.localhost)
make backend-serve  # Option locale hors nginx/Traefik
```
Accès domaines:
- Front: http(s)://universe.localhost
- API:   http(s)://api.universe.localhost

## 7. Configuration Front (Vite / API Base)
Variable d'environnement définissant la base API:
```
apps/frontend/.env.development:
VITE_API_BASE=https://api.universe.localhost
```
Utilisation dans le code:
```
fetch(`${import.meta.env.VITE_API_BASE}/ping`)
```
HMR configuré en WebSocket simple (non TLS) côté dev. Ajuster `vite.config.ts` si HTTPS + certificat fiable requis.

## 8. Génération des contrats & Types
Commande combinée:
```
make gen-all
```
Étapes séparées:
```
make gen-openapi   # met à jour openapi.json
make gen-types     # régénère api-types.ts
```
Inclure la diff OpenAPI dans la revue si endpoints changent.

## 9. Qualité & Lint
Backend:
- PHPStan niveau défini dans `apps/backend/phpstan.neon`.
- PHP-CS-Fixer (PSR-12 + règles projet).
Frontend:
- ESLint + plugin Vue.
- Prettier (quotes simples, largeur 100, points-virgules).
Cibles:
```
make lint-php
make lint-js
```

## 10. Tests
Backend:
```
vendor/bin/phpunit                    # tous
vendor/bin/phpunit tests/Controller/PingControllerTest.php
```
Frontend:
```
npm run test        # vitest run
npm run test:coverage
```
Règles:
- Mock `fetch` côté frontend (pas d'appel réseau réel).
- Pas de dépendance Symfony dans Domain/Application.
- Contrôleurs testés via WebTestCase + assertions HTTP.

## 11. Conventions de contribution
Branches: `feat/*`, `fix/*`, `chore/*`, `docs/*`.
Commits orientés "pourquoi" (Conventional Commits).
Toujours régénérer schéma + types avant PR si endpoints changent.

## 12. Décisions (ADR)
Dossier: `docs/adr`. Format: Contexte / Décision / Conséquences / Alternatives.
ADR existantes: voir `docs/adr/0001-...`, `0002-...`.

## 13. Roadmap
Court terme:
- Stabiliser séparation sous-domaines.
- Couverture tests ping end-to-end.
- Automatiser gen-all en CI.
Moyen terme:
- Auth JWT.
- Normalisation erreurs (backend + interceptors fetch).
Long terme:
- Déploiement container orchestration.
- Monitoring / tracing.

## 14. FAQ rapide
Q: Pourquoi un sous-domaine API plutôt qu'un préfixe `/api` ?
A: Séparation claire cache/CORS, règles de sécurité distinctes, pas de réécriture interne.
Q: Quand régénérer les types ?
A: Avant chaque PR modifiant endpoints ou schéma.
Q: Peut-on ajouter un SDK JS ?
A: Préférer types + gateways légers; un SDK arrive seulement si logique client complexe.

## 15. Cibles Makefile (récapitulatif)
```
backend-install
backend-serve
backend-console <cmd>
frontend-install
frontend-dev
gen-openapi
gen-types
gen-all
lint-php
lint-js
```

## 16. Sécurité (prévision)
- CORS restrictif une fois domaines figés.
- Auth JWT + refresh sécurisé.
- Analyse dépendances (npm audit / composer audit) en CI.

## 17. Contribution
1. Créer branche.
2. Implémenter feature / fix.
3. Mettre à jour schéma + types si endpoints.
4. Lancer tests + lint.
5. Ouvrir PR (décrire le "pourquoi").
6. Review & merge.

---
### Notes
Ce document évolue avec le projet. Propose des PR pour le compléter.
