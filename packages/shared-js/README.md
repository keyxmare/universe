# shared-js

Librairie JavaScript/TypeScript partagée.

## Dossiers
- src/api : client HTTP / wrappers
- src/types : types générés (OpenAPI) + types manuels
- src/utils : fonctions utilitaires réutilisables

## Génération des types (à venir)
Utiliser `openapi-typescript ../contracts/openapi.yaml -o src/types/api-types.ts`.
