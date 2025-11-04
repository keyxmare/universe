# Architecture Monorepo

## Backend (Symfony)
Chemin: `apps/backend`
```
config/      # Configuration bundles + packages
src/         # Code applicatif (Domain, Application, Infrastructure, Interface)
public/      # Front controller, assets exposés
tests/       # Tests PHPUnit (unit + integration)
```

Organisation dans `src/` (clean architecture adaptée):
```
Domain/        # Valeur métier (Value Objects), règles pures
Application/   # Cas d'utilisation (handlers orchestrant le domaine)
Infrastructure/# Adaptateurs techniques (DB, services externes) - vide si inutile
Interface/     # Interface utilisateur/sortie (Http/Controller, CLI plus tard)
  Http/Controller/ # Contrôleurs Symfony minces déléguant aux handlers
```

Exemple actuel: Ping -> `PingHandler` (Application) retourne `PingResult` (Domain) servi par `PingController` (Interface/Http).

Dossiers supprimés hérités (ApiResource, Entity, Repository, Controller) pour réduire le bruit tant qu'aucune persistance n'est nécessaire.

## Frontend (Vue + Vite)
Chemin: `apps/frontend`
```
src/
  domain/        # Modèles métier (types purs)
  application/   # Services / cas d'utilisation orchestrant les gateways
  infrastructure/# Adaptateurs techniques (HTTP, store Pinia, autres)
  interface/     # UI (composants/pages, router, App.vue, main.ts)
  tests/         # Tests (miroir des couches, futurs tests interface)
```
Principes:
- Layering aligné sur le backend (Domain/Application/Infrastructure/Interface).
- `infrastructure/pingGateway` isole fetch + vérification `res.ok`.
- `application/*Service` délègue aux gateways sans logique de présentation.
- `interface/views` déclenche les cas d'utilisation et gère l'état local.
- Types OpenAPI partagés importés depuis `packages/shared-js` quand nécessaire.


## Shared (packages/shared-js)
```
src/
  types/  # Types OpenAPI générés
```

## Contrats (packages/contracts)
`openapi.json` : Spécification OpenAPI générée depuis le backend (actuellement minimale après suppression Status).

## Flux de génération des types
1. `make gen-openapi` exporte la spec.
2. `make gen-types` génère `packages/shared-js/src/types/api-types.ts`.
3. Frontend consomme ces types dans les gateways d'infrastructure (`src/infrastructure/*Gateway.ts`) ou directement dans l'application si besoin (jamais dans Domain).


## Principes
- Couplage faible via OpenAPI uniquement.
- Domain/Application sans dépendances Symfony.
- Interface traduit les résultats en HTTP.
- Ajout infra seulement quand un adaptateur apparaît (ex: Doctrine).

## Évolution
- Introduire persistance -> ajouter repositories en Infrastructure.
- Étendre Interface (CLI, Messages) si besoin.

## Tests
Backend:
- Unitaires: Domain + Application (handlers) sans kernel.
- Intégration: Contrôleurs via WebTestCase.
Frontend:
- `tests/application`: services (cas d'utilisation) mockant `fetch`.
- `tests/interface`: composants Vue montés avec mocks gateways.
- Objectif: éviter logique métier dans composants; tests d'interface se limitent au flux utilisateur.
