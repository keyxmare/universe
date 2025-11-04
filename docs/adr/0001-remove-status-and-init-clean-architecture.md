# ADR 0001: Suppression de l'entité Status et démarrage d'une architecture en couches

Date: 2025-11-04
Statut: Accepté
Auteur: Équipe Technique

## Contexte
Le projet a démarré avec une entité `Status` exposée via API Platform (operations GET + GET collection). Cette ressource ne sert plus de cas d’usage réel : aucune logique métier associée, pas de consommation côté frontend, et elle complique le contrat OpenAPI (schémas Hydra supplémentaires, bruit dans les types générés). Par ailleurs, le backend ne suit pas encore une séparation claire des responsabilités (mélange contrôleur / logique). Nous souhaitons amorcer une architecture plus propre pour faciliter l’évolution (Domain / Application / Infrastructure / Interface HTTP) en partant du cas le plus simple : l’endpoint de ping.

## Décision
1. Supprimer définitivement l’entité `Status` (code Doctrine + annotations ApiPlatform) et retirer ses paths/schemas du contrat OpenAPI.
2. Régénérer les types TypeScript partagés pour refléter un contrat épuré.
3. Introduire une structure en couches pour les futures fonctionnalités :
   - Domain: objets de valeur et règles métier pures.
   - Application: orchestration de cas d’usage (handlers/services) sans dépendances framework.
   - Infrastructure: adaptation (Doctrine, API Platform, persistance, framework specifics).
   - Interface (HTTP): contrôleurs Symfony minces déléguant aux handlers Application.
4. Démarrer par la création d’un `PingHandler` (Application) retournant un résultat typé (`PingResult` valeur de domaine) au lieu de coder directement la réponse dans le contrôleur.
5. Conserver le contrat de l’endpoint ping pour le moment (pas de changement côté frontend) afin d’éviter une cascade de modifications inutiles. Toute évolution future (ex: ajout de latence, version, statut interne) se fera via une mise à jour contrôlée de l’OpenAPI.

## Alternatives Considérées
- Conserver `Status` en tant que ressource factice: Rejeté (bruit + maintenance inutile).
- Ne pas introduire de couches formalisées tant que le domaine est simple: Rejeté (mieux d’établir les fondations tôt pour éviter refactor coûteux plus tard).
- Refactor global immédiat de toutes parties (big bang): Rejeté (risque élevé, peu de valeur incrémentale, difficile à valider sans régression).

## Conséquences
### Positives
- Contrat OpenAPI minimal, plus rapide à lire et à générer.
- Types partagés simplifiés (`api-types.ts`) réduisant le risque d’erreurs côté frontend.
- Base claire pour ajouter des règles métier sans gonfler les contrôleurs.
- Facilite tests unitaires (handlers/domain testables sans kernel Symfony).

### Négatives / Coûts
- Légère surcharge initiale de structure pour de petits cas d’usage.
- Nécessite discipline pour maintenir les frontières (éviter fuite d’infrastructure dans Application/Domain).

### Risques
- Risque de sur‑ingénierie si le domaine reste trivial (à surveiller via revues). 
- Multiplication des dossiers / classes si chaque endpoint est trop fragmenté (documenter conventions).

## Actions Suivantes
1. Créer dossiers (si pas existants) `apps/backend/src/Domain`, `Application`, `Infrastructure` (au besoin) et implémenter `PingHandler` + `PingResult`.
2. Adapter `PingController` pour déléguer au handler.
3. Ajouter tests unitaires pour `PingHandler` (pas de dépendances framework) et conserver le test d’intégration existant.
4. Mettre à jour documentation architecture (`docs/architecture.md`) avec la vue en couches.
5. Définir convention de nommage pour handlers (`*Handler` ou `*Service`) et objets de domaine (`*Result`, `*Id`, etc.).
6. Avant toute extension de l’API, régénérer OpenAPI + types (`make gen-all`) et inclure dans PR.

## Mesures de Validation
- Lancement des tests backend existants inchangés après refactor (Ping toujours OK).
- Vérification que le contrat OpenAPI ne réintroduit pas d’artefacts Hydra inutiles.
- Revue de code pour s’assurer qu’aucune dépendance Symfony n’entre dans Application/Domain.

## Suivi
Ce document pourra être amendé si le modèle de couches évolue (ex: ajout d’une couche "Presentation" distincte ou introduction de CQRS). Un ADR ultérieur décrira l’adoption potentielle d’un bus de commandes/événements si nécessaire.
