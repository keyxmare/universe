# Monorepo Symfony + Vue

Modèle A: chaque application garde son propre manifest (`composer.json` dans le backend, `package.json` dans le frontend). Pas de dépendances croisées runtime; la synchronisation se fait via les contrats OpenAPI et des types générés.

## Sommaire
1. Objectifs & Philosophie
2. Structure d'architecture
3. Flux OpenAPI / Types partagés
4. Prérequis & Installation
5. Démarrage développement
6. Génération des contrats & Types
7. Qualité & Lint
8. Tests (plan)
9. Conventions de contribution
10. Décisions (ADR)
11. Roadmap

---
## 1. Objectifs & Philosophie
- Séparer clairement backend (API HTTP REST/JSON) et frontend (SPA Vue + Vite).
- Favoriser l'évolution indépendante (cycles de release différents).
- Réduire le couplage par un contrat explicite (OpenAPI) versionné dans `packages/contracts`.
- Offrir un espace pour le code transversal JS (types, petits utilitaires) dans `packages/shared-js`.
- Rester minimaliste et itératif; ajouter seulement ce qui sert un besoin concret.

## 2. Structure d'architecture
```
apps/
  backend/         # Projet Symfony (API Platform, CORS, Domain code)
  frontend/        # Projet Vue (Vite, Pinia, Router)
packages/
  contracts/       # Fichier openapi.json exporté depuis backend
  shared-js/       # Types TS générés + helpers transversaux
infra/
  docker/          # Dockerfiles et config nginx
scripts/           # Scripts utilitaires (ex: gen-types.sh)
docs/              # Documentation technique, ADR
```
Détails backend (ciblé) :
```
apps/backend/src/
  Domain/          # (à créer) Entités métier, Value Objects
  Application/     # (à créer) Use cases, services applicatifs
  Infrastructure/  # (à créer) Adaptateurs (Doctrine, HTTP, etc.)
  Interface/       # (à créer) Contrôleurs, DTO entrée/sortie
```
Détails frontend :
```
apps/frontend/src/
  views/           # Pages routées
  router/          # Configuration Vue Router
  store/           # Pinia stores
  api/             # Clients/fonctions d'accès API
  components/      # (à créer) Composants UI réutilisables
```

## 3. Flux OpenAPI / Types partagés
1. Le backend expose le schéma via API Platform (`api:openapi:export`).
2. Le schéma est déplacé dans `packages/contracts/openapi.json` pour être versionné.
3. Génération des types TypeScript depuis le schéma => `packages/shared-js/src/types/api-types.ts`.
4. Le frontend et toute lib JS interne importent ces types pour les appels API.
5. Régénérer à chaque changement de endpoints ou modèles.

## 4. Prérequis & Installation
Prérequis outils (optionnel grâce aux images Docker des cibles Makefile) :
- PHP ≥ 8.3 + Composer
- Node.js ≥ 20 + npm
- Docker (si usage des images officielles via Makefile)

Installation classique (local hors Docker) :
```
(cd apps/backend && composer install)
(cd apps/frontend && npm install)
```
Installation via Makefile (Docker images) :
```
make backend-install
make frontend-install
```

## 5. Démarrage développement
Backend (serveur PHP intégré port 8000) :
```
make backend-serve
```
Frontend (Vite port 5173) :
```
make frontend-dev
```
Démarrage simultané (non supervisé) :
```
make dev
```
Accès :
- API: http://localhost:8000
- Frontend: http://localhost:5173

## 6. Génération des contrats & Types
Export OpenAPI + génération types en une seule commande :
```
make gen-all
```
Étapes séparées :
```
make gen-openapi   # produit packages/contracts/openapi.json
make gen-types     # produit packages/shared-js/src/types/api-types.ts
```
Script alternatif : `scripts/gen-types.sh` (peut être appelé dans CI).

## 7. Qualité & Lint
Backend :
- Analyse statique: PHPStan (`apps/backend/phpstan.neon`).
- Format/Style: PHP-CS-Fixer (`apps/backend/.php-cs-fixer.dist.php`).
Frontend :
- ESLint (`apps/frontend/.eslintrc.cjs`).
- Prettier (`apps/frontend/.prettierrc.json`).
Commandes (placeholders robustes) :
```
make lint-php
make lint-js
```

## 8. Tests (plan)
Backend (à ajouter) :
```
composer require --dev phpunit/phpunit
# Créer dossier tests/ avec premiers cas (Ping, Status)
make test-php  # après installation
```
Frontend :
```
npm install -D vitest @vitest/ui jsdom
# Ajouter script "test": "vitest"
```
Intégration CI : ajouter étapes pour exécuter `make test-php` puis `npm run test` (frontend) après génération des types.

## 9. Conventions de contribution
Branches :
- `feat/<description>` nouvelles fonctionnalités
- `fix/<description>` corrections de bugs
- `chore/<description>` tâches techniques (maj deps, refacto légère)
- `docs/<description>` documentation
Commits (Conventional Commits) :
```
feat: ajouter endpoint status
fix: corriger réponse ping invalide
chore: mettre à jour dépendances frontend
```
Pull Requests :
- Inclure le "pourquoi" dans la description.
- Lier à une issue si existante.

## 10. Décisions (ADR)
Dossier: `docs/adr/` (à créer). Chaque décision :
- Identifiant incrémental (ex: `0001-modele-monorepo.md`).
- Contexte, décision, conséquences, alternatives rejetées.
Décisions à formaliser :
1. Choix Modèle A (manifests isolés).
2. Usage API Platform pour accélérer la livraison d'OpenAPI.
3. Génération des types côté frontend plutôt qu'un SDK complet.

## 11. Roadmap
Court terme (Semaine 1) :
- Ajouter tests initiaux backend & frontend.
- Intégrer exécution tests dans CI.
- Mettre en place ADR initiale.
- Générer baseline PHPStan si bruit.
Moyen terme :
- Authentification (JWT via `lexik/jwt-authentication-bundle`).
- Gestion erreurs unifiée (normalizers API Platform + interceptors frontend).
- Observabilité (logs structurés + éventuellement tracing). 
Long terme :
- Déploiement containerisé (Docker/Helm).
- Sécurité avancée (rate limiting, audit).
- Internationalisation frontend.

## 12. FAQ rapide
Q: Quand régénérer les types ?
A: À chaque modification d'entité exposée, d'endpoint ou de schéma (avant merge du PR).
Q: Peut-on ajouter un package partagé PHP ?
A: Oui, prévoir `packages/shared-php` si besoin de logique transverse serveur.
Q: Comment éviter la dérive schéma/types ?
A: Automatiser `make gen-all` dans CI et comparer diff (future étape).

---
## 13. Scripts & Cibles Makefile (récapitulatif)
Principales cibles :
```
backend-install   # composer install
backend-serve     # serveur PHP local (8000)
backend-console   # exécuter commande Symfony (ex: make backend-console cache:clear)
frontend-install  # npm install
frontend-dev      # serveur Vite (5173)
gen-openapi       # export schéma OpenAPI
gen-types         # génération types TS
gen-all           # schéma + types
lint-php          # phpstan + cs-fixer dry-run
lint-js           # eslint (frontend)
```

## 14. Sécurité (prévision)
- Activer stricts headers CORS une fois domaines connus.
- Ajouter authentification JWT + rafraîchissement sécurisé.
- Scanner dépendances (npm audit, composer audit) dans CI (future étape).

## 15. Contribution
1. Créer branche (`feat/...`).
2. Développer + mettre à jour schéma si endpoints.
3. `make gen-all` puis commit des artefacts modifiés.
4. Ouvrir PR avec description orientée "pourquoi".
5. Reviewer valide (tests, lint, types). Merge squashed ou fast-forward selon politique.

---
### Notes
Ce document évoluera avec l'avancement du projet. N'hésite pas à proposer une PR pour le compléter.
