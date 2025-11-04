# Monorepo Symfony + Vue Makefile (compose-based)
# Toutes les commandes passent par docker compose (services définis dans docker-compose.yml)

BACKEND_DIR=apps/backend
FRONTEND_DIR=apps/frontend
CONTRACTS_FILE=packages/contracts/openapi.json
COMPOSER_RUN=docker compose -f infra/compose.yaml run --rm php composer
NODE_RUN=docker compose -f infra/compose.yaml run --rm node

.PHONY: help backend-install backend-console frontend-install frontend-dev gen-openapi gen-types gen-all dev lint-php lint-js test-php php-cs-fix clean

help:
	@echo "Cibles disponibles:"
	@echo "  backend-install     : composer install (service php)"
	@echo "  backend-console ARGS: commande console Symfony dans service php"
	@echo "  frontend-install    : npm install (service node)"
	@echo "  frontend-dev        : npm run dev (service node)"
	@echo "  gen-openapi         : export OpenAPI vers $(CONTRACTS_FILE)"
	@echo "  gen-types           : générer types TypeScript depuis OpenAPI"
	@echo "  gen-all             : openapi + types"
	@echo "  dev                 : (simple) lance backend + frontend locaux (non compose)"
	@echo "  lint-php            : phpstan + php-cs-fixer (dry-run) via compose"
	@echo "  lint-js             : eslint via compose"
	@echo "  php-cs-fix          : appliquer corrections php-cs-fixer via compose"
	@echo "  test-js             : tests frontend (vitest)"
	@echo "  build               : build images (infra/compose.yaml)"
	@echo "  start               : démarrer les services (détaché)"
	@echo "  stop                : arrêter les services"

backend-install:
	$(COMPOSER_RUN) install

backend-console:
	docker compose -f infra/compose.yaml run --rm php php bin/console $(filter-out $@,$(MAKECMDGOALS))

frontend-install:
	$(NODE_RUN) npm install

frontend-dev:
	$(NODE_RUN) npm run dev

# Export du schéma OpenAPI via API Platform
gen-openapi:
	docker compose -f infra/compose.yaml run --rm php php bin/console api:openapi:export --output openapi.json
	mv $(BACKEND_DIR)/openapi.json $(CONTRACTS_FILE)

# Génération des types TS (nécessite openapi.json) via openapi-typescript
gen-types:
	cp $(CONTRACTS_FILE) $(FRONTEND_DIR)/openapi.json
	$(NODE_RUN) npx openapi-typescript openapi.json -o ../../packages/shared-js/src/types/api-types.ts || (rm $(FRONTEND_DIR)/openapi.json; exit 1)
	rm $(FRONTEND_DIR)/openapi.json
	@echo "Types générés: packages/shared-js/src/types/api-types.ts"

# Tout en une fois
gen-all: gen-openapi gen-types

# (Ancien) Lancement simple hors conteneur pour usage rapide.
dev:
	@echo "Démarrage backend (port 8000) et frontend (port 5173) hors docker compose"
	@make -j2 backend-serve frontend-dev || true

# Lint PHP via services compose
lint-php:
	$(COMPOSER_RUN) exec -- vendor/bin/phpstan analyse || true
	$(COMPOSER_RUN) exec -- vendor/bin/php-cs-fixer fix --dry-run --diff || true


lint-js:
	$(NODE_RUN) npm run lint || true

# Tests frontend (Vitest)
test-js:
	$(NODE_RUN) npm run test:coverage || true

# Tests PHP
test-php:
	$(COMPOSER_RUN) exec vendor/bin/phpunit || echo "PHPUnit non installé"

# Corrections php-cs-fixer
php-cs-fix:
	$(COMPOSER_RUN) exec vendor/bin/php-cs-fixer fix --verbose

# Serveur local PHP intégré (option hors compose) conservé pour usage ponctuel
backend-serve:
	php -S 0.0.0.0:8000 -t $(BACKEND_DIR)/public $(BACKEND_DIR)/public/index.php

build:
	docker compose -f infra/compose.yaml build

start:
	docker compose -f infra/compose.yaml up -d

stop:
	docker compose -f infra/compose.yaml down

clean:
	rm -rf $(BACKEND_DIR)/var/cache/* $(FRONTEND_DIR)/dist
