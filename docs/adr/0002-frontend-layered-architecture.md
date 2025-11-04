# ADR 0002: Architecture Frontend en Couches (Domain / Application / Infrastructure / Interface)

Date: 2025-11-04
Statut: Accepté
Auteur: Équipe Technique

## Contexte
Le frontend initial mélangeait logique d'appel API, composition de données et affichage dans les composants Vue (dossiers `api/`, `views/`, `store/`). Cette approche rend difficile :
- Le test unitaire ciblé (les composants requièrent le runtime Vue complet).
- L'évolution des appels réseau (ex: gestion d'erreurs, retrys, auth) sans toucher les composants.
- La symétrie conceptuelle avec le backend qui adopte déjà une architecture en couches.

## Décision
Introduire quatre couches explicites dans `apps/frontend/src/` :
- `domain/`: Types et modèles métier purs (aucun accès réseau, aucun import Vue).
- `application/`: Cas d'utilisation / services orchestrant les gateways (logique procédurale légère, aucune dépendance UI ou fetch direct).
- `infrastructure/`: Gateways techniques (HTTP via `fetch`, store Pinia, adaptateurs externes). Vérifie `res.ok`, parse JSON, map vers types de domaine.
- `interface/`: Couche Vue (composants, router, App.vue, main.ts) ne contenant que composition d'état et binding UI.

## Alternatives Considérées
1. Conserver la structure simple Vite (tout dans `src/`): rejeté (couplage fort UI / réseau).
2. Ajouter seulement un dossier `services/` : rejeté (ambiguïté entre logique métier et adaptation technique).
3. Utiliser un pattern global store unique (type Redux) pour tout: rejeté (sur-ingénierie actuelle, overhead).

## Conséquences
Positives:
- Testabilité accrue (services testés sans Vue ni JSDOM, composants testés avec mocks simples).
- Réduction duplication d'erreur (vérification HTTP centralisée dans gateways).
- Alignement conceptuel backend / frontend facilitant l'onboarding.
- Évolution future (auth, retry, instrumentation) encapsulée dans Infrastructure.

Négatives:
- Davantage de dossiers pour un petit périmètre actuel (coût cognitif initial).
- Requiert discipline sur les dépendances directionnelles.

## Règles de Dépendance
- Interface -> Application -> Domain (lecture) + Infrastructure (via services uniquement si nécessaire).
- Application -> Domain + Infrastructure.
- Infrastructure -> Domain (types) uniquement.
- Domain -> (aucune dépendance interne au projet hors types primitifs/Value Objects).

## Impacts sur les Tests
- `tests/application`: mock `global.fetch` pour isoler la logique d'orchestration.
- `tests/interface`: montent les composants et vérifient flux utilisateur + rendu.
- Pas de test d'infrastructure direct tant que la logique reste triviale (ils sont couverts via application/tests interface).

## Plan de Migration (effectué)
1. Déplacement fichiers dans nouveaux dossiers (domain, application, infrastructure, interface).
2. Mise à jour imports relatifs.
3. Ajout test `pingService` (application) + test `PingView` (interface).
4. Mise à jour `index.html` vers nouvelle entrée `interface/main.ts`.
5. Documentation mise à jour (`architecture.md`).

## Validation
- Build Vite fonctionnel après correction du chemin d'entrée.
- Tests Vitest (application) passent; test interface en cours d'amélioration pour stabilité d'async.
- Lint OK (structure n'introduit pas de code invalide).

## Suivi
- Ajouter conventions d'alias éventuels (`@domain`, `@app`, etc.) si profondeur relative devient pénible.
- Introduire des thresholds de couverture (statements/branches) une fois spectre de tests élargi.
- Nouvelles fonctionnalités devront fournir ADR si elles modifient ce modèle (ex: ajout CQRS côté frontend, event bus interne).
