# 0003 – Makefile-based Container Orchestration

Date: 2025-11-04

## Contexte
Le monorepo contient un backend Symfony et un frontend Vue. Les actions courantes (install, tests, dev, build) étaient dispersées et nécessitaient des commandes docker compose explicites ou des scripts séparés. L'aide des Makefiles était minimale et l'exécution silencieuse/non-silencieuse n'était pas paramétrable.

## Décision
1. Centraliser l'orchestration via le `Makefile` racine pour les cibles communes (`up`, `down`, `start`, `stop`, `build`, `install`, `test`, `logs`, `clean`, `rebuild`).
2. Utiliser `docker compose -p universe -f infra/compose.yaml` uniformément (variable `DC`).
3. Déléguer aux sous-projets via `make backend <target>` et `make frontend <target>` tout en conservant une aide dynamique uniforme (colonne d'alignement 20 caractères, couleur).
4. Faire dépendre `install` et `test` de `up` pour garantir que les services sont lancés avant exécution dans containers.
5. Exécuter les commandes `composer install` et `npm install` à l'intérieur des containers correspondants pour homogénéiser l'environnement.
6. Ajouter des cibles de maintenance rapide: `clean` (supprimer vendor/node_modules locaux) et `rebuild` (down + build + up + install).

## Conséquences
- Simplification du flux développeur: `make install`, `make test` sont cohérents.
- Réduction du risque de divergence d'environnement local vs container.
- Aide enrichie et centralisée facilite la découverte des commandes.
- L'utilisation du projet docker `universe` évite les collisions de noms et permet un nettoyage ciblé.
- L'effacement de `vendor` / `node_modules` local peut nécessiter une ré-installation explicite; documenté dans l'aide.

## Alternatives Considérées
- Scripts shell séparés par language: rejeté (duplication, maintenance accrue).
- Utilisation directe de `docker compose` sans Makefile: rejeté (ergonomie réduite, absence d'aide dynamique).
- Outil d'orchestration dédié (task runner avancé): prématuré pour taille actuelle du repo.

## Prochaines étapes
- Éventuellement ajouter vérification de présence d'images avant `up` pour optimiser.
- Surveiller complexité et scinder si le Makefile racine devient trop volumineux.
