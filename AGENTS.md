# Directives AGENTS (Concises)
1. Serveurs dev : `make backend-serve`, `make frontend-dev`, ou les deux `make dev`.
2. Installer dépendances : `make backend-install`, `make frontend-install`.
3. Export + types : `make gen-openapi`, `make gen-types`, combo `make gen-all`.
4. Tests backend : tous `vendor/bin/phpunit`; un test : `vendor/bin/phpunit tests/Controller/PingControllerTest.php` ou `tests/Application/PingHandlerTest.php`.
5. Tests frontend : tous `npm run test`; un fichier : `npx vitest run src/api/ping.test.ts`.
6. Lint : PHP `make lint-php`; JS `make lint-js`; build frontend `npm run build`.
7. Style PHP : PSR-12, tableaux courts, imports alphabétiques, pas d'import inutile, phpdoc cohérent, propriétés `readonly` si possible.
8. Analyse statique PHP : PHPStan niveau 6 (`apps/backend/phpstan.neon`); éviter les suppressions injustifiées.
9. Style TypeScript : Prettier (quotes simples, points-virgules, largeur 100); types/interfaces explicites; éviter `any`; affiner unions.
10. Ordre imports : libs externes, types partagés (`packages/shared-js`), modules locaux relatifs; retirer non utilisés.
11. Conventions noms : PascalCase (classes PHP, composants Vue), camelCase (fonctions/variables), SCREAMING_SNAKE (constantes PHP).
12. Erreurs backend : lever exceptions domaine/application; aucun catch silencieux; journaliser ou relancer.
13. Erreurs frontend : vérifier `res.ok`; parser JSON; exposer message utile; ne jamais étouffer l'erreur.
14. Sync API/OpenAPI : régénérer spec & types si endpoints/entities changent; inclure diff en revue.
15. Tests : rapides/purs; contrôleur via WebTestCase; frontend mock `fetch`; asserter structure + codes HTTP.
16. Séparation : Domain/Application sans dépendances Symfony/Infra; contrôleurs délèguent aux handlers.
17. Pas de couplage inter-runtime sauf OpenAPI + types TS générés.
18. Outils : privilégier Makefile existant; n'ajouter que si nécessaire.
19. ADR : consigner décisions dans `docs/adr` (contexte / décision / conséquences).
20. NE JAMAIS commit automatiquement : l'agent ne commit que sur instruction explicite utilisateur.
